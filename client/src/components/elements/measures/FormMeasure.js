import React from 'react';
import "./FormMeasure.css";
import MyNotif from '../MyNotif.js';

export default class FormMeasure extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            errorMessage: '',
            _description: '',
            _measureAddress: '',
            _siretNumber: '',
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentDidMount = () => {
        let { isNew, elementToUpdate } = this.props;

        console.log(elementToUpdate);

        if(isNew == false){
            let { _description, _measureAddress, _contractAddress, _siretNumber } = this.props;
    
            _description = elementToUpdate.description;
            _measureAddress = elementToUpdate.measureAddress;
            _contractAddress = elementToUpdate.contractAddress;
            _siretNumber = elementToUpdate.siretNumber;        

            this.setState({ _description, _measureAddress, _contractAddress, _siretNumber });  
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
        let { errorMessage, _description, _measureAddress, _contractAddress, _siretNumber } = this.state;

        let context = this;

        if(
            _description.trim() === '' ||
            _measureAddress.trim() === '' ||
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
        await ledgerContract.methods.setMeasure(
            _description.trim(),
            _measureAddress.trim(),
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
                            Nom de la measure
                        </label>
                        <input type="text" 
                            name="_description" 
                            className="form-detail" 
                            placeholder="Nom de la measure"
                            value={this.state._description}
                            onChange={this.handleInputChange}
                        />
                    </div>

                    <div className="form-label">
                        <label>
                            Addresse ETH de la measure
                        </label>
                        <input type="text" 
                            name="_measureAddress" 
                            className="form-detail" 
                            placeholder="Addresse ETH du measure"
                            value={this.state._measureAddress}
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
                            placeholder="Numéro du Siret de la measure"
                            value={this.state._siretNumber}
                            onChange={this.handleInputChange}
                        />
                    </div>

                    <button type="button" className="form-cta" 
                        onClick= { () => this.addElt() }>Save
                    </button> 
    
                </form>

            </div>
        );      
    }
}