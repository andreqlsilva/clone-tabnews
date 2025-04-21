function status(request, response) {
  response.status(200).json({ chave: "Não existe almoço grátis" });
}

export default status;
