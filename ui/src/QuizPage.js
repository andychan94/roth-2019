import React, {Component} from "react";
import "./App.css";
import {Col, Container, Row} from "react-bootstrap";
import QuestionComponent from "./QuestionComponent";
import {Redirect} from "react-router-dom"
import Header from "./Header"
import gql from "graphql-tag"

const QUESTIONS_TOTAL = 20;

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
  
    await client.mutate({
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
    if (!this.props.location.state) {
      return <Redirect to={"/"}/>
    }
    if (this.state.questionsCount === QUESTIONS_TOTAL) {
      return (
        <>
          <Header/>
          <h5 className="text-center mb-3">
            Hey <strong>{this.props.location.state.userName}</strong>, you
            got <strong>{this.state.score}</strong> points!
          </h5>
          <p className="text-center">You should try to take the <strong>JLPT {this.state.currentLevel}</strong>!!</p>
        </>
      )
    } else {
      return (
        <>
          <Header/>
          <Container>
            <h5 className="text-center mb-3">
              {this.props.location.state.userName}: {this.state.score} points
            </h5>
            <Row className="align-items-center justify-content-center">
              <Col md={6}>
                <QuestionComponent
                  updateScore={this.updateScore}
                  level={this.state.currentLevel}
                  questionsTotal={QUESTIONS_TOTAL}
                  questionsCount={this.state.questionsCount}
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
