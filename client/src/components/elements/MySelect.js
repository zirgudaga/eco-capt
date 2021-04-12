import React from 'react';

import {getTabtSelect} from '../../utilsEco.js';

import "./MySelect.css";

export default class MySelect extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            myValue: 'Select',
            myTabOptions: [],
            classSelector: "select",
            isOpen: false,
        };
    }

    componentDidMount = () => {
        let myTabOptions = [];
        myTabOptions = getTabtSelect(this.props.myName);
        this.setState({ myTabOptions });       
    }

    clickSelector() {
        let { classSelector, isOpen } = this.state;
        
        if(!isOpen){
            classSelector = "select is-open"     
        }else{
            classSelector = "select"
        }
        isOpen = !isOpen;

        this.setState({classSelector, isOpen});
    }
    
    selectValue(index) {
        let { myValue, classSelector, myTabOptions, isOpen } = this.state;

        myValue = myTabOptions[index].aff;
        classSelector = "select";
        isOpen = false;

        this.props.handleMySelect(this.props.myName, myTabOptions[index].code);

        this.setState({myValue, classSelector, myTabOptions, isOpen});
    }

    render() {
        let { myValue, classSelector } = this.state;

        return (
            <div className={classSelector}>
                <span className="placeholder" onClick={()=>{this.clickSelector();}}>{myValue}</span>
                <ul>
                    {
                        this.state.myTabOptions.map((myOption, index) => (
                            <li key={"select_"+index} onClick={()=>{this.selectValue(index);}}>{myOption.aff}</li>       
                        ))
                    }
                </ul>
            </div>
        )
    }
}

/*
$('.select').on('click','.placeholder',function(){
    let parent = $(this).closest('.select');
    if ( ! parent.hasClass('is-open')){
      parent.addClass('is-open');
      $('.select.is-open').not(parent).removeClass('is-open');
    }else{
      parent.removeClass('is-open');
    }
  }).on('click','ul>li',function(){
    $('.select ul>li').removeClass('selected');
    $(this).addClass('selected');
    let parent = $(this).closest('.select');
    parent.removeClass('is-open').find('.placeholder').text( $(this).text() );
  });
*/


/*
           <select value={this.state.myValue}>
                <option id="select-option" value="">Select</option>
                {this.state.myTabOptions.map((myOption, index) => (
                    <option key={"select_"+myOption.index}>{myOption.aff}</option>       
                ))}
            </select>
            */