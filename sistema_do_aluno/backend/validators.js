const validaCPF = (CPF) => {
  const CPFnumerico = [];
  for (let digito of CPF) {
    CPFnumerico.push(parseInt(digito));
  }

  if (CPFnumerico.length !== 11) {
    return false;
  }

  let soma = 0;
  for (let c = 10; c >= 2; c--) {
    soma += CPFnumerico[10 - c] * c;
  }

  const digito_1 = 11 - (soma % 11);
  if (digito_1 >= 10) digito_1 = 0;

  soma = 0;
  for (let c = 11; c >= 2; c--) {
    soma += CPFnumerico[11 - c] * c;
  }

  const digito_2 = 11 - (soma % 11);
  if (digito_2 >= 10) digito_2 = 0;

  if (digito_1 === CPFnumerico[9] && digito_2 === CPFnumerico[10]) {
    return true;
  } else {
    return false;
  }
};

const validaEmail = (email) => {
  const regex = /\S+@\S+\.\S+/;
  return regex.test(email);
};

module.exports = { validaCPF, validaEmail };
