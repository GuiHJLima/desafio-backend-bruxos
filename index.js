const express = require('express');
const { Pool } = require('pg');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 4000;

app.get(express.json());

//configuração do banco de dados
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'usuariosdolima',
    password: 'ds564',
    port: 7007,
});

//funcões
function calcularIdade(dataNascimento) {
    const dataAtual = new Date();
    let idade = dataAtual.getFullYear() - dataNascimento.getFullYear();
    return idade;
}

function validarCasa(casa) {
    const casas = ['Gryffindor', 'Hufflepuff', 'Ravenclaw', 'Slytherin'];
    if (!casas.includes(casa)) {
        return false;
    }
    return true;
}

function validarSangue(sangue) {
    const sangues = ['Muggle', 'Half-blood', 'Pure-blood'];
    if (!sangues.includes(sangue)) {
        return false;
    }
    return true;
}
//criar uma rota que obtem todos os wizards
app.get('/wizard', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM wizard');
        res.json({
            total: resultado.rowCount,
            wizard: resultado.rows
        });
    } catch (error) {
        console.error("Erro ao tentar obter todos os wizard");
        res.status(500).send({ mensagem: "Erro ao tentar obter todos os wizard" });
    }
});

//criar uma rota que obtem todos os wands
app.get('/wands', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM wands');
        res.json({
            total: resultado.rowCount,
            wands: resultado.rows
        });
    } catch (error) {
        console.error("Erro ao tentar obter todos os wands");
        res.status(500).send({ mensagem: "Erro ao tentar obter todos os wands" });
    }
});

//criar uma rota que obtem um wizard pelo id
app.get('/wizard/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await pool.query('SELECT * FROM wizard WHERE id = $1', [id]);
        res.json({ wizard: resultado.rows[0] });
    } catch (error) {
        console.error("Erro ao tentar obter um wizard");
        res.status(500).send({ mensagem: "Erro ao tentar obter um wizard" });
    }
});

//criar uma rota que obtem um wand pelo id
app.get('/wands/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await pool.query('SELECT * FROM wands WHERE id = $1', [id]);
        res.json({ wands: resultado.rows[0] });
    } catch (error) {
        console.error("Erro ao tentar obter um wand");
        res.status(500).send({ mensagem: "Erro ao tentar obter um wand" });
    }
});

//criar uma rota que adcione um novo wizard
app.post('/wizard', async (req, res) => {
    try {
        const { name, surname, date_of_birth, gender, house, special_ability, blood_status, patronus, alive } = req.body;

        const idade = calcularIdade(new Date(date_of_birth));
        if (!validarCasa(house)) {
            res.status(400).send({ mensagem: "Casa invalida, por favor insira uma dessas casas: Gryffindor, Hufflepuff, Ravenclaw, Slytherin" });
            return;
        }
        if (!validarSangue(blood_status)) {
            res.status(400).send({ mensagem: "Sangue invalido, por favor insira um desses sangues: Muggle, Half-blood, Pure-blood" });
            return;
        }

        await pool.query('INSERT INTO wizard (name, surname, date_of_birth, age, gender, house, special_ability, blood_status, patronus, alive) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', [name, surname, date_of_birth, idade, gender, house, special_ability, blood_status, patronus, alive]);
        res.send({ mensagem: "Wizard adicionado com sucesso" });
    } catch (error) {
        console.error("Erro ao tentar adicionar um wizard", error);
        res.status(500).send({ mensagem: "Erro ao tentar adicionar um wizard" });
    }
});

//criar uma rota que adcione um novo wand
app.post('/wands', async (req, res) => {
    try {
        const { wood, core, length, flexibility } = req.body;
        await pool.query('INSERT INTO wands (wood, core, length, flexibility) VALUES ($1, $2, $3, $4)', [wood, core, length, flexibility]);
        res.send({ mensagem: "Wand adicionado com sucesso" });
    } catch (error) {
        console.error("Erro ao tentar adicionar um wand", error);
        res.status(500).send({ mensagem: "Erro ao tentar adicionar um wand" });
    }
});

//criar uma rota que delete um usuario]
app.delete('/usuario/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM usuario WHERE id = $1', [id]);
        res.send({ mensagem: "Usuario deletado com sucesso" });
    } catch (error) {
        console.error("Erro ao tentar deletar um usuario");
        res.status(500).send({ mensagem: "Erro ao tentar deletar um usuario" });
    }
});

//criar uma rota que atualize um usuario
app.put('/usuario/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, email } = req.body;
        await pool.query('UPDATE usuario SET nome = $1, email = $2 WHERE id = $3', [nome, email, id]);
        res.send({ mensagem: "Usuario atualizado com sucesso" });
    } catch (error) {
        console.error("Erro ao tentar atualizar um usuario");
        res.status(500).send({ mensagem: "Erro ao tentar atualizar um usuario" });
    }
});



//inicializar o servidor
app.listen(port, () => {
    console.log(`Servidor esta rodando em http://localhost:${port}`);
});