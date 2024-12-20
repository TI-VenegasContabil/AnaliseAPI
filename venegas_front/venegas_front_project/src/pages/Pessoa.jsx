import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom"; 
import { Link, useNavigate } from "react-router-dom";
import { BiCameraMovie, BiSearchAlt2 } from "react-icons/bi";

import axios from 'axios';

import './Pessoa.css'



const Pessoa = () =>{


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


    const regFuncDateURL = import.meta.env.VITE_API_PESSOA_SEARCH_DATA

    useEffect(()=>{

        axios.get(`${regFuncDateURL}?data=${formattedDate}`)
        .then(response=>{
            console.log('Response Data:', response.data);
            setData(response.data)
        });
    },[]);


    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!search) return;

        navigate(`/searchpessoa?q=${search}`, { replace: true });
        setSearch("");
    };

    return (

        <main id="main-empresa">

            <div className="search-area">

                <h2>Busque por Pessoa</h2>

                <form onSubmit={handleSubmit}>
                    <input type="text" 
                        placeholder="Nome da pessoa"
                        onChange={(e) => setSearch(e.target.value)}
                        value={search}   
                    />
                    <button type="submit">
                        <BiSearchAlt2 className="lupa-img"/>
                    </button>
                </form>

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
                        </div>
                    </li>

                    {data.map((item, index)=>(
                        <li key={index}>
                            <div className="box-pessoa">
                                <div className="cell-pessoa">{item.nome_func}</div>
                                <div className="cell-pessoa">{item.departamento}</div>
                                <div className="cell-pessoa">R${(item.total_hora).toLocaleString('pt-br', {minimumFractionDigits:2, maximumFractionDigits:2})}</div>
                                <div className="cell-pessoa ">{(item.tempo_ativ).toLocaleString('pt-br', {minimumFractionDigits:2, maximumFractionDigits:2})} Horas</div>

                            </div>
                        </li>
                    ))}

                </ul>

            </div>

            

        </main>
    );
};

export default Pessoa;