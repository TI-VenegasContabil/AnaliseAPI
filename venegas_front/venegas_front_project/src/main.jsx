import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.jsx';

import Home from './pages/Home.jsx';
import Empresa from './pages/Empresa.jsx';
import SearchEmpresa from './pages/SearchEmpresa.jsx';
import Pessoa from './pages/Pessoa.jsx';
import SearchFuncionario from './pages/SearchFuncionario.jsx'
import Geral from './pages/Geral.jsx';

import './index.css'

import {BrowserRouter, Routes, Route} from "react-router-dom";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route>
          <Route element = {<App />}>
            <Route path ="/" element = {<Home />}/>
            <Route path ="/empresa" element = {<Empresa />}/>
            <Route path ="/searchempresa" element = {<SearchEmpresa />}/>
            <Route path ="/pessoa" element = {<Pessoa />}/>
            <Route path ="/searchpessoa" element = {<SearchFuncionario />}/>
            <Route path ="/geral" element = {<Geral />}/>
            
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
