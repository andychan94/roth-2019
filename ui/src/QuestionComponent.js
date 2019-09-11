import React, {Component} from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import {Button} from "react-bootstrap";


const QUERY_KANJI = gql`
    query Kanji($level: String!) {
        randomKanji(level: $level) {
            value
            randomConnectedMeanings(first:1) { value }
            randomNotConnectedMeanings(first:3) { value }
        }
    }
`

export default class QuestionComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isAnswered: false,
            isClicked: false,
            choices: []
        }
    }

    handleClick(refetch) {
        this.setState({ isAnswered: true })

        setTimeout(() => {
            refetch()

            this.setState({
                isAnswered: false,
                choices: []
            })
        }, 1000)
    }

    render() {
        return (
            <Query query={QUERY_KANJI} variables={{level: "N5"}}>
                {({ loading, error, data, refetch }) => {
                    if (loading) return "Loading..."
                    if (error) return `Error! ${error.message}`

                    if (this.state.choices.length == 0) {
                        if (data.randomKanji.randomNotConnectedMeanings.length != 3) {
                            refetch()
                            return null
                        }

                        var choices = []
                        choices.push([data.randomKanji.randomNotConnectedMeanings[0].value, false])
                        choices.push([data.randomKanji.randomNotConnectedMeanings[1].value, false])
                        choices.push([data.randomKanji.randomNotConnectedMeanings[2].value, false])
                        choices.splice(
                            Math.floor(Math.random() * 4), 
                            0, 
                            [data.randomKanji.randomConnectedMeanings[0].value, true]
                        )

                        this.setState({
                            choices: choices
                        })
                    }

                    return (
                        <div>
                            <h2>Guess the meaning of this kanji!</h2>
                            <div onClick={this.handleClick.bind(this, refetch)}>{data.randomKanji.value}</div>

                            {this.state.choices.map((choice, i) => (
                                <Button
                                        block
                                        variant={this.state.isAnswered ? (choice[1] ? "success" : "danger") : "outline-secondary"}
                                        onClick={this.handleClick.bind(this, refetch)}>
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
