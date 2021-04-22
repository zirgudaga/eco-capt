import React from 'react';
import "./FormClient.css";
import MyNotif from '../MyNotif.js';

export default class FormClient extends React.Component {

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

    addClient = async () => {
        let { errorMessage } = this.state;

        let context = this;

        if(
            this._description.value.trim() === '' ||
            this._customerAddress.value.trim() === '' ||
            this._contractAddress.value.trim() === '' ||
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
        await ledgerContract.methods.setCustomer(
            this._description.value.trim(),
            this._customerAddress.value.trim(),
            this._contractAddress.value.trim(),            
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
            <div className="form-newclient-body">
                <span className="form-service-close" onClick={()=>this.props.close()}>X</span><br/>

                <MyNotif 
                    contractAddress={this.props.state.ledgerContract._address}
                    errorMessage={this.state.errorMessage}    
                />

                <form>
                    <div className="form-newclient-label">
                        <label>
                            Nom du client
                        </label>
                        <input type="text" name="_description" className="form-newclient-detail" placeholder="Nom du client"
                            ref={(input) => { 
                                this._description = input
                            }}
                        />
                    </div>

                    <div className="form-newclient-label">
                        <label>
                            Addresse ETH du client
                        </label>
                        <input type="text" name="_customerAddress" className="form-newclient-detail" placeholder="Addresse ETH du client"
                            ref={(input) => { 
                                this._customerAddress = input
                            }}
                        />
                    </div>

                    <div className="form-newclient-label">
                        <label>
                        Addresse ETH du contrat
                        </label>
                        <input type="text" name="_contractAddress" className="form-newclient-detail" placeholder="Addresse ETH du contrat"
                            ref={(input) => { 
                                this._contractAddress = input
                            }}
                        />
                    </div>

                    <div className="form-newclient-label">
                        <label>
                            Numéro de siret
                        </label>
                        <input type="text" name="_siretNumber" className="form-newclient-detail" placeholder="Numéro du Siret du client"
                            ref={(input) => { 
                                this._siretNumber = input
                            }}
                        />
                    </div>

                    <button type="button" className="form-client-cta" 
                        onClick= { () => this.addClient() }>Add Client
                    </button> 
    
                </form>

            </div>
        );      
    }
}