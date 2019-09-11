import React, {Component} from "react";
import gql from "graphql-tag";
import { compose, graphql } from "react-apollo";
import { ApolloConsumer } from "react-apollo";
import { Query } from "react-apollo";


const QUERY_KANJI = gql`
    query Kanji($level: String!) {
        randomKanji(level: $level) {
            value
        }
    }
`

export default class QuestionComponent extends Component {
    constructor(props) {
        super(props)
    }

    handleClick(refetch) {
        console.log("handleClick")
        refetch()
    }

    render() {
        return (
            <Query query={QUERY_KANJI} variables={{level: "N5"}}>
                {({ loading, error, data, refetch }) => {
                    if (loading) return "Loading..."
                    if (error) return `Error! ${error.message}`

                    return (
                        <p onClick={this.handleClick.bind(this, refetch)}>{data.randomKanji.value}</p>
                    )
                }}
            </Query>
        )
    }
}
