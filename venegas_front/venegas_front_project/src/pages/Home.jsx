import { useEffect, useState } from "react";


import "./Home.css"

import backTechVideo from "../assets/backTechVideo.mp4"

const Home = () =>{
    
    return(
        <main>
            <div className="container">
                <video src={backTechVideo} autoPlay loop muted/>

                <div className="content">
                    <h1>Venegas Estatistica</h1>

                    <p>A estatistica computacional aplicada ao seu negocio para gerenciamento</p>

                </div>
            </div>

        </main>

    );
};



export default Home;