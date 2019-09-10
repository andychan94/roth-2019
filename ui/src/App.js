import React, { Component } from "react";
import "./App.css";
import {Button, Col, Container, Form, Row} from "react-bootstrap";

class App extends Component {
    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <Form>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Control type="name" placeholder="name..." />
                                <Form.Text className="text-muted">
                                    We'll never share your name with anyone else.
                                </Form.Text>
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default App;
