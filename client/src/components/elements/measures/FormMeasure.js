import React from 'react';
import "./FormMeasure.css";
import {stringToHex} from '../../../utilsEco.js';

import MyNotif from '../MyNotif.js';


export default class FormMeasure extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            errorMessage: '',
            _description: '',
            _info: '',
            _codeMeasure: '',
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentDidMount = () => {
        let { isNew, elementToUpdate } = this.props;

        if(isNew == false){
            let { _description, _info, _codeMeasure } = this.props;
    
            _description = elementToUpdate.description;
            _info = elementToUpdate.info;
            _codeMeasure = elementToUpdate.codeMeasure;

            this.setState({ _description, _info, _codeMeasure });  
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
        let { errorMessage, _description, _info, _codeMeasure } = this.state;

        let context = this;

        if(
            _description.trim() === '' ||
            _info.trim() === '' ||
            _codeMeasure.trim() === '' ||
            _codeMeasure.length != 8
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
        await ledgerContract.methods.setTypeMeasure(
            _description.trim(),
            _info.trim(),
            '0x'+stringToHex(_codeMeasure.trim()),
            true,
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
                            Info sur la measure
                        </label>
                        <input type="text" 
                            name="_info" 
                            className="form-detail" 
                            placeholder="Info sur de la measure"
                            value={this.state._info}
                            onChange={this.handleInputChange}
                        />
                    </div>

                    <div className="form-label">
                        <label>
                            Code de la measure
                        </label>
                        <input type="text" 
                            name="_codeMeasure" 
                            className="form-detail" 
                            placeholder="Code de la measure"
                            value={this.state._codeMeasure}
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