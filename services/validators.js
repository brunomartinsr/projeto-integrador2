export const checkCPF = (CPF) => {
  if (typeof CPF !== "string") {
    CPF = CPF.toString();
  }

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

  let digito_1 = 11 - (soma % 11);
  if (digito_1 >= 10) digito_1 = 0;

  soma = 0;
  for (let c = 11; c >= 2; c--) {
    soma += CPFnumerico[11 - c] * c;
  }

  let digito_2 = 11 - (soma % 11);
  if (digito_2 >= 10) digito_2 = 0;

  if (digito_1 === CPFnumerico[9] && digito_2 === CPFnumerico[10]) {
    return true;
  } else {
    return false;
  }
};

export const checkEmail = (email) => {
  const regex = /\S+@\S+\.\S+/;
  return regex.test(email);
};
