-- Social Services Management System Database Schema
-- Based on the Portuguese social service attendance form

-- Users table
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome_completo VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    data_nascimento DATE NOT NULL,
    idade INTEGER,
    sexo VARCHAR(10) CHECK (sexo IN ('M', 'F', 'Outro')),
    endereco_completo TEXT,
    telefones VARCHAR(255),
    responsavel_legal_nome VARCHAR(255),
    responsavel_legal_cpf VARCHAR(14),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Attendance records table
CREATE TABLE IF NOT EXISTS atendimentos (
    id SERIAL PRIMARY KEY,
    -- Updated foreign key reference from client_id to user_id
    user_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    data_atendimento DATE NOT NULL,
    tipo_atendimento VARCHAR(50) CHECK (tipo_atendimento IN ('Inicial', 'Retorno', 'Encaminhamento', 'Acompanhamento')),
    forma_atendimento VARCHAR(50) CHECK (forma_atendimento IN ('Presencial', 'Telefônico', 'Domiciliar', 'Outros')),
    forma_atendimento_outros VARCHAR(255),
    tecnico_responsavel VARCHAR(255) NOT NULL,
    demanda_apresentada TEXT,
    servico_beneficio VARCHAR(100),
    servico_beneficio_outros VARCHAR(255),
    encaminhamentos_realizados TEXT,
    observacoes_tecnico TEXT,
    parecer_social TEXT,
    resultado VARCHAR(20) CHECK (resultado IN ('DEFERIDO', 'INDEFERIDO', 'PENDENTE')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services/Benefits tracking table
CREATE TABLE IF NOT EXISTS servicos_beneficios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default services/benefits
INSERT INTO servicos_beneficios (nome, descricao) VALUES
('BPC – Benefício de Prestação Continuada', 'Benefício assistencial para idosos e pessoas com deficiência'),
('Cadastro Único / Atualização', 'Cadastramento e atualização no CadÚnico'),
('Auxílio Municipal – AME', 'Auxílio Municipal Emergencial'),
('CPTEA', 'Carteira de Identificação da Pessoa com Transtorno do Espectro Autista'),
('Encaminhamento para CRAS / CREAS', 'Encaminhamento para Centro de Referência de Assistência Social'),
('Encaminhamento para saúde / INSS / Justiça', 'Encaminhamentos para outros órgãos públicos');

-- Technicians/Staff table
CREATE TABLE IF NOT EXISTS tecnicos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cargo VARCHAR(100),
    email VARCHAR(255) UNIQUE,
    telefone VARCHAR(50),
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_usuarios_cpf ON usuarios(cpf);
CREATE INDEX IF NOT EXISTS idx_atendimentos_user_id ON atendimentos(user_id);
CREATE INDEX IF NOT EXISTS idx_atendimentos_data ON atendimentos(data_atendimento);
CREATE INDEX IF NOT EXISTS idx_atendimentos_tipo ON atendimentos(tipo_atendimento);
CREATE INDEX IF NOT EXISTS idx_atendimentos_resultado ON atendimentos(resultado);
