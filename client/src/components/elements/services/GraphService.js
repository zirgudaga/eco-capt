import * as React from "react";
import { Chart } from "react-google-charts";

import {measureToObject, hexToString} from '../../../utilsEco.js';

import "./GraphService.css";

export default class GraphService extends React.Component {

    myData = () => {
        let { myMeasures } = this.props;

        let myReturn = [];
        let body;
        if ((myMeasures !== undefined) && (myMeasures.length>0)){
            myReturn.push(['x', 'Valeur moyenne'])
            for(let i=0; i<myMeasures.length; i++){
                [, body] = measureToObject(myMeasures[i].header, myMeasures[i].body);
                myReturn.push([i, body.val2]);
            }
        }

        return myReturn;
    }

    render() {

        let { myService, myMeasures } = this.props;

        return (
            <div className="card-graph">
                {((myMeasures !== undefined) && (myMeasures.length>0))
                ?
                <Chart
                    width={'600px'}
                    height={'400px'}
                    chartType="LineChart"
                    loader={<div>Loading Chart</div>}
                    data={this.myData()}
                    options={{
                        hAxis: {
                            title: 'Time',
                        },
                        vAxis: {
                            title: hexToString(myService.measureType),
                        },
                        series: {
                            0: { curveType: 'function' },
                        },
                    }}
                    rootProps={{ 'data-testid': '1' }}
                />
                : "Data waiting..."
                }
            </div>
        );
    }
}
