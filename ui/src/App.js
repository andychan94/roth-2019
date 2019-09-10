import React, { Component } from "react";
import "./App.css";
import { Button, Col, Container, Form, Row } from "react-bootstrap";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ""
    };
    this.handleChange = this.handleChange.bind(this);
    //this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ name: event.target.value });
    console.log(this.state);
  }
  /*
  handleSubmit(event) {
    this.setState({name: event.target.value});
    console.log(this.state);
  }
*/
  render() {
    return (
      <Container className="h-100">
        <Row className="align-items-center h-100 justify-content-center">
          <Col md={6}>
            <h1 className="text-light font-weight-bold text-center">Fun字</h1>
            <Form className="text-center" onSubmit={this.handleSubmit}>
              <Form.Group controlId="formBasicEmail">
                <Form.Control
                  type="name"
                  placeholder="name..."
                  value={this.state.name}
                  onChange={this.handleChange}
                />
              </Form.Group>
              <Button variant="primary" type="submit" value="Submit">
                Start!
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
