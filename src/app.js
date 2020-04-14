const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes:0,
  }

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  const repIndex = repositories.findIndex(r => r.id === id);

  if (repIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' });
  }

  const repo = repositories[repIndex];
  
  // Utilizando o Spread (...repo) para pegar todas as variáveis de repo
  // e sobreescrvendo os valores do restante. Utilizando assim para fixar a sua utilização
  const repository = {
    ...repo,
    title: title,
    url: url,
    techs: techs
  }

  repositories[repIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repIndex = repositories.findIndex(r => r.id == id);

  if (repIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' });
  }

  repositories.splice(repIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repIndex = repositories.findIndex(r => r.id === id);

  if (repIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' });
  }

  const repository = repositories[repIndex];

  repository.likes += 1;
  repositories[repIndex] = repository;
  
  return response.status(200).json(repository);
});

module.exports = app;
