import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


import axios from 'axios';

import './SearchFuncionario.css'


const SearchFuncionario = () =>{

    const [searchParams] = useSearchParams();
    const [pessoaData, setPessoaData] = useState([]);
    const query = searchParams.get("q");

    const [data, setData] = useState([]);


    const regFuncNomeURL = import.meta.env.VITE_API_PESSOA_SEARCH_NOME


    useEffect(()=>{
        axios
        .get(`${regFuncNomeURL}?nome_func=${query}`)
        .then((response) => {
            console.log('Response Data:', response.data);
            if (response.data.length === 0) {
            setErrorMessage("Nenhuma empresa encontrada para o código fornecido.");
            } else {
            setData(response.data);
            setErrorMessage("");  // Limpar qualquer mensagem de erro anterior
            }
            setLoading(false);
        })
        .catch((error) => {
            console.error('Erro ao fazer a requisição:', error);
            setErrorMessage("Ocorreu um erro ao tentar buscar os dados.");
            setLoading(false);
        });
    }, []);


    return (
        <main id="search-func-main">

            <h1>{query}</h1>

            <div className="grafic-area">

                <div id='dist-time'>Distribuição de Tempo:</div>

                <div className="time-distribution grafic">

                    <ResponsiveContainer width={"100%"} height={"100%"}>
                        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="data" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="tempo_ativ" stroke="#8884d8" isAnimationActive={true}  animationEasing="ease-out" />                                                        
                        </LineChart>
                    </ResponsiveContainer>

                </div>

            </div>

            <div className="pessoa-show-area">
                <h2>Registros do ultimo mês:</h2>

                <ul className="table-pessoa">

                    <li>
                        <div className="list-header-pessoa">
                            <div>Nome</div>
                            <div>Departamento</div>
                            <div>Valor Hora</div>
                            <div>Tempo Atividade</div>
                            <div>Data</div>
                        </div>
                    </li>

                    {data.map((item, index)=>(
                        <li key={index}>
                            <div className="box-pessoa">
                                <div className="cell-pessoa">{item.nome_func}</div>
                                <div className="cell-pessoa">{item.departamento}</div>
                                <div className="cell-pessoa">R${(item.total_hora).toLocaleString('pt-br', {minimumFractionDigits:2, maximumFractionDigits:2})}</div>
                                <div className="cell-pessoa ">{(item.tempo_ativ).toLocaleString('pt-br', {minimumFractionDigits:2, maximumFractionDigits:2})} Horas</div>
                                <div className="cell-pessoa">{item.data}</div>
                            </div>
                        </li>
                    ))}

                </ul>

            </div>

        </main>
    );
};


export default SearchFuncionario;