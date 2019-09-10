import React, {Component} from "react";
import "./App.css";
import {Button, Col, Container, Form, Row} from "react-bootstrap";

class NameInputPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleChange(event) {
        this.setState({name: event.target.value});
        console.log(this.state);
    }
    handleClick() {
        this.props.history.push('/quiz')
    }
    
    render() {
        return (
            <Container className="h-100">
                <Row className="align-items-center h-100 justify-content-center">
                    <Col md={6}>
                        <h1 className="text-light font-weight-bold text-center">
                            Fun字
                        </h1>
                        <Form className="text-center">
                            <Form.Group controlId="formBasicEmail">
                                <Form.Control type="text" placeholder="name..." name="user-name"/>
                            </Form.Group>
                            <Button variant="primary" type="submit" onClick={this.handleClick}>
                                Start!
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default NameInputPage;
