import React, {Component} from "react";
import "./App.css";
import {Col, Container, Row} from "react-bootstrap";
import QuestionComponent from "./QuestionComponent";
import gql from "graphql-tag";

class QuizPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentLevel: "N5",
      score: 0,
      streak: 0,
      questionsCount: 0
    };
  }

  updateScore = async (isCorrect, points, client) => {
    if (!client)
      return

    let newScore = this.state.score + (isCorrect ? points : 0)
    let newStreak = this.state.streak + (isCorrect ? 1 : -1)
    let newLevel = this.state.currentLevel

    if (newStreak === 3) {
      newStreak = 0
      newLevel = this.changeLevel(newLevel, 1)
    } else if (newStreak === -3) {
      newStreak = 0
      newLevel = this.changeLevel(newLevel, -1)
    }

    let userId = this.props.location.state.userId

    const {data} = await client.mutate({
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
      currentLevel: newLevel,
      questionsCount: this.state.questionsCount + 1
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

    let i = LEVELS.indexOf(current)
    let newI = i + change

    if (newI < 0) newI = 0;
    else if (newI === LEVELS.length) {
      newI = LEVELS.length - 1;
    }

    return LEVELS[newI];
  }

  render() {
    if (this.state.questionsCount === 20) {
      return (
        <>
          <h1 className="text-light font-weight-bold align-middle logo-line text-center mb-3">
            &#x1F344; Fun<span className="kanji">字</span>
          </h1>
          <h5 className="text-center mb-5">
            Hey {this.props.location.state.userName}, you got <strong>{this.state.score}</strong> points!
          </h5>
          <div className="text-center mb-5">You should try to take the JLPT {this.state.currentLevel}!!</div>
        </>
      )
    } else {
      return (
        <>
          <h1 className="text-light font-weight-bold align-middle logo-line text-center mb-3">
            &#x1F344; Fun<span className="kanji">字</span>
          </h1>
          <Container>
            <h5 className="text-center mb-5">
              {this.props.location.state.userName}: {this.state.score} points
            </h5>

            <Row className="align-items-center justify-content-center">
              <Col md={6}>
                <QuestionComponent
                  updateScore={this.updateScore}
                  level={this.state.currentLevel}
                />
              </Col>
            </Row>
          </Container>
        </>
      )
    }
  }
}

export default QuizPage;
