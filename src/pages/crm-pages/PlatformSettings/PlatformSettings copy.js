import React from 'react';
import { Container, Card, CardBody, Form, FormGroup, Label, Input } from 'reactstrap';


function App() {
 

  return (
      <Container>
        <div >
          <button>
            <i className="ri-arrow-left-s-line"></i>
          </button>
          <h1 >Settings</h1>
        </div>

        <section>
          <h2 >Trades</h2>
          
          <Card >
            <CardBody>
              <Form>
                <FormGroup switch className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <Label style={{ color: 'white', margin: 0 }}>1-click trade</Label>
                    <p >Open a trade without confirmation</p>
                  </div>
                  <Input type="switch"  />
                </FormGroup>

                <FormGroup switch className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <Label style={{ color: 'white', margin: 0 }}>1-click closing</Label>
                    <p >Close and sell the trade without confirmation</p>
                  </div>
                  <Input type="switch"  />
                </FormGroup>

                <FormGroup switch className="d-flex justify-content-between align-items-center">
                  <div>
                    <Label style={{ color: 'white', margin: 0 }}>Orders</Label>
                    <p >Show the order editor on the trade panel</p>
                  </div>
                  <Input type="switch"  defaultChecked />
                </FormGroup>
              </Form>
            </CardBody>
          </Card>
        </section>

        <div ></div>

        <section>
          <h2 >Accounts</h2>
          
          <Card >
            <CardBody>
              <FormGroup switch className="d-flex justify-content-between align-items-center">
                <div>
                  <Label style={{ color: 'white', margin: 0 }}>Hidden balances</Label>
                  <p >Hide your balances by flipping your phone</p>
                  <a >Learn More</a>
                </div>
                <Input type="switch"  />
              </FormGroup>
            </CardBody>
          </Card>
        </section>

        <div ></div>

        <section>
          <h2 >Chart</h2>
          
          <Card >
            <CardBody>
              <Form>
                <FormGroup switch className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <Label style={{ color: 'white', margin: 0 }}>Profit line</Label>
                    <p >Show the potential profit on the chart</p>
                  </div>
                  <Input type="switch"  />
                </FormGroup>

                <FormGroup switch className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <Label style={{ color: 'white', margin: 0 }}>Strike prices</Label>
                    <p >Show strike prices on the chart</p>
                  </div>
                  <Input type="switch"  />
                </FormGroup>

                <FormGroup switch className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <Label style={{ color: 'white', margin: 0 }}>Types of charts icon</Label>
                    <p >Show a switch between chart types</p>
                  </div>
                  <Input type="switch"  defaultChecked />
                </FormGroup>

                <FormGroup switch className="d-flex justify-content-between align-items-center">
                  <div>
                    <Label style={{ color: 'white', margin: 0 }}>Technical analysis</Label>
                    <p >Set up the indicators and oscillators for each asset</p>
                  </div>
                  <Input type="switch"  />
                </FormGroup>
              </Form>
            </CardBody>
          </Card>
        </section>
      </Container>
  );
}

export default App;