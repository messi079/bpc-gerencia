-- Migration script to rename clients table and references to usuarios
-- This maintains data integrity while updating terminology for municipal public service context

-- Rename the clients table to usuarios
ALTER TABLE clients RENAME TO usuarios;

-- Update column references in atendimentos table
ALTER TABLE atendimentos RENAME COLUMN client_id TO usuario_id;

-- Update foreign key constraint name for clarity
ALTER TABLE atendimentos DROP CONSTRAINT atendimentos_client_id_fkey;
ALTER TABLE atendimentos ADD CONSTRAINT atendimentos_usuario_id_fkey 
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE;

-- Update indexes to reflect new naming
DROP INDEX IF EXISTS idx_clients_cpf;
DROP INDEX IF EXISTS idx_atendimentos_client_id;

CREATE INDEX IF NOT EXISTS idx_usuarios_cpf ON usuarios(cpf);
CREATE INDEX IF NOT EXISTS idx_atendimentos_usuario_id ON atendimentos(usuario_id);

-- Add comment to table for clarity
COMMENT ON TABLE usuarios IS 'Usuários dos serviços sociais municipais (anteriormente clients)';
