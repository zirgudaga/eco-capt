import React from 'react';
import "./FormLegislator.css";
import MyNotif from '../MyNotif.js';

export default class FormLegislator extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            errorMessage: '',
            _description: '',
            _legislatorAddress: '',
            _siretNumber: '',
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentDidMount = () => {
        let { isNew, elementToUpdate } = this.props;

        if(isNew == false){
            let { _description, _legislatorAddress, _siretNumber } = this.props;
    
            _description = elementToUpdate.description;
            _legislatorAddress = elementToUpdate.legislatorAddress;
            _siretNumber = elementToUpdate.siretNumber;        

            this.setState({ _description, _legislatorAddress, _siretNumber });  
        }
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
    
        this.setState({
          [name]: value
        });
    }
    
    addElement = async () => {
        let { errorMessage, _description, _legislatorAddress, _siretNumber } = this.state;

        let context = this;

        if(
            _description.trim() === '' ||
            _legislatorAddress.trim() === '' ||
            _siretNumber <= '0'
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
            _description.trim(),
            _legislatorAddress.trim(),       
            _siretNumber,
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
            <div className="form-body">
                <span className="form-close" onClick={()=>this.props.close()}>X</span><br/>

                <MyNotif 
                    contractAddress={this.props.state.ledgerContract._address}
                    errorMessage={this.state.errorMessage}    
                />

                <form>
                    <div className="form-label">
                        <label>
                            Nom du legislator
                        </label>
                        <input type="text" 
                            name="_description" 
                            className="form-detail" 
                            placeholder="Nom du legislator"
                            value={this.state._description}
                            onChange={this.handleInputChange}
                        />
                    </div>

                    <div className="form-label">
                        <label>
                            Addresse ETH du legislator
                        </label>
                        <input type="text" 
                            name="_legislatorAddress" 
                            className="form-detail" 
                            placeholder="Addresse ETH du legislator"
                            value={this.state._legislatorAddress}
                            onChange={this.handleInputChange}
                        />
                    </div>

                    <div className="form-label">
                        <label>
                            Numéro de siret
                        </label>
                        <input type="text" 
                            name="_siretNumber" 
                            className="form-detail" 
                            placeholder="Numéro du Siret du legislator"
                            value={this.state._siretNumber}
                            onChange={this.handleInputChange}
                        />
                    </div>

                    <button type="button" className="form-cta" 
                        onClick= { () => this.addElement() }>Save
                    </button> 
    
                </form>

            </div>
        );      
    }
}