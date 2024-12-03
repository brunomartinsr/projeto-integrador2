export async function getAlunoById(id, conn) {
  try {
    const result = await conn.execute(`SELECT * FROM ALUNOS WHERE ID = :id AND ID <= 20`, [
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

export async function getHorasTotais(cpf, conn) {
  try {
    const result = await conn.execute(
      `
      SELECT 
      TRUNC(SUM(EXTRACT(HOUR FROM HORA_TOTAL) * 3600 +
                 EXTRACT(MINUTE FROM HORA_TOTAL) * 60 +
                 EXTRACT(SECOND FROM HORA_TOTAL)) / 3600) AS TOTAL_HORAS
      FROM REGISTROS_CATRACA
      WHERE CPF_ALUNO = :cpf
      GROUP BY CPF_ALUNO`,
      [cpf]
    );
    return result.rows.length > 0 ? result.rows[0].TOTAL_HORAS : null;
  } catch (err) {
    throw new Error("Erro ao consultar horas: " + err.message);
  }
}

export async function getHorasSemanais(cpf, conn) {
  try {
    const result = await conn.execute(
      `
      SELECT TRUNC(SUM(EXTRACT(HOUR FROM HORA_TOTAL) * 3600 +
                 EXTRACT(MINUTE FROM HORA_TOTAL) * 60 +
                 EXTRACT(SECOND FROM HORA_TOTAL)) / 3600) AS TOTAL_HORAS 
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
    return result.rows[0].TOTAL_HORAS;
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
