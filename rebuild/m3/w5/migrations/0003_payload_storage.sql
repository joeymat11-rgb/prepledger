-- Selected P1 storage profile only. Apply as ONE atomic migration batch to
-- an empty isolated target; never backfill immutable source rows in place.
-- No keys or namespace/epoch defaults live in SQL. Provision the control row
-- separately through the integrator's existing trusted configuration.
CREATE TABLE p1_install_empty_guard (
  rows_present INTEGER NOT NULL CHECK (rows_present = 0)
);
INSERT INTO p1_install_empty_guard SELECT COUNT(*) FROM authority_rows;
DROP TABLE p1_install_empty_guard;

ALTER TABLE authority_rows ADD COLUMN sealed TEXT CHECK (sealed IS NULL OR json_valid(sealed));
ALTER TABLE authority_rows ADD COLUMN storage_revision INTEGER
  CHECK (storage_revision IS NULL OR (typeof(storage_revision) = 'integer'
    AND storage_revision BETWEEN 1 AND 9007199254740991));

CREATE TABLE authority_storage (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  profile TEXT NOT NULL CHECK (profile = 'earned/authority-row/v1'),
  namespace TEXT NOT NULL CHECK (length(namespace) > 0),
  write_epoch TEXT NOT NULL CHECK (length(write_epoch) > 0)
);

CREATE TRIGGER p1_validate_insert BEFORE INSERT ON authority_rows
BEGIN
  SELECT CASE WHEN NEW.sealed IS NULL OR NOT json_valid(NEW.sealed)
    THEN RAISE(ABORT, 'p1_invalid_seal') END;
  SELECT CASE WHEN NOT (
    json_type(NEW.sealed) = 'object' AND (SELECT count(*) FROM json_each(NEW.sealed)) = 5
    AND json_extract(NEW.sealed, '$.profile') = 'earned/authority-row/v1'
    AND json_type(NEW.sealed, '$.key_epoch') = 'text' AND length(json_extract(NEW.sealed, '$.key_epoch')) > 0
    AND json_type(NEW.sealed, '$.wrapped_key_b64') = 'text' AND length(json_extract(NEW.sealed, '$.wrapped_key_b64')) = 54
    AND json_type(NEW.sealed, '$.iv_b64') = 'text' AND length(json_extract(NEW.sealed, '$.iv_b64')) = 16
    AND json_type(NEW.sealed, '$.ciphertext_b64') = 'text' AND length(json_extract(NEW.sealed, '$.ciphertext_b64')) >= 22
    AND typeof(NEW.storage_revision) = 'integer' AND NEW.storage_revision BETWEEN 1 AND 9007199254740991
  ) IS TRUE THEN RAISE(ABORT, 'p1_invalid_storage_row') END;
END;

-- Original R1 immutable triggers remain the sole UPDATE/DELETE rejection for
-- their four collections. No re-stamping/rewrapping bypass is introduced.
CREATE TRIGGER p1_validate_mutable_update BEFORE UPDATE ON authority_rows
WHEN OLD.collection NOT IN ('issuedLeases','issuanceIntents','enrollmentIntents','standingEvents')
 AND NEW.collection NOT IN ('issuedLeases','issuanceIntents','enrollmentIntents','standingEvents')
BEGIN
  SELECT CASE WHEN NEW.sealed IS NULL OR NOT json_valid(NEW.sealed)
    THEN RAISE(ABORT, 'p1_invalid_seal') END;
  SELECT CASE WHEN NOT (
    NEW.athlete = OLD.athlete AND NEW.collection = OLD.collection AND NEW.row_id = OLD.row_id
    AND json_type(NEW.sealed) = 'object' AND (SELECT count(*) FROM json_each(NEW.sealed)) = 5
    AND json_extract(NEW.sealed, '$.profile') = 'earned/authority-row/v1'
    AND json_type(NEW.sealed, '$.key_epoch') = 'text' AND length(json_extract(NEW.sealed, '$.key_epoch')) > 0
    AND json_type(NEW.sealed, '$.wrapped_key_b64') = 'text' AND length(json_extract(NEW.sealed, '$.wrapped_key_b64')) = 54
    AND json_type(NEW.sealed, '$.iv_b64') = 'text' AND length(json_extract(NEW.sealed, '$.iv_b64')) = 16
    AND json_type(NEW.sealed, '$.ciphertext_b64') = 'text' AND length(json_extract(NEW.sealed, '$.ciphertext_b64')) >= 22
    AND typeof(NEW.storage_revision) = 'integer' AND NEW.storage_revision BETWEEN 1 AND 9007199254740991
    AND NEW.storage_revision > OLD.storage_revision
  ) IS TRUE THEN RAISE(ABORT, 'p1_invalid_storage_row') END;
END;
