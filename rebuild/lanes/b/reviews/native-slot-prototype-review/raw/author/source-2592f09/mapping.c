/* PM384: standalone Windows invented-data prototype. No app integration. */
#include <node_api.h>
#include <windows.h>
#include <stdint.h>
#include <stddef.h>
#include <stdlib.h>
#include <string.h>
#include <stdio.h>

/* These two overrides produce explicitly recorded incompatible test fixtures. */
#ifndef SLOT_VERSION
#define SLOT_VERSION 1u
#endif
#ifndef SLOT_VIEW_BYTES
#define SLOT_VIEW_BYTES 64u
#endif
#define SLOT_MAGIC 0x45534c54u
#define SLOT_COOKIE 0x4e534854u
#define SLOT_REFUSED 5L
#define SLOT_NAME_PREFIX "Local\\EarnedSlot-"

typedef struct {
  volatile LONG ready;
  uint32_t magic, version, bytes, owner_pid;
  char nonce[32];
  volatile LONG progress;
  unsigned char reserved[8];
} slot_state;
_Static_assert(sizeof(slot_state) == 64, "fixed protocol layout");
_Static_assert(sizeof(LONG) == 4, "Windows interlocked width");
_Static_assert(offsetof(slot_state, progress) % 4 == 0, "aligned progress");
_Static_assert(SLOT_VIEW_BYTES >= sizeof(slot_state), "view contains header");

typedef struct {
  uint32_t cookie, process_id, owner_pid;
  int owner, closed, cleanup_registered;
  char nonce[32];
  HANDLE mapping;
  slot_state* view;
  napi_env env;
  napi_ref root;
} slot_handle;
static const napi_type_tag HANDLE_TAG = {
  UINT64_C(0x582a3da1bdbba721), UINT64_C(0x13a18a9052e65d4c)
};

static napi_value fail(napi_env env, const char* code) {
  napi_throw_error(env, code, code);
  return NULL;
}
static napi_value os_fail(napi_env env, const char* code, DWORD error) {
  char message[96];
  snprintf(message, sizeof(message), "%s (Win32 %lu)", code, (unsigned long)error);
  napi_throw_error(env, code, message);
  return NULL;
}
static DWORD release_view(slot_handle* h) {
  DWORD first = 0;
  if (h->view) {
    if (UnmapViewOfFile(h->view)) h->view = NULL;
    else first = GetLastError();
  }
  if (h->mapping) {
    if (CloseHandle(h->mapping)) h->mapping = NULL;
    else if (!first) first = GetLastError();
  }
  return first;
}
static napi_status drop_root(slot_handle* h) {
  if (!h->root) return napi_ok;
  napi_status status = napi_delete_reference(h->env, h->root);
  if (status == napi_ok) h->root = NULL;
  return status;
}
static void environment_cleanup(void* data) {
  slot_handle* h = data;
  h->cleanup_registered = 0;
  h->closed = 1;
  release_view(h);
  drop_root(h);
  /* Node invokes the external's finalizer after environment cleanup hooks. */
}
static void finalize_handle(napi_env env, void* data, void* hint) {
  (void)hint;
  slot_handle* h = data;
  if (h->cleanup_registered) {
    if (napi_remove_env_cleanup_hook(env, environment_cleanup, h) != napi_ok) return;
    h->cleanup_registered = 0;
  }
  h->closed = 1;
  release_view(h);
  if (drop_root(h) != napi_ok || h->view || h->mapping) return;
  h->cookie = 0;
  free(h);
}
static napi_value publish_handle(napi_env env, slot_handle* h) {
  napi_value result;
  if (napi_create_external(env, h, finalize_handle, NULL, &result) != napi_ok) {
    release_view(h);
    free(h);
    return fail(env, "SLOT_EXTERNAL_FAILED");
  }
  /* From here the external finalizer owns h, even if setup later fails. */
  if (napi_type_tag_object(env, result, &HANDLE_TAG) != napi_ok ||
      napi_create_reference(env, result, 1, &h->root) != napi_ok) {
    h->closed = 1;
    release_view(h);
    drop_root(h);
    return fail(env, "SLOT_ROOT_FAILED");
  }
  if (napi_add_env_cleanup_hook(env, environment_cleanup, h) != napi_ok) {
    h->closed = 1;
    release_view(h);
    drop_root(h);
    return fail(env, "SLOT_CLEANUP_HOOK_FAILED");
  }
  h->cleanup_registered = 1;
  /* Default Node-API callback scope remains valid through this return. */
  return result;
}
static int exact_ascii(napi_env env, napi_value value, char* out, size_t count) {
  size_t actual = 0;
  if (napi_get_value_string_utf8(env, value, NULL, 0, &actual) != napi_ok || actual != count)
    return 0;
  if (napi_get_value_string_utf8(env, value, out, count + 1, &actual) != napi_ok || actual != count)
    return 0;
  for (size_t i = 0; i < count; ++i) if ((unsigned char)out[i] < 33 || (unsigned char)out[i] > 126) return 0;
  return 1;
}
static int hex32(const char* value) {
  for (size_t i = 0; i < 32; ++i)
    if (!((value[i] >= '0' && value[i] <= '9') || (value[i] >= 'a' && value[i] <= 'f'))) return 0;
  return 1;
}
static int identity_args(napi_env env, napi_value name_value, napi_value nonce_value,
                         char name[64], char nonce[33]) {
  size_t prefix = strlen(SLOT_NAME_PREFIX);
  return exact_ascii(env, name_value, name, prefix + 32) &&
    memcmp(name, SLOT_NAME_PREFIX, prefix) == 0 && hex32(name + prefix) &&
    exact_ascii(env, nonce_value, nonce, 32) && hex32(nonce);
}
static int exact_u32(napi_env env, napi_value value, uint32_t* out) {
  double number;
  if (napi_get_value_double(env, value, &number) != napi_ok ||
      !(number >= 1 && number <= UINT32_MAX)) return 0;
  uint32_t converted = (uint32_t)number;
  if ((double)converted != number) return 0;
  *out = converted;
  return 1;
}
static slot_handle* get_handle(napi_env env, napi_value value, int allow_closed) {
  napi_valuetype type;
  bool tagged = false;
  void* data = NULL;
  if (napi_typeof(env, value, &type) != napi_ok || type != napi_external ||
      napi_check_object_type_tag(env, value, &HANDLE_TAG, &tagged) != napi_ok || !tagged ||
      napi_get_value_external(env, value, &data) != napi_ok || !data) {
    fail(env, "SLOT_INVALID_HANDLE"); return NULL;
  }
  slot_handle* h = data;
  if (h->cookie != SLOT_COOKIE || h->env != env || h->process_id != GetCurrentProcessId()) {
    fail(env, "SLOT_INVALID_HANDLE"); return NULL;
  }
  if (!allow_closed && (h->closed || !h->view || !h->mapping)) {
    fail(env, "SLOT_CLOSED_HANDLE"); return NULL;
  }
  return h;
}
static int valid_header(slot_handle* h) {
  slot_state* p = h->view;
  return InterlockedCompareExchange(&p->ready, 0, 0) == 1 &&
    p->magic == SLOT_MAGIC && p->version == SLOT_VERSION &&
    p->bytes == SLOT_VIEW_BYTES && p->owner_pid == h->owner_pid &&
    memcmp(p->nonce, h->nonce, 32) == 0;
}
static slot_handle* new_handle(napi_env env, uint32_t owner_pid, const char nonce[33], int owner) {
  slot_handle* h = calloc(1, sizeof(*h));
  if (!h) { fail(env, "SLOT_ALLOCATION_FAILED"); return NULL; }
  h->cookie = SLOT_COOKIE; h->process_id = GetCurrentProcessId(); h->owner_pid = owner_pid;
  h->owner = owner; h->env = env; memcpy(h->nonce, nonce, 32);
  return h;
}
static napi_value create_slot(napi_env env, napi_callback_info info) {
  size_t argc = 3; napi_value argv[3]; char name[64], nonce[33];
  if (napi_get_cb_info(env, info, &argc, argv, NULL, NULL) != napi_ok || argc != 2 ||
      !identity_args(env, argv[0], argv[1], name, nonce)) return fail(env, "SLOT_IDENTITY_ARGUMENTS");
  slot_handle* h = new_handle(env, GetCurrentProcessId(), nonce, 1);
  if (!h) return NULL;
  h->mapping = CreateFileMappingA(INVALID_HANDLE_VALUE, NULL, PAGE_READWRITE, 0, SLOT_VIEW_BYTES, name);
  DWORD error = GetLastError();
  if (!h->mapping || error == ERROR_ALREADY_EXISTS) {
    if (h->mapping) CloseHandle(h->mapping);
    free(h);
    return os_fail(env, error == ERROR_ALREADY_EXISTS ? "SLOT_NAME_EXISTS" : "SLOT_CREATE_FAILED", error);
  }
  h->view = MapViewOfFile(h->mapping, FILE_MAP_READ | FILE_MAP_WRITE, 0, 0, SLOT_VIEW_BYTES);
  if (!h->view) { error = GetLastError(); release_view(h); free(h); return os_fail(env, "SLOT_VIEW_FAILED", error); }
  slot_state* p = h->view;
  p->magic = SLOT_MAGIC; p->version = SLOT_VERSION; p->bytes = SLOT_VIEW_BYTES;
  p->owner_pid = h->owner_pid; memcpy(p->nonce, nonce, 32);
  InterlockedExchange(&p->progress, 0);
  InterlockedExchange(&p->ready, 1);
  return publish_handle(env, h);
}
static napi_value attach_slot(napi_env env, napi_callback_info info) {
  size_t argc = 6; napi_value argv[6]; char name[64], nonce[33]; uint32_t owner, version, bytes;
  if (napi_get_cb_info(env, info, &argc, argv, NULL, NULL) != napi_ok || argc != 5 ||
      !identity_args(env, argv[0], argv[1], name, nonce) || !exact_u32(env, argv[2], &owner) ||
      !exact_u32(env, argv[3], &version) || !exact_u32(env, argv[4], &bytes)) return fail(env, "SLOT_ATTACH_ARGUMENTS");
  if (version != SLOT_VERSION || bytes != SLOT_VIEW_BYTES) return fail(env, "SLOT_PROTOCOL_ARGUMENTS");
  slot_handle* h = new_handle(env, owner, nonce, 0);
  if (!h) return NULL;
  h->mapping = OpenFileMappingA(FILE_MAP_READ | FILE_MAP_WRITE, FALSE, name);
  DWORD error = GetLastError();
  if (!h->mapping) { free(h); return os_fail(env, "SLOT_OPEN_FAILED", error); }
  h->view = MapViewOfFile(h->mapping, FILE_MAP_READ | FILE_MAP_WRITE, 0, 0, SLOT_VIEW_BYTES);
  if (!h->view) { error = GetLastError(); release_view(h); free(h); return os_fail(env, "SLOT_VIEW_FAILED", error); }
  if (!valid_header(h)) { release_view(h); free(h); return fail(env, "SLOT_HEADER_MISMATCH"); }
  return publish_handle(env, h);
}
static napi_value advance_slot(napi_env env, napi_callback_info info) {
  size_t argc = 3; napi_value argv[3];
  if (napi_get_cb_info(env, info, &argc, argv, NULL, NULL) != napi_ok || argc < 1) return fail(env, "SLOT_INVALID_HANDLE");
  slot_handle* h = get_handle(env, argv[0], 0);
  if (!h) return NULL;
  if (!valid_header(h)) return fail(env, "SLOT_HEADER_MISMATCH");
  double event = 0;
  if (argc != 2 || napi_get_value_double(env, argv[1], &event) != napi_ok ||
      !(event == 1 || event == 2 || event == 3 || event == 4)) {
    InterlockedExchange(&h->view->progress, SLOT_REFUSED);
    return argv[0];
  }
  LONG next = (LONG)event;
  if (InterlockedCompareExchange(&h->view->progress, next, next - 1) != next - 1)
    InterlockedExchange(&h->view->progress, SLOT_REFUSED);
  /* No count increment, IO, allocation, coercion callback or JS scheduling. */
  return argv[0];
}
static napi_value read_slot(napi_env env, napi_callback_info info) {
  size_t argc = 2; napi_value argv[2], result;
  if (napi_get_cb_info(env, info, &argc, argv, NULL, NULL) != napi_ok || argc != 1) return fail(env, "SLOT_INVALID_HANDLE");
  slot_handle* h = get_handle(env, argv[0], 0);
  if (!h) return NULL;
  if (!h->owner || h->owner_pid != GetCurrentProcessId()) return fail(env, "SLOT_OWNER_REQUIRED");
  if (!valid_header(h)) return fail(env, "SLOT_HEADER_MISMATCH");
  LONG state = InterlockedCompareExchange(&h->view->progress, 0, 0);
  if (state < 0 || state > SLOT_REFUSED) { InterlockedExchange(&h->view->progress, SLOT_REFUSED); state = SLOT_REFUSED; }
  if (napi_create_uint32(env, (uint32_t)state, &result) != napi_ok) return fail(env, "SLOT_READ_FAILED");
  return result;
}
static napi_value close_slot(napi_env env, napi_callback_info info) {
  size_t argc = 2; napi_value argv[2], result;
  if (napi_get_cb_info(env, info, &argc, argv, NULL, NULL) != napi_ok || argc != 1) return fail(env, "SLOT_INVALID_HANDLE");
  slot_handle* h = get_handle(env, argv[0], 1);
  if (!h) return NULL;
  int was_open = !h->closed;
  h->closed = 1;
  DWORD error = release_view(h);
  napi_status status = drop_root(h);
  if (error) return os_fail(env, "SLOT_CLEANUP_FAILED", error);
  if (status != napi_ok) return fail(env, "SLOT_ROOT_CLEANUP_FAILED");
  if (napi_get_boolean(env, was_open != 0, &result) != napi_ok) return fail(env, "SLOT_CLOSE_RESULT_FAILED");
  return result;
}
NAPI_MODULE_INIT() {
  const napi_property_descriptor properties[] = {
    {"create", NULL, create_slot, NULL, NULL, NULL, napi_default, NULL},
    {"attach", NULL, attach_slot, NULL, NULL, NULL, napi_default, NULL},
    {"advance", NULL, advance_slot, NULL, NULL, NULL, napi_default, NULL},
    {"read", NULL, read_slot, NULL, NULL, NULL, napi_default, NULL},
    {"close", NULL, close_slot, NULL, NULL, NULL, napi_default, NULL}
  };
  if (napi_define_properties(env, exports, sizeof(properties)/sizeof(properties[0]), properties) != napi_ok)
    return fail(env, "SLOT_EXPORT_FAILED");
  return exports;
}
