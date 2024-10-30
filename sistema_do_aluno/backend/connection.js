import oracledb from "oracledb";
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
require("dotenv").config();

async function connectionbd() {
  let connect;
  if (
    !process.env.USER ||
    !process.env.PASSWORD ||
    !process.env.CONNECTSTRING
  ) {
    console.error("Faltam variáveis de ambiente.");
    process.exit(1);
  }

  try {
    connect = await oracledb.getConnection({
      user: process.env.USER,
      password: process.env.PASSWORD,
      connectString: process.env.CONNECTSTRING,
    });

    console.log("Conectado ao banco de dados");

    return connect;
  } catch (err) {
    console.error(err);
  }
}

module.exports = connectionbd;
