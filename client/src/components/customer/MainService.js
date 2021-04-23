import React from 'react';
import './MainService.css';

import HomeService from '../elements/services/HomeService.js';
import FocusService from '../elements/services/FocusService.js';
import ListService from '../elements/services/ListService.js';
import FormService from '../elements/services/FormService.js';

export default class MainService extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            listServices: [],
            isAddable: false,            
            selectedService: -1,
            currentMainSelect: "Home",
            errorMessage: '',
        };
    }

    componentDidMount = () => {
        let { isAddable } = this.state;
        const { myTypeUser } = this.props.state;


        if ((myTypeUser === '1') || (myTypeUser === '2')){
            isAddable = true;
            this.setState({ isAddable });  
        }

        setInterval(()=>{
            this.refresh();
        }, 2000);
    }

    refresh = () => {
        this.getAllServices();
    }

    getAllServices = async () => {
        const { customerContract, accounts } = this.props.state;

        if(customerContract != null){
            let { listServices } = this.state;

            customerContract.getPastEvents('ServiceUpdate', { fromBlock: 0,  toBlock: 'latest'}, function(error, events){ })
            .then(async (myEvents) => {
                let index;
                for(let myEvent of myEvents){
                    if(myEvent.returnValues['_message'] == "New service"){
                        index = myEvent.returnValues['_serviceId'];
                        listServices[index] = await customerContract.methods._services(index).call({from:accounts[0]});
                        listServices[index].serviceId = index;
                    }       
                }
                this.setState({ listServices });  
            });
        }        
    };    

    selectedMainLauncher = () => {

        switch(this.state.currentMainSelect){
            case "Home" : return (<HomeService state={this.props.state}/>);
            case "FocusService" : return (<FocusService 
                state={this.props.state}
                myService={this.state.listServices[this.state.selectedService]} 
            />);
            case "NewService" : return (<FormService 
                state={this.props.state} 
                close={()=>{this.showFormAddService(false)}}
            />);
            
            default: return (<HomeService state={this.props.state}/>);
        }
    }

    showFormAddService = (isOpen) => {
        if(isOpen){
            this.setState({ currentMainSelect: "NewService" });
            return;
        }

        if(this.state.selectedService > -1){
            this.setState({ currentMainSelect : "FocusService" });
        }else{
            this.setState({ currentMainSelect : "Home" });
        }
    }

    showFocusService = (index) => {
        this.setState({ selectedService: index, currentMainSelect : "FocusService" });
    }

    render() {
        return (
            <div className="main-content">
                <main className="service-main-content wrap">     
                    {this.selectedMainLauncher()}  
                    <ListService 
                        state={this.state}
                        addService= {() => {this.showFormAddService(true);}}
                        setServiceFocus = {(index) => {this.showFocusService(index);}}
                    />
                </main>
            </div>
        );
    }
}
