import React from 'react';
import "./HomeClient.css";

export default class HomeClient extends React.Component {

    render() {
        return (
            <div className="home">
                <div className="home-main">
                    <h1 className="home-title">Mes clients</h1>
                    <p className="home-p">Bienvenue Maître</p>
                    <br />
                    <p>Vous trouverez la liste de nos clients sur votre droite</p>
                    <br />
                    <p>Pour voir le détail d'un client, cliquez dessus.</p>
                    <br />
                    <p>Vous pouvez ajouter un client en cliquant sur "NEW CLIENT"</p>
                    <br />
                    <p>Être honnête n'a jamais été aussi simple !</p>
                    <div className="home-logo">
                        <a href="."><img width="208" src="ecocapt-logo.png" href="." alt="ecocap-logo"/></a>
                    </div>
                </div>
            </div>
        );      
    }
}