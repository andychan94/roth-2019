import React, {Component} from "react";
import gql from "graphql-tag";
import {Query} from "react-apollo";
import {Button} from "react-bootstrap";

const QUESTIONS_TYPES = [
    {
        label: "What is the meaning of this kanji?",
        query: gql`
            query Kanji($level: String!) {
                question: randomKanji(level: $level) {
                    value
                    score
                    correctOptions: randomConnectedMeanings(first:1) { value }
                    wrongOptions: randomNotConnectedMeanings(first:3) { value }
                }
            }
        `
    },
    {
        label: "How do you read this kanji?",
        query: gql`
            query Kanji($level: String!) {
                question: randomKanji(level: $level) {
                    value
                    score
                    correctOptions: randomConnectedReadings(first:1) { value }
                    wrongOptions: randomNotConnectedReadings(first:3) { value }
                }
            }
        `
    },
    {
        label: "Which kanji corresponds to this meaning?",
        query: gql`
            query Meaning($level: String!) {
                question: randomMeaning(level: $level) {
                    value
                    score
                    correctOptions: randomConnectedKanjis(first:1) { value }
                    wrongOptions: randomNotConnectedKanjis(first:3) { value }
                }
            }
        `
    },
    {
        label: "Which kanji corresponds to this reading?",
        query: gql`
            query Reading($level: String!) {
                question: randomReading(level: $level) {
                    value
                    score
                    correctOptions: randomConnectedKanjis(first:1) { value }
                    wrongOptions: randomNotConnectedKanjis(first:3) { value }
                }
            }
        `
    }
];

export default class QuestionComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAnswered: false,
            choices: [],
            question: this.chooseRandomQuestion(),
            score: 0
        }
    }

    chooseRandomQuestion() {
        return QUESTIONS_TYPES[Math.floor(Math.random() * QUESTIONS_TYPES.length)];
    }

    handleClick(choice, refetch) {
        this.setState({isAnswered: true});

        var isCorrectAnswer = this.state.choices[choice][1];

        this.props.updateScore(isCorrectAnswer, this.state.score);

        setTimeout(() => {
            refetch();

            this.setState({
                isAnswered: false,
                choices: [],
                question: this.chooseRandomQuestion(),
                score: 0
            })
        }, 1000)
    }

    render() {
        return (
            <Query query={this.state.question.query} variables={{level: "N5"}}>
                {({loading, error, data, refetch}) => {
                    if (loading) return "Loading...";
                    if (error) return `Error! ${error.message}`;

                    if (this.state.choices.length === 0) {
                        if (data.question.wrongOptions.length !== 3) {
                            refetch();
                            return null
                        }

                        var choices = [];
                        choices.push([data.question.wrongOptions[0].value, false]);
                        choices.push([data.question.wrongOptions[1].value, false]);
                        choices.push([data.question.wrongOptions[2].value, false]);
                        choices.splice(
                            Math.floor(Math.random() * 4),
                            0,
                            [data.question.correctOptions[0].value, true]
                        );

                        this.setState({
                            choices: choices,
                            score: data.question.score
                        })
                    }

                    return (
                        <div>
                            <div className="text-center">
                                <h5 className="text-light">{this.state.question.label}</h5>
                                <h1 className="kanji">{data.question.value}</h1>
                            </div>

                            {this.state.choices.map((choice, i) => (

                                <Button block
                                        variant={this.props.isAnswered ? (this.props.isCorrect ? "success" : "danger") : "info"}
                                        className="funji-answer mb-4 btn-lg"
                                        onClick={this.handleClick.bind(this, i, refetch)}>
                                    {choice[0]}
                                </Button>
                            ))}
                        </div>
                    )
                }}
            </Query>
        )
    }
}
