import React from 'react';
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
                    <p>Vous pouvez ajouter un service en cliquant sur "NEW SERVICE"</p>
                    <br />
                    <p>Il vous sera alors demandé : la descritpion, le type de mesure et sa fréquence. 
                        Une fois cela réalisé, il y sera affecté un intermédiaire technique afin d'y associer votre bridge eco-capt.        
                        Grace à lui, vos mesures seront traitées, certifiées et affichées dans votre application.</p>
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