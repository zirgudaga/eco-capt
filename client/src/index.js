import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import CounterReducer from './reducers/CounterReducer';
import AddCartReducer from './reducers/AddCartReducer';

const Store = createStore(AddCartReducer);

ReactDOM.render(
  <Provider store={Store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
