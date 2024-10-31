import express from 'express';
import connectionBd from './connection.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static('public'));

app.get('/login', async (req, res) => {
    const {cpf} = req.body;

    try {
        const connection = await connectionBd();
        const result = await connection.execute(
            `SELECT * FROM Aluno WHERE cpf = :cpf`, [cpf]
        )
        
        if(result.rows.length > 0){
            res.send("Login realizado com sucesso")
        } else {
            res.status(404).send("Erro ao realizar o Login")
        }
    } catch(erro) {
        console.error("Erro ao realizar o login: ", erro)
        res.status(500).send("Erro ao realizar o login")
    }
})

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`)
})
