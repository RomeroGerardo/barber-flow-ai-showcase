-- 1. Eliminar políticas existentes (por si acaso)
DROP POLICY IF EXISTS "Allow public inserts" ON appointments;
DROP POLICY IF EXISTS "Allow authenticated view" ON appointments;
DROP POLICY IF EXISTS "Allow authenticated update" ON appointments;
DROP POLICY IF EXISTS "Public access" ON appointments;
DROP POLICY IF EXISTS "Enable read access for all users" ON appointments;
DROP POLICY IF EXISTS "Enable insert for all users" ON appointments;
DROP POLICY IF EXISTS "Enable update for users based on email" ON appointments;

-- 2. Asegurarse de que RLS esté habilitado
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- 3. Crear una ÚNICA política que permita TODO a TODOS (Público y Autenticado)
-- CUIDADO: Esto permite que cualquiera vea, edite y borre todas las citas si tiene la URL y Key correcta.
CREATE POLICY "Public Access All"
ON appointments
FOR ALL
TO public
USING (true)
WITH CHECK (true);
