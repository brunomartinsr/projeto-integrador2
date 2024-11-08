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

export async function getHorasSemanais(cpf, conn) {
  try {
    const result = await conn.execute(
      `
        SELECT HORA_TOTAL, DATA_ACESSO 
        FROM CONTROLE_CATRACA 
        WHERE CPF_ALUNO = :cpf AND DATA_ACESSO >= SYSDATE - 7 AND DATA_ACESSO <= SYSDATE 
        ORDER BY DATA_ACESSO DESC
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
      [classificacao, cpf]
    );
  } catch (err) {
    throw new Error("Erro ao atualizar classificação: " + err);
  }
}
