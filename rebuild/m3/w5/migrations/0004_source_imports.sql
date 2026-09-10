-- LOCAL CANDIDATE. Apply only with explicit source-import/v1 capability.
CREATE TRIGGER IF NOT EXISTS source_imports_immutable_update
BEFORE UPDATE ON authority_rows
WHEN OLD.collection = 'sourceImports' OR NEW.collection = 'sourceImports'
BEGIN
  SELECT RAISE(ABORT, 'source_imports_immutable');
END;
CREATE TRIGGER IF NOT EXISTS source_imports_immutable_delete
BEFORE DELETE ON authority_rows
WHEN OLD.collection = 'sourceImports'
BEGIN
  SELECT RAISE(ABORT, 'source_imports_immutable');
END;
