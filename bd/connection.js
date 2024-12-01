import oracledb from "oracledb";
import dotenv from "dotenv";

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
dotenv.config({ path: "./bd/.env" });

if (!process.env.USER || !process.env.PASSWORD || !process.env.CONNECTSTRING) {
  console.error("Faltam variáveis de ambiente.");
  process.exit(1);
}

async function createPool() {
  try {
    await oracledb.createPool({
      user: process.env.USER,
      password: process.env.PASSWORD,
      connectString: process.env.CONNECTSTRING,
      poolMin: 10,
      poolMax: 100,
      poolIncrement: 10,
    });
  } catch (err) {
    console.error("Erro ao criar o pool de conexões: ", err);
  }
}
async function getConnection() {
  try {
    return await oracledb.getConnection();
  } catch (err) {
    console.error("Erro ao obter conexão: ", err);
  }
}
export { createPool, getConnection };
