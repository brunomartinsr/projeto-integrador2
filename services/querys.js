export async function getAlunoById(id, conn) {
  try {
    const result = await conn.execute(`SELECT * FROM ALUNOS WHERE ID = :id`, [
      id,
    ]);
    return result.rows.length > 0 ? result.row[0] : null;
  } catch (err) {
    throw new Error("Erro ao consultar ID: " + err);
  }
}

export async function getAlunoByCpf(cpf, conn) {
  try {
    const result = await conn.execute(`SELECT * FROM ALUNOS WHERE CPF = :cpf`, [
      cpf,
    ]);
    return result.rows.length > 0 ? result.row[0] : null;
  } catch (err) {
    throw new Error("Erro ao consultar CPF: " + err);
  }
}

export async function getHorasByDate(cpf, conn, date) {
  try {
    const result = await conn.execute(
      `SELECT HORA_ENTRADA, HORA_SAIDA FROM REGISTROS_CATRACA WHERE CPF_ALUNO = :cpf AND DATA_REGISTRO = TO_DATE(:date, 'YYYY-MM-DD')`,
      [cpf, date]
    );
    return result.rows.length > 0 ? result.rows : null;
  } catch (err) {
    throw new Error("Erro ao consultar horas: " + err);
  }
}

export async function getHorasSemanais(cpf, conn) {
  try {
    const result = await conn.execute(
      `
        SELECT HORA_TOTAL, DATA_REGISTRO 
        FROM REGISTROS_CATRACA 
        WHERE CPF_ALUNO = :cpf AND DATA_REGISTRO >= SYSDATE - 7 AND DATA_REGISTRO <= SYSDATE 
        ORDER BY DATA_REGISTRO DESC
      `,
      [cpf]
    );

    let totalHoras = result.rows.reduce(
      (acc, registro) => acc + registro.HORA_TOTAL,
      0
    );
    return totalHoras / 7;
  } catch (err) {
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
