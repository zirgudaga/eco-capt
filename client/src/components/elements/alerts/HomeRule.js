import React from 'react';
import "./HomeRule.css";

export default class HomeRule extends React.Component {

    render() {
        return (
            <div className="home-rule">
                <div className="home-rule-main">
                    <h1 className="home-rule-title">Mes Alertes</h1>
                    <p className="home-rule-p">Bienvenue sur votre interface</p>
                    <br />
                    <p>Vous trouverez la liste de vos règles d'alerte sur votre droite</p>
                    <br />
                    <p>Pour voir le détail d'un type d'alerte, cliquez dessus.</p>
                    <br />
                    <p>Vous pouvez ajouter un règle d'alerte en cliquant sur "NEW RULE"</p>
                    <br />
                    <p>Il vous sera alors demandé : la descritpion, le type d'arlerte, le rule associé et le seuil. 
                        Une fois cela réalisé, votre bridge eco-capt transmettra une alerte dès que les règles indiquées seront outrepassées.      
                        Grace à cela, vous aurez un oeil bienveillant mais attentif sur l'ensemble de vos émissions.</p>
                    <br />
                    <p>Être honnête n'a jamais été aussi simple !</p>
                    <div className="home-rule-logo">
                        <a href="."><img width="208" src="ecocapt-logo.png" href="." alt="ecocap-logo"/></a>
                    </div>
                </div>
            </div>
        );      
    }
}