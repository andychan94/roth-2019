import React, { Component } from "react";
import "./App.css";
import {Button, Col, Container, Form, Row} from "react-bootstrap";

class QuizPage extends Component {
    render() {
        return (
            <Container className="h-100">
                <Row className="align-items-center h-100 justify-content-center">
                    <Col md={6}>
                        <h1 className="text-light font-weight-bold text-center">
                            Fun字
                        </h1>
                        <p>Quiz</p>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default NameInputPage;
