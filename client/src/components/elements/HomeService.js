import React from 'react';
import CardGraph from './CardGraph.js';
import "./HomeService.css";

export default class HomeService extends React.Component {

    render() {
        return (
            <div className="home-service">
                <div className="home-service-main">
                    <h1 className="home-service-title">Mes services</h1>
                    <p className="home-service-p">Bienvenue sur votre interface</p>
                    <br />
                    <p>Vous trouverez la liste de vos services sur votre droite</p>
                    <br />
                    <p>Pour voir le détail d'un service, cliquez dessus.</p>
                    <br />
                    <p>Vous pouvez ajouter un service ou demandez une nouvelle mesure en cliquant sur les boutons</p>
                    <br />
                    <p>"NEW SERVICE" et "NEW MEASURE"</p>
                    <br />
                    <p>Être honnête n'a jamais été aussi simple !</p>
                    <div className="home-service-logo">
                        <a href="."><img width="208" height="128" src="ecocapt-logo.png" href="." alt="ecocap-logo"/></a>
                    </div>
                </div>
            </div>
        );      
    }
}