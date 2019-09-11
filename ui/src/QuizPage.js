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
            currentLevel: "N5",
            isAnswered: false,
            data: null,
            quize: null,
            isClicked: false,
            score: 0,
            streak: 0
        }
    }

    updateScore = (isCorrect, points) => {
        var newScore = this.state.score + (isCorrect ? points : 0)
        var newStreak = this.state.streak + (isCorrect ? 1 : -1)
        var newLevel = this.state.currentLevel
        
        if (newStreak == 2) {
            newStreak = 0
            newLevel = this.changeLevel(newLevel, 1)
        }
        else if (newStreak == -2) {
            newStreak = 0
            newLevel = this.changeLevel(newLevel, -1)
        } 

        console.log("updateScore", newScore, newStreak, newLevel)
        
        this.setState({
            score: newScore,
            streak: newStreak,
            currentLevel: newLevel
        })
    }

    changeLevel(current, change) {
        const LEVELS = ["N5", "N4", "N3", "N2", "N1"]

        var i = LEVELS.indexOf(current)
        var newI = i + change

        if (newI < 0 )
            newI = 0
        else if (newI == LEVELS.length) {
            newI = LEVELS.length - 1
        }

        return LEVELS[newI]
    }

    render() {
        return (
            <Container className="h-100">
                {this.state.score}
                <Row className="align-items-center h-100 justify-content-center">
                    <Col md={6}>
                    <QuestionComponent updateScore={this.updateScore} level={this.state.currentLevel}></QuestionComponent>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default QuizPage;
