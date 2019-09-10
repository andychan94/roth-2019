import React, {Component} from "react";
import "./App.css";
import {withRouter} from "react-router-dom";
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
    }

    handleClick() {
        console.log(this.state.name);
        this.props.history.push({
            pathname: "/quiz",
            state: {name: this.state.name}
        });
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
                                <Form.Control type="text" placeholder="name..." name="user-name" value={this.state.name} onChange={this.handleChange} />
                            </Form.Group>
                            <Button variant="primary" type="button" onClick={this.handleClick}>
                                Start!
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default withRouter(NameInputPage);
