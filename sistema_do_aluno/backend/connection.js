import oracledb from "oracledb";
import dotenv from "dotenv";

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
dotenv.config();

if (!process.env.USER || !process.env.PASSWORD || !process.env.CONNECTSTRING) {
  console.error("Faltam variáveis de ambiente.");
  process.exit(1);
}

async function connectionBd() {
  let connect;
  try {
    connect = await oracledb.getConnection({
      user: process.env.USER,
      password: process.env.PASSWORD,
      connectString: process.env.CONNECTSTRING,
    });
    console.log("Conectado ao banco de dados");
    return connect; // Retorna a conexão para ser usada
  } catch (err) {
    console.error("Erro ao conectar:", err);
  }
}

export default connectionBd;
