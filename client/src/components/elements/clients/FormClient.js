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
            _description: '',
            _customerAddress: '',
            _siretNumber: '',
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentDidMount = () => {
        let { isNew, elementToUpdate } = this.props;

        if(isNew == false){
            let { _description, _customerAddress, _contractAddress, _siretNumber } = this.props;
    
            _description = elementToUpdate.description;
            _customerAddress = elementToUpdate.customerAddress;
            _contractAddress = elementToUpdate.contractAddress;
            _siretNumber = elementToUpdate.siretNumber;        

            this.setState({ _description, _customerAddress, _contractAddress, _siretNumber });  
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
    
    addElt = async () => {
        let { errorMessage, _description, _customerAddress, _contractAddress, _siretNumber } = this.state;

        let context = this;

        if(
            _description.trim() === '' ||
            _customerAddress.trim() === '' ||
            _contractAddress.trim() === '' ||
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
        await ledgerContract.methods.setCustomer(
            _description.trim(),
            _customerAddress.trim(),
            _contractAddress.trim(),            
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
                            Nom du client
                        </label>
                        <input type="text" 
                            name="_description" 
                            className="form-detail" 
                            placeholder="Nom du client"
                            value={this.state._description}
                            onChange={this.handleInputChange}
                        />
                    </div>

                    <div className="form-label">
                        <label>
                            Addresse ETH du client
                        </label>
                        <input type="text" 
                            name="_customerAddress" 
                            className="form-detail" 
                            placeholder="Addresse ETH du client"
                            value={this.state._customerAddress}
                            onChange={this.handleInputChange}
                        />
                    </div>

                    <div className="form-label">
                        <label>
                        Addresse ETH du contrat
                        </label>
                        <input type="text" 
                            name="_contractAddress" 
                            className="form-detail" 
                            placeholder="Addresse ETH du contrat"
                            value={this.state._contractAddress}
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
                            placeholder="Numéro du Siret du client"
                            value={this.state._siretNumber}
                            onChange={this.handleInputChange}
                        />
                    </div>
                    {(this.props.state.myTypeUser==='1') &&
                        <button type="button" className="form-cta" 
                            onClick= { () => this.addElt() }>Save
                        </button> 
                    }
                </form>

            </div>
        );      
    }
}