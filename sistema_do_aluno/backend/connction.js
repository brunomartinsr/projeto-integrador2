const oracledb = require('oracledb');
oracledb.outFormat = oracle.OUT_FORMAT_OBJECt

async function fun() {
    let con;

    try {
        con = await oracledb.getConnection({
            user: "nome",
            password: "senha",
            connectString: "string"
        });
        
        const data = await con.execute(
            `SELECT * FROM alunos`,
        );
        console.log(data.rows);
    } catch(err){
        console.error(err);
    }  
}
fun();