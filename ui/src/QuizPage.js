import React, {Component} from "react";
import "./App.css";
import {Col, Container, Row} from "react-bootstrap";
import ButtonComponent from "./ButtonComponent";
import gql from "graphql-tag";
import {Query} from "react-apollo";

class QuizPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentLevel: "N1",
            isAnswered: false,
            data: null
        }
    }

    handleClick = () => {
        this.setState({isAnswered: true});
    };

    renderButton(text, isCorrect) {
        return <ButtonComponent text={text} isCorrect={isCorrect} isAnswered={this.state.isAnswered}
                                onClick={this.handleClick}/>
    }

    render() {

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
                                    <h4>
                                        Hello, {this.props.location.state.userName}. Your id is {this.props.location.state.userId}
                                    </h4>
                                    <p className="text-light">What is the meaning of this
                                        kanji: {data.randomKanji.value}?</p>
                                    <div className="answers">
                                        {this.renderButton(data.randomKanji.meanings[0].value, true)}
                                        {this.renderButton(data.randomKanji.notMeanings[0].value, false)}
                                        {this.renderButton(data.randomKanji.notMeanings[1].value, false)}
                                        {this.renderButton(data.randomKanji.notMeanings[2].value, false)}
                                    </div>
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
