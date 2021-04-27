import React from 'react';
import "./FormBridge.css";
import MyNotif from '../MyNotif.js';

export default class FormBridge extends React.Component {
    
        /*
        string memory _description,
        string memory _url, 
        string memory _info,               
        address _bridgeAddress,
        address _techMasterAddress,       
        bool _isActive) 
        */

    constructor(props) {
        super(props);
        this.state = {
            errorMessage: '',
            _description: '',
            _url: '',
            _info: '',
            _bridgeAddress: '',
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentDidMount = () => {
        let { isNew, elementToUpdate } = this.props;

        if(isNew === false){
            let { _description, _url, _info, _bridgeAddress, _techMasterAddress } = this.props;
    
            _description = elementToUpdate.description;
            _url = elementToUpdate.url;
            _info = elementToUpdate.info;
            _bridgeAddress = elementToUpdate.bridgeAddress;    

            this.setState({ _description, _url, _info, _bridgeAddress, _techMasterAddress });  
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
        let { errorMessage, _description, _url, _info, _bridgeAddress } = this.state;

        let context = this;

        if(
            _description.trim() === '' ||
            _url.trim() === '' ||
            _info.trim() === '' ||
            _bridgeAddress.trim() === '' 
        ){
            errorMessage = "Please fill the form properly!";
            this.setState({ errorMessage });

            setTimeout(()=>{
                errorMessage = "";
                this.setState({ errorMessage });
            },2000);

            return ;
        }

        const { accounts, ledgerContract } = this.props.state;
        await ledgerContract.methods.setBridge(
            _description.trim(),
            _url.trim(),
            _info.trim(),
            _bridgeAddress.trim(),
            accounts[0],             
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
                            Bridge's name
                        </label>
                        <input type="text" 
                            name="_description" 
                            className="form-detail" 
                            placeholder="Bridge's name"
                            value={this.state._description}
                            onChange={this.handleInputChange}
                        />
                    </div>

                    <div className="form-label">
                        <label>
                            Bridge's URL
                        </label>
                        <input type="text" 
                            name="_url" 
                            className="form-detail" 
                            placeholder="Bridge's URL"
                            value={this.state._url}
                            onChange={this.handleInputChange}
                        />
                    </div>

                    <div className="form-label">
                        <label>
                            Bridge's Infos
                        </label>
                        <input type="text" 
                            name="_info" 
                            className="form-detail" 
                            placeholder="Bridge's Infos"
                            value={this.state._info}
                            onChange={this.handleInputChange}
                        />
                    </div>

                    <div className="form-label">
                        <label>
                            Bridge's ETH address
                        </label>
                        <input type="text" 
                            name="_bridgeAddress" 
                            className="form-detail" 
                            placeholder="Bridge's ETH address"
                            value={this.state._bridgeAddress}
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