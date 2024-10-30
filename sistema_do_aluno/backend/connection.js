import oracledb from 'oracledb';
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT; // Correção aqui

async function connectionbd() {
    let connect;

    try {
        connect = await oracledb.getConnection({
            user: "nome",
            password: "senha",
            connectString: "string"
        });
        
        console.log("Conectado ao banco de dados")

        const data = await connect.execute(
            `SELECT * FROM alunos`
        );
        console.log(data.rows);

    } catch (err) {
        console.error(err);
    } finally {
        if (connect) {
            try {
                await connect.close(); // Fecha a conexão no final
                console.log("Conexão encerrada.");
            } catch (err) {
                console.error("Erro ao fechar a conexão:", err);
            }
        }
    }
}

connectionbd();