import React, {Component} from "react";
import "./App.css";
import {Col, Container, Row} from "react-bootstrap";
import QuestionComponent from "./QuestionComponent";

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
    };

    render() {
        return (
            <>
                <h1 className="text-light font-weight-bold align-middle logo-line text-center mb-5">
                    &#x1F344;
                    Fun<span className="kanji">字</span>
                </h1>
                <Container>
                    {this.state.score}
                    <Row className="align-items-center h-100 justify-content-center">
                        <Col md={6}>
                            <QuestionComponent updateScore={this.updateScore}/>
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}

export default QuizPage;
