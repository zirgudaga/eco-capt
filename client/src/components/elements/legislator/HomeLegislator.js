import React from 'react';
import "./HomeLegislator.css";

export default class HomeLegislator extends React.Component {

    render() {
        return (
            <div className="home-legislator">
                <div className="home-legislator-main">
                    <h1 className="home-legislator-title">Mes legislator</h1>
                    <p className="home-legislator-p">Bienvenue Maître</p>
                    <br />
                    <p>Vous trouverez la liste de nos clients sur votre droite</p>
                    <br />
                    <p>Pour voir le détail d'un legislator, cliquez dessus.</p>
                    <br />
                    <p>Vous pouvez ajouter un legislator en cliquant sur "NEW legislator"</p>
                    <br />
                    <p>Être honnête n'a jamais été aussi simple !</p>
                    <div className="home-legislator-logo">
                        <a href="."><img width="208" src="ecocapt-logo.png" href="." alt="ecocap-logo"/></a>
                    </div>
                </div>
            </div>
        );      
    }
}