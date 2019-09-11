import React, { Component } from "react";
import "./App.css";
import { Col, Container, Row } from "react-bootstrap";
import QuestionComponent from "./QuestionComponent";
import gql from "graphql-tag";

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
    };
  }

    updateScore = async (isCorrect, points, client) => {
        if (!client)
            return

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

        var userId = this.props.location.state.userId

        const { data } = await client.mutate({
            mutation: gql`
                mutation User($userId: ID!, $userScore: Int) {
                UpdateUser(id: $userId, score: $userScore) {
                    score
                }
                }
            `,
            variables: {
                userId: userId,
                userScore: newScore
            }
        })

        console.log("updateScore", newScore, newStreak, newLevel)
        
        this.setState({
            score: newScore,
            streak: newStreak,
            currentLevel: newLevel
        })

    console.log("updateScore", newScore, newStreak, newLevel);

    this.setState({
      score: newScore,
      streak: newStreak,
      currentLevel: newLevel
    });
  };

  changeLevel(current, change) {
    const LEVELS = ["N5", "N4", "N3", "N2", "N1"];

    var i = LEVELS.indexOf(current);
    var newI = i + change;

    if (newI < 0) newI = 0;
    else if (newI == LEVELS.length) {
      newI = LEVELS.length - 1;
    }

    return LEVELS[newI];
  }

  render() {
    return (
      <>
        <h1 className="text-light font-weight-bold align-middle logo-line text-center mb-3">
          &#x1F344; Fun<span className="kanji">字</span>
        </h1>
        <Container>
          <h5 className="text-center mb-5">
            {this.props.location.state.userName}: {this.state.score} points
          </h5>
          <Row className="align-items-center">
            <Col md={6}>
              <QuestionComponent
                updateScore={this.updateScore}
                level={this.state.currentLevel}
              />
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default QuizPage;
