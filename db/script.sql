-- Criação do banco de dados
CREATE DATABASE usuariosdolima;

-- Conecta no banco de dados
\c usuariosdolima;

-- Criação da tabela 'wizard'
CREATE TABLE wizard (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    surname VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    age INT NOT NULL,
    house VARCHAR(100) NOT NULL,
    special_ability VARCHAR(100) NOT NULL,
    blood_status VARCHAR(100) NOT NULL,
    patronus VARCHAR(100),
    alive BOOLEAN NOT NULL DEFAULT TRUE

);

-- Criando a tabela 'wands'
CREATE TABLE wands (
    id SERIAL PRIMARY KEY,
    mateial VARCHAR(100) NOT NULL,
    length INT NOT NULL,
    core VARCHAR(100) NOT NULL,
    date_of_creation DATE NOT NULL,
);

-- inserção de dados na tabela 'wizard'
INSERT INTO wizard (name, surname, date_of_birth, age, house, special_ability, blood_status, patronus) VALUES ('Harry', 'Potter', '1980-07-31', 40, 'Gryffindor', 'Parseltongue', 'Half-blood', 'Stag', TRUE);

-- inserção de dados na tabela 'wands'
INSERT INTO wands (material, length, core, date_of_creation) VALUES ('Holly', 11, 'Phoenix feather', '1991-07-31');