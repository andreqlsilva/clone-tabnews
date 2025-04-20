const calculadora = require("../models/calculadora.js");

test("somar 2 + 2 deveria retornar 4", () => {
  const res = calculadora.somar(2, 2);
  expect(res).toBe(4);
});

test("somar 5 + 100 deveria retornar 105", () => {
  const res = calculadora.somar(5, 100);
  expect(res).toBe(105);
});

test("somar 'banana' + 100 deveria retornar 'Erro'", () => {
  const res = calculadora.somar("banana", 100);
  expect(res).toBe("Erro");
});
