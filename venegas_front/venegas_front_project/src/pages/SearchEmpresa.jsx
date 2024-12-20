

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


import axios from 'axios';



import "./SearchEmpresa.css"



const calcularMediaRentabilidade = (dados) => {
    // Soma das rentabilidades
    const somaRentabilidade = dados.reduce((soma, item) => soma + item.rentabilidade, 0);
  
    // Número de meses (tamanho do array)
    const numeroMeses = dados.length;
  
    // Cálculo da média
    const mediaRentabilidade = somaRentabilidade / numeroMeses;
  
    return mediaRentabilidade;
};

const calcularMediaFaturamento = (dados) => {
    // Soma das rentabilidades
    const somaFaturamento = dados.reduce((soma, item) => soma + item.faturamento, 0);
  
    // Número de meses (tamanho do array)
    const numeroMeses = dados.length;
  
    // Cálculo da média
    const mediaFaturamento = somaFaturamento / numeroMeses;
  
    return mediaFaturamento;
};

const calcularMediaLucratividade = (dados) => {
    // Soma das rentabilidades
    const somaLucro = dados.reduce((soma, item) => soma + item.lucro, 0);
  
    // Número de meses (tamanho do array)
    const numeroMeses = dados.length;
  
    // Cálculo da média
    const mediaLucro = somaLucro / numeroMeses;
  
    return mediaLucro;
};


const getLucratividadeColor = (lucro) => {

    if (lucro > 0) return 'green';
    if (lucro <=0) return 'red';
}

const getRentabilidadeColor = (r) =>{

    if (r>2) return 'green'
    if(r >1 && r<2) return 'orange'
    if(r<1) return 'red'


}

const somaColunaX = (response, nomeColuna) => {

    const coluna = nomeColuna;

    // Função para somar todos os valores de uma coluna específica
    const somaColuna = response.reduce((acc, item) => {
        if (item[coluna] !== undefined && typeof item[coluna] === 'number') {
            acc += item[coluna];
        }
        return acc;
    }, 0);


    return(
        somaColuna
    );

};




const SearchEmpresa = () => {

    const [errorMessage, setErrorMessage] = useState('');

    const [searchParams] = useSearchParams();

    const [empresaData, setEmpresaData] = useState([]);

    const query = searchParams.get("q");

    const [data, setData] = useState([]);

    const [loading, setLoading] = useState(true);


    const[nomeEmpresa, setNomeEmpresa] = useState('')


    const geempreCodURL = import.meta.env.VITE_API_GEEMPRE_SEARCH_CODE

    const regEmpreCodURL = import.meta.env.VITE_API_EMPRESA_SEARCH_COD

    useEffect(()=>{
        axios
        .get(`${geempreCodURL}?cod_empresa=${query}`)
        .then((response)=>{
            console.log('Nome Empresa', response)
            setNomeEmpresa(response)
        })
    },[])
    
    useEffect(()=>{
        axios
        .get(`${regEmpreCodURL}?cod_empresa=${query}`)
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


    


    return(

        <main id="search-empresa-main">

            <div className="empresa-area">
                <h1>Empresa Buscada : {query} - {nomeEmpresa.data}</h1>

            </div>


            <div className="empresa-data">
                <div className="nome-empresa"></div>

                <div className="general-data">

                    <div className="faturamento-medio"> Faturamento Médio: R$ {calcularMediaFaturamento(data).toLocaleString('pt-BR',{minimumFractionDigits: 2,maximumFractionDigits: 2,})}</div>
                    
                    <div className="lucro-total"
                        style={{color:getLucratividadeColor(somaColunaX(data, 'lucro'))}}
                    > Lucro Total: R$ {somaColunaX(data, 'lucro').toLocaleString('pt-BR',{minimumFractionDigits: 2,maximumFractionDigits: 2,})}</div>

                    <div className="lucratividade-medio"
                        style={{color:getLucratividadeColor(calcularMediaLucratividade(data))}}
                    > Lucro Médio: R$ {calcularMediaLucratividade(data).toLocaleString('pt-BR',{minimumFractionDigits: 2,maximumFractionDigits: 2,})}</div>

                    <div className="rentabilidade-medio"
                        style={{color:getRentabilidadeColor(calcularMediaRentabilidade(data))}}
                    > Rentabilidade Média:  {calcularMediaRentabilidade(data).toLocaleString('pt-BR',{minimumFractionDigits: 2,maximumFractionDigits: 2,})}</div>
                </div>

                <div className="grafic-data">

                    <div className="distribuicao-geral">

                        <h2>Distribuição Geral de Valores:</h2>

                        <div className="grafic-general-distribution  grafic">

                            <ResponsiveContainer width={"100%"} height={"100%"}>
                                <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="data" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="faturamento" stroke="#8884d8" isAnimationActive={true} animationDuration={2000}  animationEasing="ease-out" />
                                    <Line type="monotone" dataKey="custo_fixo_total" stroke="#82ca9d" isAnimationActive={true} animationDuration={2000}  animationEasing="ease-out" />
                                    <Line type="monotone" dataKey="custo_total" stroke="#ff7300" isAnimationActive={true} animationDuration={2000}  animationEasing="ease-out"  />
                                    <Line type="monotone" dataKey="lucro" stroke="#d0ed57" isAnimationActive={true} animationDuration={2000}  animationEasing="ease-out" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="distribuicao-departaments">

                        <h2>Distribuição de Valores por Departamento:</h2>

                        <div className="grafic-departament-distribution grafic">
                            <ResponsiveContainer width={"100%"} height={"100%"}>
                                <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="data" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="custo_fiscal" stroke="#8884d8" />
                                    <Line type="monotone" dataKey="custo_dp" stroke="#82ca9d" />
                                    <Line type="monotone" dataKey="custo_contabil" stroke="#ff7300" />
                                </LineChart>
                            </ResponsiveContainer>


                            

                        </div>
                    </div>

                    <div className="distribuicao-rentabilidade">

                        <h2>Distribuição Rentabilidade:</h2>

                        <div className="grafic-rentability-distribution grafic">
                            <ResponsiveContainer width={"100%"} height={"100%"}>
                                <LineChart   data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="data" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="rentabilidade" stroke="#8884d8" isAnimationActive={true} animationDuration={5000}/>
                                </LineChart>
                            </ResponsiveContainer>
                            
                            
                        </div> 
                    </div>

                </div>

                <div className="empresas-show-area">

                    <h2>Dados Empresa {query}</h2>

                    <ul className="table-empresa">
                        <li>
                            <div className="list-header">
                                <div >Codigo</div>
                                <div >Faturamento</div>
                                <div>Custo Total</div>
                                <div>Lucro</div>
                                <div>R</div>
                                <div>Fixo</div>
                                <div>Fiscal</div>
                                <div>DP</div>
                                <div>Contabil</div>
                                <div>Data</div>
                            </div>
                        </li>
                        {data.map((item, index) => (
                            <li key={index}>
                                <div className="box-empresa">
                                    <div className="cell">{item.cod_empresa}</div>
                                    <div className="cell">{(item.faturamento).toLocaleString('pt-BR',{minimumFractionDigits: 2,maximumFractionDigits: 2,})}</div>
                                    <div className="cell">{(item.custo_total).toLocaleString('pt-BR',{minimumFractionDigits: 2,maximumFractionDigits: 2,})}</div>
                                    <div className="cell">{(item.lucro).toLocaleString('pt-BR',{minimumFractionDigits: 2,maximumFractionDigits: 2,})}</div>
                                    <div className="cell">{item.rentabilidade}</div>
                                    <div className="cell">{(item.custo_fixo_total).toLocaleString('pt-BR',{minimumFractionDigits: 2,maximumFractionDigits: 2,})}</div>
                                    <div className="cell">{(item.custo_fiscal).toLocaleString('pt-BR',{minimumFractionDigits: 2,maximumFractionDigits: 2,})}</div>
                                    <div className="cell">{(item.custo_dp).toLocaleString('pt-BR',{minimumFractionDigits: 2,maximumFractionDigits: 2,})}</div>
                                    <div className="cell">{(item.custo_contabil).toLocaleString('pt-BR',{minimumFractionDigits: 2,maximumFractionDigits: 2,})}</div>
                                    <div className="cell">{item.data}</div>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <h2>Totais Empresa:</h2>

                    <ul className="table-empresa">

                        <li>

                        <div className="list-header">
                                <div >Faturamento</div>
                                <div>Custo Total</div>
                                <div>Lucro</div>
                                <div>Fixo</div>
                                <div>Fiscal</div>
                                <div>DP</div>
                                <div>Contabil</div>

                            </div>
                        </li>

                        <li>
                            <div className="box-empresa">
                                <div className="cell">{(somaColunaX(data, 'faturamento')).toLocaleString('pt-BR',{minimumFractionDigits: 2,maximumFractionDigits: 2,})}</div>
                                <div className="cell">{(somaColunaX(data, 'custo_total')).toLocaleString('pt-BR',{minimumFractionDigits: 2,maximumFractionDigits: 2,})}</div>
                                <div className="cell">{(somaColunaX(data, 'lucro')).toLocaleString('pt-BR',{minimumFractionDigits: 2,maximumFractionDigits: 2,})}</div>
                                <div className="cell">{(somaColunaX(data, 'custo_fixo_total')).toLocaleString('pt-BR',{minimumFractionDigits: 2,maximumFractionDigits: 2,})}</div>
                                <div className="cell">{(somaColunaX(data, 'custo_fiscal')).toLocaleString('pt-BR',{minimumFractionDigits: 2,maximumFractionDigits: 2,})}</div>
                                <div className="cell">{(somaColunaX(data, 'custo_dp')).toLocaleString('pt-BR',{minimumFractionDigits: 2,maximumFractionDigits: 2,})}</div>
                                <div className="cell">{(somaColunaX(data, 'custo_contabil')).toLocaleString('pt-BR',{minimumFractionDigits: 2,maximumFractionDigits: 2,})}</div>

                            </div>
                        </li>
                    </ul>

                </div>
            </div>

        </main>

    );
};


export default SearchEmpresa;