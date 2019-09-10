import React, { Component } from "react";
import "./App.css";
import {Col, Container, Row} from "react-bootstrap";

class QuizPage extends Component {
    render() {
        console.log(this.props.location.state.name);
        return (
            <Container className="h-100">
                <Row className="align-items-center h-100 justify-content-center">
                    <Col md={6}>
                        <h1 className="text-light font-weight-bold text-center">
                            Fun字
                        </h1>
                        <p className="text-light">Hello, {this.props.location.state.name}</p>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default QuizPage;
