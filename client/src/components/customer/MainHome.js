import React from 'react';
import './MainHome.css';

export default class MainHome extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ecpAmount: 0,
            intervalRefresh: null,
        };
    }

    componentDidMount = () => {
        let {intervalRefresh} = this.state;

        intervalRefresh = setInterval(()=>{
            this.refresh();
        }, 2000);

        this.setState({ intervalRefresh });  
    }

    refresh = () => {
        if(this.props.state.myTypeUser === '2'){
            this.getECPAmount();
        }
    }

    componentWillUnmount= () => {
        let {intervalRefresh} = this.state;
        clearInterval(intervalRefresh);    
        this.setState({ intervalRefresh });  
    }

    getECPAmount = async () => {
        let { ecpAmount } = this.state;
        const { ecpTokenContract, accounts, customerContractAddress } = this.props.state;

        ecpAmount = await ecpTokenContract.methods.balanceOf(customerContractAddress).call({from:accounts[0]});
        
        this.setState({ ecpAmount });  
    }

    showAddress = () => {      
        if(this.props.state.accounts !== null){
            return this.props.state.accounts[0];
        } 
        else{
            return 'Waiting';
        }       
    }

    showEcpTokenAddress = () => {      
        if(this.props.state.ecpTokenAddress !== null){
            return this.props.state.ecpTokenAddress;
        } 
        else{
            return 'Waiting';
        }       
    }

    render() {
        return (
            <div className="main-content">
                <main className="main-client">
                    <div className="page-header">
                        <div className="page-header-body">
                            <h1 className="page-header-title">Welcome to your Eco-Capt interface</h1>
                            <p className="page-header-address">You are currently connected with the following address : <span className="address-color">{this.showAddress()}</span></p>
                            <p className="page-header-address">The address of the ERC-20 ECP is : <span className="address-color">{this.showEcpTokenAddress()}</span></p>
                            
                            {this.props.state.customerContractAddress
                            ?(<p className="page-header-contract">Your smart contract is   : <span className="address-color">{this.props.state.customerContractAddress}</span></p>)
                            :(<p className="page-header-contract">No customer contract selected...</p>)}
                            
                            {this.props.state.myTypeUser==='1'
                            &&
                            <div>
                                <img className="welcome-navbar-ecp" src="./ECP.png" alt="ecp-token" />
                                <p>{this.props.state.ledgerSafe} ECP</p>
                                <br/>
                                <br/>
                            </div>}

                            {this.props.state.myTypeUser==='2'
                            &&
                                <div>
                                    <p className="page-header-address">Your current balance is : </p>
                                    <img className="welcome-navbar-ecp" src="./ECP.png" alt="ecp-token" />
                                    <p>{this.state.ecpAmount} ECP</p>
                                    <br/>
                                    <br/>
                                </div>
                            }
                            {this.props.state.customerContractAddress &&
                            <div>
                                <p>To access your services, click on the button below :</p>
                                <div className="page-header-cta" onClick = { () => {this.props.goTo("Services");} }>
                                    Services
                                </div>
                            </div>}
                            <p className="page-header-help">A question ? Contact us !</p>
                        </div>
                    </div>
                </main>
            </div>
        );
    }
}
