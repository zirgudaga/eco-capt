import * as React from "react";
import { Chart } from "react-google-charts";

import {measureToObject} from '../../../utilsEco.js';

import "./GraphService.css";

export default class GraphService extends React.Component {

    myData = () => {
        let { myMeasures } = this.props;

        let myReturn = [];
        let header, body;
        if ((myMeasures[0] !== undefined) && (myMeasures[0].length>0)){
            myReturn.push(['x', 'Valeur moyenne'])
            for(let i=0; i<myMeasures[0].length; i++){
                [header, body] = measureToObject(myMeasures[0][i], myMeasures[1][i]);
                myReturn.push([i, body.val2]);
            }
        }

        return myReturn;
    }

    render() {

        let { myService, myMeasures } = this.props;

        return (
            <div className="card-graph">
                {((myMeasures[0] !== undefined) && (myMeasures[0].length>0))
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
                            title: myService.measureType,
                        },
                        series: {
                            0: { curveType: 'function' },
                        },
                    }}
                    rootProps={{ 'data-testid': '1' }}
                />
                : "Données en attente"
                }
            </div>
        );
    }
}
