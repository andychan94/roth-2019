import React, {Component} from "react";
import "./App.css";
import {Col, Container, Row} from "react-bootstrap";
import ButtonComponent from "./ButtonComponent";
import QuestionComponent from "./QuestionComponent";
import gql from "graphql-tag";
import {Query} from "react-apollo";

class QuizPage extends Component {
    constructor(props) {
        super(props);
        this.array = [];
        this.state = {
            currentLevel: "N1",
            isAnswered: false,
            data: null,
            quize: null,
            isClicked: false,
            score: 0
        }
    }

    updateScore = (isCorrect, points) => {
        if (isCorrect) {
            this.setState({
                score: this.state.score + points
            })
        }
    }

    render() {
        return (
            <Container className="h-100">
                {this.state.score}
                <Row className="align-items-center h-100 justify-content-center">
                    <Col md={6}>
                    <QuestionComponent updateScore={this.updateScore}></QuestionComponent>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default QuizPage;
