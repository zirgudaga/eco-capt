import React from 'react';
import './MainMeasure.css';
import {hexToString} from '../../utilsEco.js';
import HomeMeasure from '../elements/measures/HomeMeasure.js';
import FocusMeasure from '../elements/measures/FocusMeasure.js';
import ListMeasure from '../elements/measures/ListMeasure.js';
import FormMeasure from '../elements/measures/FormMeasure.js';

export default class MainMeasure extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            listElements: [],
            selectedElement: -1,
            elementToUpdate: null,
            isNew: false,
            currentMainSelect: "Home",
            errorMessage: '',
        };
    }

    componentDidMount = () => {
        setInterval(()=>{
            this.refresh();
        }, 2000);
    }

    refresh = () => {
        this.getAllElement();
    }

    getAllElement = async () => {
        const { ledgerContract, accounts } = this.props.state;

        if(ledgerContract != null){
            let { listElements } = this.state;

            ledgerContract.getPastEvents('TypeMeasureUpdate', { fromBlock: 0,  toBlock: 'latest'}, function(error, events){ })
            .then(async (myEvents) => {
                let index=0;
                let _codeMeasure = '';
                for(let myEvent of myEvents){
                    if(myEvent.returnValues['_message'] == "New TypeMeasure"){   
                        _codeMeasure = myEvent.returnValues['_target'];
                        listElements[index] = await ledgerContract.methods._typeMeasures(_codeMeasure).call({from:accounts[0]});
                        listElements[index].measureId = index;
                        listElements[index].codeMeasure = hexToString(_codeMeasure.substr(-16));
                        index ++;
                    }       
                }
                this.setState({ listElements });  
            });
        }        
    };    

    selectedMainLauncher = () => {

        switch(this.state.currentMainSelect){
            case "Home" : return (<HomeMeasure state={this.props.state}/>);
            
            case "Focus" : return (<FocusMeasure  
                state={this.props.state}
                myElement={this.state.listElements[this.state.selectedElement]} 
                goContract = {(addr) => {this.props.goContract(addr);}}
                addElement= {() => {this.showFormAddElement(true, false);}}
            />);

            case "New" : return (<FormMeasure  
                state={this.props.state}
                elementToUpdate={this.state.elementToUpdate}
                isNew={this.state.isNew}
                close={()=>{this.showFormAddElement(false, false)}}
            />);
            
            default: return (<HomeMeasure state={this.props.state}/>);
        }
    }

    showFormAddElement = (isOpen, isNew) => {
        let elementToUpdate=null;
        
        if(isOpen){
            if(this.state.selectedElement > -1){
                elementToUpdate=this.state.listElements[this.state.selectedElement];
            }

            this.setState({ currentMainSelect: "New", isNew: isNew, elementToUpdate: elementToUpdate});
            return;
        }

        if(this.state.selectedElement > -1){
            this.setState({ currentMainSelect : "Focus" });
        }else{
            this.setState({ currentMainSelect : "Home" });
        }
    }

    showFocusElement = (index) => {
        this.setState({ selectedElement: index, currentMainSelect : "Focus" });
    }

    render() {
        return (
            <div className="main-content">
                <main className="main-content wrap">     
                    {this.selectedMainLauncher()}  
                    <ListMeasure  
                        state={this.state}
                        addElement= {() => {this.showFormAddElement(true, true);}}
                        setElementFocus = {(index) => {this.showFocusElement(index);}}
                    />
                </main>
            </div>
        );
    }
}
