set -u
P=/home/claude/farm/scratch/cui0-audit2/rebuild/m1/approved-2026-09-18
D=/home/claude/farm/scratch/cui0-audit2
cd "$P"
B=$(sha256sum quality/common.py | cut -d' ' -f1)
echo "sha256 before: $B"
cp quality/common.py /tmp/common.orig.py
python3 - <<'PY'
p='quality/common.py'
s=open(p,encoding='utf-8').read()
old="LAUNCH_ARGS = ['--allow-file-access-from-files', '--font-render-hinting=none']"
new="LAUNCH_ARGS = ['--allow-file-access-from-files']"
assert s.count(old)==1, s.count(old)
open(p,'w',encoding='utf-8',newline='').write(s.replace(old,new))
PY
diff -u /tmp/common.orig.py quality/common.py | tail -8
echo "=== p1 on linux: statesheet --only T-02 ==="
python3 quality/statesheet.py --only T-02; echo "EXIT=$?"
echo "=== p3 on linux: gate --screens today --sizes 393x852 ==="
python3 quality/gate.py --screens today --sizes 393x852; echo "EXIT=$?"
cp /tmp/common.orig.py quality/common.py
A=$(sha256sum quality/common.py | cut -d' ' -f1)
echo "sha256 after revert: $A"
[ "$A" = "$B" ] && echo "REVERTED CLEAN" || echo "REVERT FAILED"
