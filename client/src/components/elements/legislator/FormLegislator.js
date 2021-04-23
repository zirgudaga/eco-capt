import React from 'react';
import "./FormLegislator.css";
import MyNotif from '../MyNotif.js';

export default class FormLegislator extends React.Component {

    // string memory _description,
    // address _customerAddress, 
    // address _contractAddress,
    // uint _siretNumber,
    // bool _isActive

    constructor(props) {
        super(props);
        this.state = {
            errorMessage: '',
        };
    }

    addLegislator = async () => {
        let { errorMessage } = this.state;

        let context = this;

        if(
            this._description.value.trim() === '' ||
            this._legislatorAddress.value.trim() === '' ||
            this._siretNumber.value<= '0'
        ){
            errorMessage = "Merci de remplir correctement le formulaire !";
            this.setState({ errorMessage });

            setTimeout(()=>{
                errorMessage = "";
                this.setState({ errorMessage });
            },2000);

            return ;
        }

        const { accounts, ledgerContract } = this.props.state;
        await ledgerContract.methods.setLegislator(
            this._description.value.trim(),
            this._legislatorAddress.value.trim(),          
            this._siretNumber.value,
            true       
        ).send({ from: accounts[0] },
            async (erreur, tx) => {
                context.props.close();                
                if(tx){

                }
            }
        ); 
    };

    render() {
        return (
            <div className="form-newlegislator-body">
                <span className="form-legislator-close" onClick={()=>this.props.close()}>X</span><br/>

                <MyNotif 
                    contractAddress={this.props.state.ledgerContract._address}
                    errorMessage={this.state.errorMessage}    
                />

                <form>
                    <div className="form-newlegislator-label">
                        <label>
                            Nom du legislator
                        </label>
                        <input type="text" name="_description" className="form-newlegislator-detail" placeholder="Nom du legislator"
                            ref={(input) => { 
                                this._description = input
                            }}
                        />
                    </div>

                    <div className="form-newlegislator-label">
                        <label>
                            Addresse ETH du legislator
                        </label>
                        <input type="text" name="_legislatorAddress" className="form-newlegislator-detail" placeholder="Addresse ETH du legislator"
                            ref={(input) => { 
                                this._legislatorAddress = input
                            }}
                        />
                    </div>

                    <div className="form-newlegislator-label">
                        <label>
                            Numéro de siret
                        </label>
                        <input type="text" name="_siretNumber" className="form-newlegislator-detail" placeholder="Numéro du Siret du legislator"
                            ref={(input) => { 
                                this._siretNumber = input
                            }}
                        />
                    </div>

                    <button type="button" className="form-legislator-cta" 
                        onClick= { () => this.addLegislator() }>Add Legislator
                    </button> 
    
                </form>

            </div>
        );      
    }
}