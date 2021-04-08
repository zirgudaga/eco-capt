import React from 'react'
import './EcoMain.css';

function Main() {
  return (
    <div className="">
      <div className="main-content">
        <header>
          <div className="menu-toggle">
            <label for="sidebar-toggle">
              <span className="las la-bars"></span>
            </label>
          </div>

          <div className="header-icons">
            <span className="las la-search"></span>
            <span className="las la-bookmark"></span>
            <span className="las la-sms"></span>
          </div>
        </header>

        <main>
          <div className="page-header">
            <div>
              <h1>EcoCapt Dashboard</h1>
              <small>Monitor key mectrics. Check your data blabla</small>
            </div>

            <div className="header-actions">
              <button>
                <span className="las la-file-export"></span>
                Export
              </button>
              <button>
                <span className="las la-tools"></span>
                Settings
              </button>
            </div>
          </div>
          
          <div className="cards">
            <div className="card-single">
              <div className="card-flex">
                <div className="card-info">
                  <div className="card-head">
                    <span>Data</span>
                    <small>Number of Data</small>
                  </div>
                  <h2>13,423</h2>
                  <small>25% du quota</small>
                </div>
                <div className="card-chart success">
                  <span className="las la-chart-line"></span>
                </div>
              </div>
              </div>
              <div className="card-single">
                <div className="card-flex">
                  <div className="card-info">
                    <div className="card-head">
                      <span>Data 3</span>
                      <small>Number of Data 3</small>
                    </div>
                    <h2>6,345</h2>
                    <small>5% du quota</small>
                  </div>
                  <div className="card-chart orange">
                    <span className="las la-chart-line"></span>
                  </div>
                </div>
              </div>
              <div className="card-single">
                <div className="card-flex">
                  <div className="card-info">
                    <div className="card-head">
                      <span>Data 2</span>
                      <small>Number of Data 2</small>
                    </div>
                    <h2>42,456</h2>
                    <small>75% du quota</small>
                  </div>
                  <div className="card-chart danger">
                    <span className="las la-chart-line"></span>
                  </div>
                </div>
              </div>
            </div>

            <div className="alert-grid">
              <div className="analytics-card">
                <div className="analytics-head">
                  <h3>Actions needed</h3>
                  <span className="las la-ellipsis-h"></span>
                </div>
                <div className="anaytics-chart">
                  <div className="chart-circle">
                    <h1>74%</h1>
                  </div>
                </div>
                <div className="analytics-btn">
                  <button>Generate report</button>
                </div>
              </div>
              <div className="alerts">
                <h2>Mon contrat <small>voir tous mes services <span className="las la-arrow-right"></span></small></h2>
                <div className="table-responsive">
                  <table width="100%">
                    <tr>
                      <td>
                        <span className="indicator"></span>
                      </td>
                      <td>
                        <div>
                          Nombre de relevés
                        </div>
                      </td>
                      <td>
                        <div>
                          Nombre de relevés
                        </div>
                      </td>
                      <td>
                        <div>
                          <button>Demander un relevé</button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span className="indicator"></span>
                      </td>
                      <td>
                        <div>
                          Nombre de relevés
                        </div>
                      </td>
                      <td>
                        <div>
                          Nombre de relevés
                        </div>
                      </td>
                      <td>
                        <div>
                          <button>Demander un relevé</button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span className="indicator"></span>
                      </td>
                      <td>
                        <div>
                          Nombre de relevés
                        </div>
                      </td>
                      <td>
                        <div>
                          Nombre de relevés
                        </div>
                      </td>
                      <td>
                        <div>
                          <button>Demander un relevé</button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span className="indicator"></span>
                      </td>
                      <td>
                        <div>
                          Nombre de relevés
                        </div>
                      </td>
                      <td>
                        <div>
                          Nombre de relevés
                        </div>
                      </td>
                      <td>
                        <div>
                          <button>Demander un relevé</button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span className="indicator"></span>
                      </td>
                      <td>
                        <div>
                          Nombre de relevés
                        </div>
                      </td>
                      <td>
                        <div>
                          Nombre de relevés
                        </div>
                      </td>
                      <td>
                        <div>
                          <button>Demander un relevé</button>
                        </div>
                      </td>
                    </tr>
                  </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Main;