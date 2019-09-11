import React, {Component} from "react";
import "./App.css";
// import {withRouter} from "react-router-dom";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import gql from "graphql-tag";
import { compose, graphql } from 'react-apollo'

const REGISTER_USER = gql`
mutation User($userName: String!, $userScore: Int) {
  CreateUser(name: $userName, score: $userScore) {
    id
    score
  }
}`;

class NameInputPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: "",
            userId: "",
            userScore: 0
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleChange(event) {
        this.setState({userName: event.target.value});
    }
    async regUser(name) {
        const { CreateUser } = this.props;
        const result = await CreateUser({ variables: {
            'userName': name,
            'userScore': 0
        } });
        this.setState({userId: result.data.CreateUser.id});
        this.setState({userScore: result.data.CreateUser.score});
        this.handleClick();
    }
    handleClick() {
        this.props.history.push({
            pathname: "/quiz",
            state: {
                userName: this.state.userName,
                userId: this.state.userId,
                userScore: this.state.userScore,
            }
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
                                <Form.Control type="text" placeholder="name..." value={this.state.userName} onChange={this.handleChange} />
                            </Form.Group>
                            <Button variant="primary" type="button" onClick={this.regUser.bind(this,this.state.userName)}>
                                Start!
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default compose(
    graphql(REGISTER_USER, { name: 'CreateUser' })
)(NameInputPage);
