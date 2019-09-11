import React, {Component} from "react";
import "./App.css";
import {Button, Col, Container, Row} from "react-bootstrap";
import ButtonComponent from "./ButtonComponent";
import gql from "graphql-tag";
import {Query} from "react-apollo";

class QuizPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentLevel: "N5",
            isAnswered: false,
            data: null,
            quize: null
        }
    }

    handleClick = () => {
        this.setState({isAnswered: true});
    };

    shuffleQuize(data) {
      let array = [];
      //array.push({kanzi: data.randomKanji.meanings[0].value, correct: true})
      array.push([data.randomKanji.notMeanings[0].value, false])
      array.push([data.randomKanji.notMeanings[1].value, false])
      array.push([data.randomKanji.notMeanings[2].value, false])
      let random = Math.floor( Math.random() * 4 );
      array.splice(random, 0, [data.randomKanji.meanings[0].value, true])
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
                meanings(first:1){value}
                notMeanings{value}
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
                                    <p className="text-light">What is the meaning of this
                                        kanji: {data.randomKanji.value}?</p>
                                    {array = this.shuffleQuize(data)}
                                    {console.log(array)}
                                    {this.renderButton(array[0][0], array[0][1])}
                                    {this.renderButton(array[1][0], array[1][1])}
                                    {this.renderButton(array[2][0], array[2][1])}
                                    {this.renderButton(array[3][0], array[3][1])}
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
