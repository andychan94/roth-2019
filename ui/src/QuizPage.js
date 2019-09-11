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
            isClicked: false
        }
    }

    handleClick = () => {
        console.log('onClick from parent')
        this.setState({isAnswered: true});
        this.setState({isClicked: true});
    };

    shuffleQuize(data) {
      let array = [];
      if(this.state.isClicked === true) {
        return this.array;
      }

      //array.push({kanzi: data.randomKanji.meanings[0].value, correct: true})
      array.push([data.randomKanji.randomNotConnectedMeanings[0].value, false])
      array.push([data.randomKanji.randomNotConnectedMeanings[1].value, false])
      array.push([data.randomKanji.randomNotConnectedMeanings[2].value, false])
      let random = Math.floor( Math.random() * 4 );
      array.splice(random, 0, [data.randomKanji.randomConnectedMeanings[0].value, true])
      // this.setState({quize: array});
      return array;
    }

    renderButton(text, isCorrect) {
        return <ButtonComponent text={text} isCorrect={isCorrect} isAnswered={this.state.isAnswered}
                                onClick={this.handleClick}/>
    }

    render() {
        let array;
        return (
            <Query
                query={gql`
          query Kanji($level: String!)
          {
            randomKanji(level: $level)
            {
                value
                randomConnectedMeanings(first:1){value}
                randomNotConnectedMeanings(first:3){value}
            }
          }
        `}
                variables={{
                    level: this.state.currentLevel,
                }}>
                {({loading, error, data}) => {
                    if (loading) return <p>Loading...</p>;
                    if (error) return <p>Error</p>;
                    return (
                        <Container className="h-100">
                            <Row className="align-items-center h-100 justify-content-center">
                                <Col md={6}>
                                    <h1 className="text-light font-weight-bold text-center">
                                        Fun字
                                    </h1>
                                    <h4>
                                        Hello, {this.props.location.state.userName}.<br />
                                        Your id is {this.props.location.state.userId}<br />
                                        Your score: {this.props.location.state.userScore}
                                    </h4>
                                    <p className="text-light">What is the meaning of this
                                        kanji: {data.randomKanji.value}?</p>
                                    {this.array = this.shuffleQuize(data)}
                                    {console.log(array)}
                                    {this.renderButton(this.array[0][0], this.array[0][1])}
                                    {this.renderButton(this.array[1][0], this.array[1][1])}
                                    {this.renderButton(this.array[2][0], this.array[2][1])}
                                    {this.renderButton(this.array[3][0], this.array[3][1])}
                                </Col>
                            </Row>
                        </Container>
                    );
                }}
            </Query>
        );
    }
}

export default QuizPage;
