import React from 'react';
import './DashboardClientMain.css';
import './DashboardClientMainService.css'

import HomeService from '../elements/HomeService.js';
import FocusService from '../elements/FocusService.js';
import ListService from '../elements/ListService.js';
import FormService from '../elements/FormService.js';


export default class DashboardClientMainService extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            listServices: [],
            selectedService: -1,
            currentMainSelect: "Home",
            errorMessage: '',
        };
    }

    componentDidMount = () => {
        setInterval(()=>{
            this.refresh();
        }, 1000);
    }

    refresh = () => {
        this.getAllServices();
    }

    getAllServices = async () => {
        const { contract } = this.props.state;
        if(contract != null){
            let { listServices } = this.state;
            listServices = await contract.methods.getAllServices().call();
            for(let index in listServices){
                listServices[index].serviceId = index;
            }
            this.setState({ listServices });  
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
            <div className="">
                <div className="main-content">
                    <header>
                        <div className="menu-toggle">
                            <label className="sidebar-toggle">
                                <span className="las la-bars"></span>
                            </label>
                        </div>

                        <div className="header-icons">
                            <span className="las la-search" onClick={()=>{this.refresh();}}></span>
                            <span className="las la-bookmark"></span>
                            <span className="las la-sms"></span>
                        </div>
                    </header>

                    <main className="service-main-content">     
                        {this.selectedMainLauncher()}  
                        <ListService 
                            state={this.state}
                            addService= {() => {this.showFormAddService(true);}}
                            setServiceFocus = {(index) => {this.showFocusService(index);}}
                        />
                    </main>
                </div>
            </div>
        );
    }
}
