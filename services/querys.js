export async function getAlunoById(id, conn) {
  try {
    const result = await conn.execute(`SELECT * FROM ALUNOS WHERE ID = :id`, [
      id,
    ]);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (err) {
    throw new Error("Erro ao consultar ID: " + err);
  }
}

export async function getAlunoByCpf(cpf, conn) {
  try {
    const result = await conn.execute(`SELECT * FROM ALUNOS WHERE CPF = :cpf`, [
      cpf,
    ]);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (err) {
    throw new Error("Erro ao consultar CPF: " + err);
  }
}

export function calcHoras(horas) {
  if (horas && typeof horas === "string") {
    const timeString = horas.substring(11, 19);  
    const parts = timeString.split(":"); 

    const horasPart = parseInt(parts[0], 10);  
    const minutos = parseInt(parts[1], 10);  
    const segundos = parseInt(parts[2], 10);  

    return horasPart * 3600 + minutos * 60 + segundos;
  }

  return 0;
}

export async function getHorasTotais(cpf, conn) {
  try {
    const result = await conn.execute(
      `SELECT 
        TO_CHAR(
          NUMTODSINTERVAL(
            SUM(
              EXTRACT(HOUR FROM HORA_TOTAL) * 3600 +
              EXTRACT(MINUTE FROM HORA_TOTAL) * 60 +
              EXTRACT(SECOND FROM HORA_TOTAL)
            ), 
            'SECOND'
          ),
          'HH24:MI:SS'
        ) AS HORA_TOTAL
      FROM REGISTROS_CATRACA 
      WHERE CPF_ALUNO = :cpf`,
      [cpf]
    );
    return result.rows.length > 0 ? result.rows : "00:00:00";
  } catch (err) {
    throw new Error("Erro ao consultar horas: " + err.message);
  }
}

export async function getHorasSemanais(cpf, conn) {
  try {
    const result = await conn.execute(
      `
      SELECT TO_CHAR(HORA_TOTAL, 'HH24:MI:SS') AS HORA_TOTAL, DATA_REGISTRO 
      FROM REGISTROS_CATRACA 
      WHERE CPF_ALUNO = :cpf 
      AND DATA_REGISTRO >= TRUNC(SYSDATE) - 7 
      AND DATA_REGISTRO <= TRUNC(SYSDATE) + 1 
      ORDER BY DATA_REGISTRO DESC
      `,
      [cpf]
    );

    if (result.rows.length === 0) {
      console.log(
        "Nenhum registro encontrado para o CPF e intervalo de datas fornecidos."
      );
      return 0;
    }

    const totalHoras = calcHoras(result.rows);
    const horasInteiras = Math.floor(totalHoras);
    const minutos = Math.round((totalHoras - horasInteiras) * 60);
    const horasArredondadas = minutos >= 30 ? horasInteiras + 1 : horasInteiras;
    return horasArredondadas;
  } catch (err) {
    console.error("Erro ao obter horas semanais:", err);
    throw new Error("Erro ao obter horas semanais: " + err);
  }
}

export async function atualizarClassificacao(cpf, classificacao, conn) {
  try {
    await conn.execute(
      `UPDATE ALUNOS SET CLASSIFICACAO = :classificacao WHERE CPF = :cpf`,
      [classificacao, cpf],
      { autoCommit: true }
    );
  } catch (err) {
    throw new Error("Erro ao atualizar classificação: " + err);
  }
}
