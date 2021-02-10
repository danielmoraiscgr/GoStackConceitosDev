const express = require('express');
const cors = require('cors');
const { uuid, isUuid } = require('uuidv4');

const app = express(); 

app.use(cors());
app.use(express.json()); // sempre antes das rotas.

/** Metodos HTTP 
 * GET: Buscar informacoes do back-end
 * POST: Criar uma informação no back-end
 * PUT/PATCH: Alterar uma informacao no back-end
 * DELETE: Deletar uma informação no back-end
*/

/**
 * Tipos de parãmetros: 
 * 
 * Query Parms: Filtros e paginação
 * Route Params: Identificar recursos (Atualizar/Deletar)
 * Request Body: Conteúdo na hora de criar ou editar um recurso.
 * vem atraves da estrutura (JSON). Criar instancia app.use(expressa.json())
 */

 /**
  * Middleware 
  * Interceptador de requisiçõe. Pode interromper totalmente a requisição ou alterar dados da requisição
  * Vamos utilizar o Middleware quando algum trecho de código seja disparado para uma ou mais rotas da aplicação
  * Sao usados muitos nas validações. 
  */

const projects = []; 

function logRequests(request, response, next){
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.log(logLabel);  // interrompeu totalmente a requisição, no GET nao lista

  return next(); // Vai chamar o próximo middleware
}

function validateProjectId(request, response, next){
    const { id } = request.params;

    if (!isUuid(id)){
      return response.status(400).json({ error: 'Invalid Project Id.'});
    }

    return next(); // Deixa a rota acontecer. 
}


app.use(logRequests); // 1 - aplicar o middle em todas as rotas

/**
 *  caso queira apenas aplicar a middleware em apenas uma rota:
 *  2 - app.get('projects' logRequests, (request, response ) => {})
 *  3 - app.get('projects' logRequests, middleware1, middleware2, (request, response) =>{})
 *  4 - Usando a rota app.get('/projects/:id',validateProjectId);
 *  Será aplicado apenas para o PUT e DELETE.
 */
app.get('/projects/:id', validateProjectId);

app.get('/projects',(request, response)=>{
  const { title } = request.query; 

  const results = title
  ? projects.filter(project => project.title.includes(title))
  : projects;

   return response.json(results)
});

app.post('/projects',(request, response)=>
{  const { title, owner } = request.body; 

   const project = {id: uuid(), title, owner };

    projects.push(project);

  return response.json(project);
})

app.put('/projects/:id',(request, response)=>{
  const { id } = request.params; 
  const { title, owner } = request.body;

  const projectIndex = projects.findIndex(project=> project.id==id);

  if(projectIndex < 0) {
    return response.status(400).json({ error: 'Project not found. '});
  }

  const project = {
    id,
    title,
    owner,
  };

  projects[projectIndex] = project; 

  return response.json(project);
})

app.delete('/projects/:id',(request, response)=>{
  const { id } = request.params; 
 
  const projectIndex = projects.findIndex(project=> project.id==id);

  if(projectIndex < 0) {
    return response.status(400).json({ error: 'Project not found. '});
  }

  projects.splice(projectIndex,1);

  return response.status(204).send(); // Na delecao, apenas retornar em branco. 
                                      // Recomendado retornar 204 quando retornar vazia. 
})


app.listen(3334, ()=>{
  console.log('Back-end started');
});


