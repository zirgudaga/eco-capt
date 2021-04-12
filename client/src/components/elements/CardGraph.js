import * as React from "react";
import { render } from "react-dom";
import { Chart } from "react-google-charts";

import "./CardGraph.css";

export default class CardGraph extends React.Component {

/*
[
                        ['x', 'Soufre'],
                        [0, 0],
                        [1, 10],
                        [2, 23],
                        [3, 17],
                        [4, 18],
                        [5, 9],
                        [6, 11],
                        [7, 27],
                        [8, 33],
                        [9, 40],
                        [10, 32],
                        [11, 35],
                        ]*/


    myData = () => {
        let { myService, myMeasures } = this.props;

        let nbMeasures = myService.measureIdCounter['_value'];
        let myReturn = [];

        if(nbMeasure>0){
            myReturn.push([])
            for(let i=0; i<nbMeasures; i++){




            }
        }

        return myReturn;
    }

    render() {

        let { myService, myMeasures } = this.props;

        return (
          <div className="card-graph">
            <Chart
            width={'600px'}
            height={'400px'}
            chartType="LineChart"
            loader={<div>Loading Chart</div>}
            data={[
              ['x', 'Soufre'],
              [0, 0],
              [1, 10],
              [2, 23],
              [3, 17],
              [4, 18],
              [5, 9],
              [6, 11],
              [7, 27],
              [8, 33],
              [9, 40],
              [10, 32],
              [11, 35],
            ]}
            options={{
              hAxis: {
                title: 'Time',
              },
              vAxis: {
                title: 'Popularity',
              },
            }}
            rootProps={{ 'data-testid': '1' }}
          />
        </div>
        );
    }
}
