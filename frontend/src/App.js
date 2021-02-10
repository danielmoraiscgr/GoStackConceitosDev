import React, { useState, useEffect } from 'react';
// useEffect -> disparar funcao assim que 
import api from './services/api';

import './App.css';

//import backgroundImage from './assets/background.jpg';

import Header from './components/Header';

function App(){

  const [projects, setProjects] = useState([]);

  useEffect(()=>{
       api.get('projects').then(response=>{
            setProjects(response.data);
       });

  },[]);  // [] array de dependencia

  // useState retonar um array com 2 posicoes
  // 1. Variavel com o seu valor inicial
  // 2. Funcao para atualizarmos esse valor


  async function handleAddProjet(){
      //projects.push(`Novo Projeto ${Date.now()}`);

      //setProjects([...projects, `Novo Projeto ${Date.now()}`]); 
      
    const response = await api.post('projects',{
        title: "Delhi backend",
        owner: "Daniel"
      });

      const project = response.data; 

      setProjects([...projects, project]);

  }
  return (
    <>
    <Header title="Projetos" />
    {/* <img width={500} src={backgroundImage}/> */}
    <ul>
      {projects.map(project =>
         <li key={project.id}>{project.title}</li>)}      
    </ul>
    <button type="button" onClick={handleAddProjet}>Adicionar projeto</button>
    </>
  )
}
export default App;