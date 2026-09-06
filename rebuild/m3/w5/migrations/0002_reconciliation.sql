-- R1 uses the existing atomic authority_rows/global-revision transaction.
-- These guards do not touch legacy collections or retrofit incomplete history.
CREATE TRIGGER IF NOT EXISTS r1_immutable_update
BEFORE UPDATE ON authority_rows
WHEN OLD.collection IN ('issuedLeases','issuanceIntents','enrollmentIntents','standingEvents')
  OR NEW.collection IN ('issuedLeases','issuanceIntents','enrollmentIntents','standingEvents')
BEGIN
  SELECT RAISE(ABORT, 'r1_immutable_row');
END;
CREATE TRIGGER IF NOT EXISTS r1_immutable_delete
BEFORE DELETE ON authority_rows
WHEN OLD.collection IN ('issuedLeases','issuanceIntents','enrollmentIntents','standingEvents')
BEGIN
  SELECT RAISE(ABORT, 'r1_immutable_row');
END;

CREATE TRIGGER IF NOT EXISTS r1_validate_insert
BEFORE INSERT ON authority_rows
WHEN NEW.collection IN ('accountRegistry','deviceIssuance','issuedLeases','issuanceIntents','enrollmentIntents','standingEvents')
BEGIN
  SELECT CASE WHEN json_type(NEW.value) != 'object' THEN RAISE(ABORT, 'r1_invalid_row') END;
  SELECT CASE WHEN NEW.collection = 'accountRegistry' AND NOT (
    NEW.row_id = 'state' AND (SELECT count(*) FROM json_each(NEW.value)) = 4
    AND json_extract(NEW.value,'$.profile') = 'earned/r1/v1'
    AND json_type(NEW.value,'$.account_epoch') = 'integer'
    AND json_extract(NEW.value,'$.account_epoch') BETWEEN 1 AND 9007199254740991
    AND json_extract(NEW.value,'$.state') IN ('ACTIVE','CLOSED')
    AND json_extract(NEW.value,'$.history_origin') IN ('PROFILE_GENESIS','VERIFIED_IMPORT','OBSERVED_CURRENT')
  ) IS TRUE THEN RAISE(ABORT, 'r1_invalid_registry') END;
  SELECT CASE WHEN NEW.collection = 'deviceIssuance' AND NOT (
    (SELECT count(*) FROM json_each(NEW.value)) = 4
    AND json_type(NEW.value,'$.device_id') = 'text' AND json_extract(NEW.value,'$.device_id') = NEW.row_id
    AND json_type(NEW.value,'$.current_lease_id') = 'text' AND length(json_extract(NEW.value,'$.current_lease_id')) > 0
    AND json_type(NEW.value,'$.creation_epoch') = 'integer' AND json_extract(NEW.value,'$.creation_epoch') BETWEEN 1 AND 9007199254740991
    AND json_type(NEW.value,'$.issue_ordinal') = 'integer' AND json_extract(NEW.value,'$.issue_ordinal') BETWEEN 1 AND 9007199254740991
    AND json_extract(NEW.value,'$.creation_epoch') = json_extract(NEW.value,'$.issue_ordinal')
  ) IS TRUE THEN RAISE(ABORT, 'r1_invalid_device') END;
  SELECT CASE WHEN NEW.collection IN ('issuedLeases','issuanceIntents') AND (
    NOT json_valid(NEW.row_id) OR json_type(NEW.row_id) != 'array' OR json_array_length(NEW.row_id) != 2
  ) THEN RAISE(ABORT, 'r1_invalid_row_identity') END;
  SELECT CASE WHEN NEW.collection = 'issuedLeases' AND NOT (
    (SELECT count(*) FROM json_each(NEW.value)) = 7
    AND json_type(NEW.value,'$.lease') = 'object'
    AND json_extract(NEW.value,'$.lease.athlete_id') = NEW.athlete
    AND json_extract(NEW.value,'$.lease.device_id') = json_extract(NEW.row_id,'$[0]')
    AND json_extract(NEW.value,'$.lease.lease_id') = json_extract(NEW.row_id,'$[1]')
    AND json_type(NEW.value,'$.lease_bytes_b64') = 'text' AND length(json_extract(NEW.value,'$.lease_bytes_b64')) > 0
    AND json_extract(NEW.value,'$.issuer_profile') = 'earned/r1/v1'
    AND json_type(NEW.value,'$.issuance_intent_digest') = 'text'
    AND json_type(NEW.value,'$.issue_ordinal') = 'integer' AND json_extract(NEW.value,'$.issue_ordinal') BETWEEN 1 AND 9007199254740991
    AND json_type(NEW.value,'$.account_epoch') = 'integer' AND json_extract(NEW.value,'$.account_epoch') BETWEEN 1 AND 9007199254740991
    AND json_type(NEW.value,'$.creation_epoch') = 'integer' AND json_extract(NEW.value,'$.creation_epoch') BETWEEN 1 AND 9007199254740991
    AND json_extract(NEW.value,'$.creation_epoch') = json_extract(NEW.value,'$.issue_ordinal')
  ) IS TRUE THEN RAISE(ABORT, 'r1_invalid_issued_lease') END;
  SELECT CASE WHEN NEW.collection = 'issuanceIntents' AND NOT (
    (SELECT count(*) FROM json_each(NEW.value)) = 3
    AND json_type(NEW.value,'$.stable_request_digest') = 'text'
    AND json_type(NEW.value,'$.lease_id') = 'text'
    AND json_type(NEW.value,'$.result_creation_epoch') = 'integer'
    AND json_extract(NEW.value,'$.result_creation_epoch') BETWEEN 1 AND 9007199254740991
  ) IS TRUE THEN RAISE(ABORT, 'r1_invalid_issuance_intent') END;
  SELECT CASE WHEN NEW.collection = 'enrollmentIntents' AND NOT (
    (SELECT count(*) FROM json_each(NEW.value)) = 3
    AND json_type(NEW.value,'$.stable_request_digest') = 'text'
    AND json_type(NEW.value,'$.device_id') = 'text'
    AND json_type(NEW.value,'$.lease_id') = 'text'
  ) IS TRUE THEN RAISE(ABORT, 'r1_invalid_enrollment_intent') END;
  SELECT CASE WHEN NEW.collection = 'standingEvents' AND NOT (
    (SELECT count(*) FROM json_each(NEW.value)) = 6
    AND json_extract(NEW.value,'$.kind') IN ('PROFILE_GENESIS','DEVICE_ENROLLED','LEASE_RENEWED','DEVICE_REVOKED','ACCOUNT_CLOSED')
    AND json_extract(NEW.value,'$.athlete_id') = NEW.athlete
    AND json_type(NEW.value,'$.account_epoch') = 'integer' AND json_extract(NEW.value,'$.account_epoch') BETWEEN 1 AND 9007199254740991
    AND (json_type(NEW.value,'$.device_id') = 'null' OR json_type(NEW.value,'$.device_id') = 'text')
    AND (json_type(NEW.value,'$.creation_epoch') = 'null' OR (json_type(NEW.value,'$.creation_epoch') = 'integer' AND json_extract(NEW.value,'$.creation_epoch') BETWEEN 1 AND 9007199254740991))
    AND json_type(NEW.value,'$.evidence') = 'object'
  ) IS TRUE THEN RAISE(ABORT, 'r1_invalid_standing') END;
END;

-- Mutable pointers/lifecycle retain shape and identity checks on UPDATE.
CREATE TRIGGER IF NOT EXISTS r1_validate_registry_update
BEFORE UPDATE ON authority_rows WHEN OLD.collection = 'accountRegistry' OR NEW.collection = 'accountRegistry'
BEGIN
  SELECT CASE WHEN NEW.collection != OLD.collection OR NEW.athlete != OLD.athlete OR NEW.row_id != OLD.row_id
    OR json_type(NEW.value) != 'object' OR (SELECT count(*) FROM json_each(NEW.value)) != 4
    OR json_extract(NEW.value,'$.profile') IS NOT 'earned/r1/v1'
    OR json_type(NEW.value,'$.account_epoch') IS NOT 'integer'
    OR NOT (json_extract(NEW.value,'$.account_epoch') BETWEEN 1 AND 9007199254740991)
    OR json_type(NEW.value,'$.state') IS NOT 'text'
    OR json_extract(NEW.value,'$.state') NOT IN ('ACTIVE','CLOSED')
    OR json_extract(NEW.value,'$.history_origin') IS NOT json_extract(OLD.value,'$.history_origin')
    OR (json_extract(OLD.value,'$.state') = 'CLOSED' AND json_extract(NEW.value,'$.state') != 'CLOSED')
    THEN RAISE(ABORT, 'r1_invalid_registry') END;
END;
CREATE TRIGGER IF NOT EXISTS r1_validate_device_update
BEFORE UPDATE ON authority_rows WHEN OLD.collection = 'deviceIssuance' OR NEW.collection = 'deviceIssuance'
BEGIN
  SELECT CASE WHEN NEW.collection != OLD.collection OR NEW.athlete != OLD.athlete OR NEW.row_id != OLD.row_id
    OR json_type(NEW.value) != 'object' OR (SELECT count(*) FROM json_each(NEW.value)) != 4
    OR json_extract(NEW.value,'$.device_id') IS NOT NEW.row_id
    OR json_type(NEW.value,'$.current_lease_id') IS NOT 'text' OR length(json_extract(NEW.value,'$.current_lease_id')) < 1
    OR json_type(NEW.value,'$.creation_epoch') IS NOT 'integer'
    OR NOT (json_extract(NEW.value,'$.creation_epoch') BETWEEN 1 AND 9007199254740991)
    OR json_type(NEW.value,'$.issue_ordinal') IS NOT 'integer'
    OR json_extract(NEW.value,'$.creation_epoch') IS NOT json_extract(NEW.value,'$.issue_ordinal')
    THEN RAISE(ABORT, 'r1_invalid_device') END;
END;
CREATE UNIQUE INDEX IF NOT EXISTS r1_issued_ordinal ON authority_rows
  (athlete,json_extract(row_id,'$[0]'),json_extract(value,'$.issue_ordinal')) WHERE collection = 'issuedLeases';
