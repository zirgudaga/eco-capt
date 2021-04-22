import React from 'react';
import "./HomeTechnician.css";

export default class HomeTechnician extends React.Component {

    render() {
        return (
            <div className="home-techician">
                <div className="home-techician-main">
                    <h1 className="home-techician-title">Mes techicians</h1>
                    <p className="home-techician-p">Bienvenue Maître</p>
                    <br />
                    <p>Vous trouverez la liste de nos techicians sur votre droite</p>
                    <br />
                    <p>Pour voir le détail d'un techician, cliquez dessus.</p>
                    <br />
                    <p>Vous pouvez ajouter un techician en cliquant sur "NEW techician"</p>
                    <br />
                    <p>Être honnête n'a jamais été aussi simple !</p>
                    <div className="home-techician-logo">
                        <a href="."><img width="208" src="ecocapt-logo.png" href="." alt="ecocap-logo"/></a>
                    </div>
                </div>
            </div>
        );      
    }
}