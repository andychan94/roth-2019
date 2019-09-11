import React, {Component} from "react";
import gql from "graphql-tag";
import {Query, ApolloConsumer} from "react-apollo";
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
            score: 0,
            data: null,
            label: null,
            question: null,
        }
    }

    chooseRandomQuestion() {
        return QUESTIONS_TYPES[Math.floor(Math.random() * QUESTIONS_TYPES.length)];
    }

    handleClick(choice, client) {
        if (this.state.isAnswered) {
            return
        }

        this.setState({isAnswered: true});

        var isCorrectAnswer = this.state.choices[choice][1];

        this.props.updateScore(isCorrectAnswer, this.state.score, client);

        var isCorrectAnswer = this.state.choices[choice][1]
 
        this.props.updateScore(isCorrectAnswer, this.state.score)

        setTimeout(() => {
            this.query(client)
        }, 1000)
    }

    async query(client) {
        var question = this.chooseRandomQuestion()

        const { data } = await client.query({
            query: question.query,
            variables: { level: this.props.level },
            fetchPolicy: "network-only"
        })

        if (data.question.wrongOptions.length < 3) {
            return this.query(client)
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
            isAnswered: false,
            label: question.label,
            question: data.question.value,
            score: data.question.score,
            choices: choices
        })
    }

    render() {
        if (!this.state.question) {
            return (
                <ApolloConsumer>
                    {client => (
                        <button onClick={this.query.bind(this, client)}>Click to start!</button>
                    )}
                </ApolloConsumer>
            )
        }
        else {
            return (
                <ApolloConsumer>
                    {client => (
                        <div>
                            <div className="text-center">
                                <h5 className="text-light">{this.state.label}</h5>
                                <h1 className="kanji">{this.state.question}</h1>
                            </div>

                            {this.state.choices.map((choice, i) => (
                                <Button block
                                        variant={this.state.isAnswered ? (choice[1] ? "success" : "danger") : "info"}
                                        className="funji-answer mb-4 btn-lg"
                                        onClick={this.handleClick.bind(this, i, client)}>
                                    {choice[0]}
                                </Button>
                            ))}
                        </div>
                    )}
                </ApolloConsumer>
            )
        }
    }
}
