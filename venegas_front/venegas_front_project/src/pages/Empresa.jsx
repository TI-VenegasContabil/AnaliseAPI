
import { useEffect, useState } from "react";    
import { Link, useNavigate } from "react-router-dom";
import { BiCameraMovie, BiSearchAlt2 } from "react-icons/bi";

import axios from 'axios';


import './Empresa.css'

const Empresa = () =>{


    const currentDate = new Date();

    // Obtém o mês atual e subtrai 1 para obter o mês anterior
    const lastMonth = currentDate.getMonth() - 1;
    
    // Verifica se estamos em janeiro, para ajustar para dezembro do ano anterior
    const year = lastMonth < 0 ? currentDate.getFullYear() - 1 : currentDate.getFullYear();
    const month = lastMonth < 0 ? 11 : lastMonth; // Dezembro é representado por 11
  
    // Cria uma nova data para o primeiro dia do mês anterior
    const firstDayLastMonth = new Date(year, month, 1);
  
    // Formata a data no formato '01-MM-YYYY'
    const day = String(firstDayLastMonth.getDate()).padStart(2, '0');
    const formattedDate = `${day}-${String(firstDayLastMonth.getMonth() + 1).padStart(2, '0')}-${firstDayLastMonth.getFullYear()}`;


    const [data, setData] = useState([]);

    const regEmpreDateURL = import.meta.env.VITE_API_EMPRESA_SEARCH_DATA
    
    useEffect(()=>{
        axios.get(`${regEmpreDateURL}?data=${formattedDate}`)
        .then(response=>{
            console.log('Response Data:', response.data);
            setData(response.data)});
    }, []);



    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!search) return;

        navigate(`/searchempresa?q=${search}`, { replace: true });
        setSearch("");
    };
        


    return (

        <main id='main-empresa'>

            <div className="search-area">
                <h2>Busque por empresas:</h2>
                
                <form  onSubmit={handleSubmit}>
                    <input type="text" 
                        placeholder="Codigo da empresa"
                        onChange={(e) => setSearch(e.target.value)}
                        value={search}
                    />
                    <button type="submit">
                        <BiSearchAlt2 className="lupa-img"/>
                    </button>
                </form>

            </div>




            <div className="empresas-show-area">

                <h2>Empresas no ultimo mês:</h2>

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
                            </div>
                        </li>
                    ))}
                </ul>
            
            </div>
        </main>


    );
};

export default Empresa;
