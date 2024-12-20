
import { useState } from "react";
import { Link, useNavigate , NavLink, UNSAFE_shouldHydrateRouteLoader} from "react-router-dom";
import { AiFillCodeSandboxCircle } from "react-icons/ai";

import "./Navbar.css"



const Navbar = () =>{



    return(

        <header className="header">

            <nav className="navbar">

                <ul  id="regular-nav">
                    <li><NavLink  className = "hideOnMobile link" to="/"> <AiFillCodeSandboxCircle className="logo-img"/>Venegas Analise</NavLink></li>
                    <li><NavLink  className = "hideOnMobile link" to="empresa">Empresas</NavLink></li>
                    <li><NavLink  className = "hideOnMobile link" to="/pessoa">Pessoas</NavLink></li>
                    <li><NavLink  className = "hideOnMobile link" to="geral">Geral</NavLink></li>
                   
                </ul>

            </nav>
            
        </header>

    );

};





export default Navbar;