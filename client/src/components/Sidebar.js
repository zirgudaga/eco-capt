import React from 'react'
import './Sidebar.css';

function Sidebar() {
  return (
    <aside className="">

      <input type="checkbox" name="" id="sidebar-toggle" />

      <div className="sidebar">
        <div className="sidebar-brand">
            <div className="brand-flex">
              <img src="logo.png" width="40px" alt="" />
              <div className="brand-icons">
                <span className="las la-bell"></span>
                <span className="las la-user-circle"></span>
              </div>
          </div>
        </div>
      <div className="sidebar-main">
        <div className="sidebar-user">
          <img src="2.jpg" alt="" />
          <div>
            <h3>Brand or User Name</h3>
            <span>hash adresse Metamask</span>
          </div>
        </div>
        <div className="sidebar-menu">
          <div className="menu-head">
            <span>Dashboard</span>
          </div>
          <ul>
            <li>
              <a href=".">
                <span className="las la-balance-scale"></span>
                Type de données 1
              </a>
            </li>
            <li>
              <a href=".">
                <span className="las la-chart-pie"></span>
                Type de données 2
              </a>
            </li>
          </ul>
          <div className="menu-head">
            <span>Applications</span>
          </div>
            <ul>
              <li>
                <a href=".">
                  <span className="las la-calendar"></span>
                  Calendar
                </a>
              </li>
              <li>
                <a href=".">
                  <span className="las la-users"></span>
                  Contacts
                </a>
              </li>
              <li>
                <a href=".">
                  <span className="las la-envelope"></span>
                  Mailbox
                </a>
              </li>
              <li>
                <a href=".">
                 <span className="las la-check-circle"></span>
                Todo
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;