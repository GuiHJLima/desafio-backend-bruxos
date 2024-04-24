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
//rota que obtem todos os wizards
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

//rota que obtem todos os wands
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

//rota que obtem um wizard pelo id
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

//rota que obtem um wand pelo id
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

//rota que adcione um novo wizard
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

//rota que adcione um novo wand
app.post('/wands', async (req, res) => {
    try {
        const { material, core, length, date_of_creation } = req.body;
        await pool.query('INSERT INTO wands (material, core, length, date_of_creation) VALUES ($1, $2, $3, $4)', [material, core, length, date_of_creation]);
        res.send({ mensagem: "Wand adicionado com sucesso" });
    } catch (error) {
        console.error("Erro ao tentar adicionar um wand", error);
        res.status(500).send({ mensagem: "Erro ao tentar adicionar um wand" });
    }
});

//rota que delete um wizard
app.delete('/wizard/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM wizard WHERE id = $1', [id]);
        res.send({ mensagem: "Wizard deletado com sucesso" });
    } catch (error) {
        console.error("Erro ao tentar deletar um wizard");
        res.status(500).send({ mensagem: "Erro ao tentar deletar um wizard" });
    }
});

//rota que delete um wand
app.delete('/wands/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM wands WHERE id = $1', [id]);
        res.send({ mensagem: "Wand deletado com sucesso" });
    } catch (error) {
        console.error("Erro ao tentar deletar um wand");
        res.status(500).send({ mensagem: "Erro ao tentar deletar um wand" });
    }
});

//rota que atualize um wizard
app.put('/wizard/:id', async (req, res) => {
    try {
        const { id } = req.params;
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
        await pool.query('UPDATE wizard SET name = $1, surname = $2, date_of_birth = $3, age = $4, gender = $5, house = $6, special_ability = $7, blood_status = $8, patronus = $9, alive = $10 WHERE id = $11', [name, surname, date_of_birth, idade, gender, house, special_ability, blood_status, patronus, alive, id]);
        res.send({ mensagem: "Wizard atualizado com sucesso" });
    } catch (error) {
        console.error("Erro ao tentar atualizar um wizard");
        res.status(500).send({ mensagem: "Erro ao tentar atualizar um wizard" });
    }
} );

//rota que atualize um wand
app.put('/wands/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { material, core, length, date_of_creation } = req.body;
        await pool.query('UPDATE wands SET material = $1, core = $2, length = $3, date_of_creation = $4 WHERE id = $5', [material, core, length, date_of_creation, id]);
        res.send({ mensagem: "Wand atualizado com sucesso" });
    } catch (error) {
        console.error("Erro ao tentar atualizar um wand");
        res.status(500).send({ mensagem: "Erro ao tentar atualizar um wand" });
    }
});



//inicializar o servidor
app.listen(port, () => {
    console.log(`Servidor esta rodando em http://localhost:${port}`);
});