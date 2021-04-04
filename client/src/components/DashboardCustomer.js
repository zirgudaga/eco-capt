import React from 'react';

export default class DashboardCustomer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            notice: ''
        };
    }

    /*
    if(!this.props.state.isOwner) {
    contractSessionId = parseInt(await contract.methods.sessionId().call(), 10);




*/

    // addService = async (idToVote) => {
    //     const { accounts, contract, web3 } = this.props.state;
    //     await contract.methods.addVote(idToVote).send({ from: accounts[0] },
    //         async (erreur, tx) => {
    //             if(tx){
    //                 await web3.eth.getTransactionReceipt(tx, 
    //                     async (erreur, receipt) => {
    //                         if(receipt!=null && receipt.status){
    //                             this.setState({notice: 'Vote enregistré'});
    //                             setTimeout(() => this.setState({notice: ''}), 5000);
    //                         }
    //                     }
    //                 )
    //             }
    //         }
    //     );  
    // };

    getService = async (serviceId) => {
        const { contract } = this.props.state;
        let objService = await contract.methods.getService(serviceId).call();
        console.log(objService);
    };    

    getMeasures = async (serviceId) => {
        const { contract } = this.props.state;
        let objMeasures = await contract.methods.getMeasures(serviceId).call();
        console.log(objMeasures);
    };     


    initTestSet = async () => {
        const { accounts, contract, web3 } = this.props.state;
        await contract.methods.initTestSet().send({ from: accounts[0] },
            async (erreur, tx) => {
                if(tx){
                    await web3.eth.getTransactionReceipt(tx, 
                        async (erreur, receipt) => {
                            if(receipt!=null && receipt.status){
                                console.log("Client OK ! ");
                            }
                        }
                    )
                }
            }
        );  
    };    


    render() {
        return (
            <section className="w-full p-4">
                <div className="w-full h-64 border-dashed border-4 p-4 text-md" >Init Client</div>

                <input type="button" className="btn btn-success ml-2" value="INIT CLIENT" onClick= { () => this.initTestSet() }></input>

                <input type="button" className="btn btn-success ml-2" value="GET SERVICE" onClick= { () => this.getService(0) }></input>

                <input type="button" className="btn btn-success ml-2" value="GET MEASURE" onClick= { () => this.getMeasures(0) }></input>

            </section>
        )
    }
}