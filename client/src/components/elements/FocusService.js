import React from 'react';

import "./FocusService.css";

export default class FocusService extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            listMeasures: [],
        };        
    }

    componentDidMount = () => {
        setInterval(()=>{
            this.refresh();
        }, 1000);
    }

    refresh = () => {
        this.setServiceFocus(this.props.myService.serviceId);
    }

    
    setServiceFocus = async (serviceId) => {
        let { contract } = this.props.state;
        let { selectedService, listMeasures } = this.state;
        selectedService = serviceId;
        listMeasures = await contract.methods.getAllMeasures(serviceId).call();
        this.setState({ listMeasures });  
    };   
    
    showMeasure = () => {
        if ((this.state.listMeasures[0] !== undefined) && (this.state.listMeasures[0].length>0)){
            return (
                this.state.listMeasures[0].map((measure, index) => (
                    <div className="" key={"measureKey"+index}>{measure}</div>       
                ))
            );
        }
    }
    
    render() {
        return (
            <div className="focus-service-body">
                SERVICE FOCUS - {this.props.myService.description}

                {this.showMeasure()}

            </div>
        );      
    }
}