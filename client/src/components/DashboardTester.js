import React from 'react';

export default class DashboardTester extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            listServices: [],
            selectedService: -1,
            listMeasures: [],  
        };
    }

    /*
    if(!this.props.state.isOwner) {
    contractSessionId = parseInt(await contract.methods.sessionId().call(), 10);
    */

    addService = async () => {
        console.log("Add Service ?")

         if(this.newServiceDescription.value.trim() !== ''){
            const { accounts, contract, web3 } = this.props.state;
            await contract.methods.addService(
                "0x0000000000000001",  
                this.newServiceDescription.value.trim(),
                "0x0000000000000001",
                "0x01",
                1            
            ).send({ from: accounts[0] },
                async (erreur, tx) => {
                    if(tx){
                        await web3.eth.getTransactionReceipt(tx, 
                            async (erreur, receipt) => {
                                if(receipt!=null && receipt.status){
                                    console.log("New service added !");
                                }
                            }
                        )
                    }
                }
            );  
        }        
    };

    getServices = async () => {
        console.log("Get Services");
        const { contract } = this.props.state;
        let { listServices } = this.state;
        listServices = await contract.methods.getServices().call();

        console.log(listServices);

        this.setState({ listServices });  
    };    

    getMeasures = async (serviceId) => {
        console.log("Get Services");
        const { contract } = this.props.state;
        let { listMeasures } = this.state;
        listMeasures = await contract.methods.getMeasures(serviceId).call();

        console.log(listMeasures);

        this.setState({ listMeasures });  
    };  

    addMeasure = async (serviceId) => {
        const { accounts, contract, web3 } = this.props.state;

        let context = this;

        await contract.methods.addMeasure(
            serviceId,
            "0x0102030405060708090A0B0C0D0E0F1112131415161718191A1B1C1D1E1F",  
            "0x0102030405060708090A0B0C0D0E0F1112131415161718191A1B1C1D1E1F"
        ).send({ from: accounts[0] },
            async (erreur, tx) => {
                if(tx){
                    await web3.eth.getTransactionReceipt(tx, 
                        async (erreur, receipt) => {
                            if(receipt!=null && receipt.status){
                                console.log("New measure added !");
                                context.setServiceFocus(serviceId);
                            }
                        }
                    )
                }
            }
        );  
    };    

    setServiceFocus = async (serviceId) => {
        console.log("Focus Measure "+serviceId);
        let { contract } = this.props.state;
        let { selectedService, listMeasures } = this.state;
        selectedService = serviceId;
        listMeasures = await contract.methods.getMeasures(serviceId).call();
        this.setState({ contract, selectedService, listMeasures });  
    };     

    render() {
        return (
            <section className="w-full p-4 mt-16">
                <div className="w-full h-200 border-dashed border-4 p-4 text-md" > 
                    <p>SERVICES</p>

                    <form>
                        <p>
                            <label>
                                Description du service
                            </label>
                            <input type="text" id="newServiceDescription" 
                                ref={(input) => { 
                                    this.newServiceDescription = input
                                }}
                            />
                        </p>

                        <p>
                            <label>
                                Version
                            </label>
                            <input type="text" id="newServiceVersion" 
                                ref={(input) => { 
                                    this.newServiceVersion = input
                                }}
                            />
                        </p>
                        
                        <p>
                            <input type="button" className="btn btn-success ml-2" value="NEW SERVICE" onClick= { () => this.addService() } />
                        </p>            
                    </form>

                    <p><input type="button" className="btn btn-success ml-2" value="GET SERVICES" onClick= { () => this.getServices() }></input></p>

                    {this.state.listServices.length > 0 
                        &&
                        this.state.listServices.map((service, index) => (
                            <div className="m-2" key={"serviceKey"+index}><p onClick={ () => this.setServiceFocus(index) }> {service.description} </p> </div>       
                        ))
                    }

                </div>

                {this.state.selectedService !== -1
                    &&
                    <div className="w-full h-64 border-dashed border-4 p-4 text-md" >
                        <p>MEASURES de {this.state.listServices[this.state.selectedService].description}</p> 

                        <p><input type="button" className="btn btn-success ml-2" value="REFRESH MEASURE" onClick= { () => this.getMeasures(this.state.selectedService) }></input></p>

                        <p><input type="button" className="btn btn-success ml-2" value="ADD MEASURE" onClick= { () => this.addMeasure(this.state.selectedService) }></input></p>

                        {this.state.listMeasures[0].length > 0 
                            &&
                            this.state.listMeasures[0].map((measure, index) => (
                                <div className="m-2" key={"measreKey"+index}><p> {measure} </p> </div>       
                            ))
                        }   



                    </div>
                }

            </section>
        )
    }
}