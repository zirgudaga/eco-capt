import React from 'react';
import "./Footer.css";

export default class Footer extends React.Component {

    render() {
        return ( 
            <footer className="footer-flex">
              <div className="footer-wrap">
                <nav>
                  <ul className="footer-ul">
                    <li className="footer-list">about</li>
                    <li className="footer-list">contact us</li>
                    <li className="footer-list">Privacy policy</li>
                  </ul>
                </nav>
              </div>
            </footer>
        );
    }
}

                                    