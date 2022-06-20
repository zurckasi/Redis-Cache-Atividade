const { response } = require("express");
const res = require("express/lib/response");
const Pessoa = require("../models/pessoa");
const dataCache = require("../database/db");

const buscarPessoa = async (request, response) => {
  const email = request.params.email;
  const client = await dataCache.conectar();
  const objPes = await client.get(email);

  //Objeto não esta no Cache
  if (objPes == null) {
    const pessoa = await Pessoa.findOne({
      where: {
        email: email,
      },
    });
    if (pessoa == null) {
      await client.disconnect();
      response.status(400).send("Usuario não encontrado");
    } else {
      console.log("Pessoa trazida do postgre, atualizando cache...");
      const result = await client.set(pessoa.email, JSON.stringify(pessoa), {
        EX: 3600,
      });
      await client.disconnect();
      response.status(200).send(pessoa);
    }
  } else {
    //Se objeto estiver no cache
    console.log("Pessoa trazida do cache");
    pessoa = JSON.parse(objPes);
    await client.disconnect();
    response.status(200).send(pessoa);
  }
};

const getPessoas = async (request, response) => {
  const pessoas = await Pessoa.findAll();
  response.status(200).send(pessoas);
};

const addPessoa = async (request, response) => {
  const pessoa = Pessoa.build(request.body);
  pessoa
    .save()
    .then(() => {
      response.status(200).send("Usuário criado!");
    })
    .catch((err) => {
      response.status(400).send("Falha ao salvar");
    });
};

const deletarPessoa = async (request, response) => {
  const email = request.params.email;

  Pessoa.destroy({
    where: {
      email: email,
    },
  })
    .then((result) => {
      if (result > 0) {
        response.status(200).send("Usuário removido");
      } else {
        response.status(200).send("Usuário não encontrado");
      }
    })
    .catch((err) => {
      response.status(400).send("Falha ao remover");
    });
};

const atualizarPessoa = async (request, response) => {
  Pessoa.update(
    {
      nome: request.body.nome,
    },
    {
      where: {
        email: request.body.email,
      },
    }
  )
    .then((result) => {
      if (result > 0) {
        response.status(200).send("Usuário atualizado");
      } else {
        response.status(200).send("Usuário não encontrado");
      }
    })
    .catch((err) => {
      console.log(err);
      response.status(400).send("Falha ao atualizar");
    });
};

const sincronizar = async (request, response) => {
  await Pessoa.sync();
  response.status(200).send("Sincronizado");
};

module.exports = {
  getPessoas,
  addPessoa,
  sincronizar,
  deletarPessoa,
  atualizarPessoa,
  buscarPessoa,
};
