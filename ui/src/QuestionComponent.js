import React, {Component} from "react";
import gql from "graphql-tag";
import { compose, graphql } from "react-apollo";

const QUERY_KANJI = gql`
    query Kanji($level: String!) {
        randomKanji(level: $level) {
            value
        }
    }
`

class QuestionComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            aaa: "Hello"
        }
    }

    async queryKanji() {
        const { randomKanji } = this.props
        const result = await randomKanji({ variables: {
            'level': "N5"
        }})

        console.log(result)
    }

    renderQuestion() {
        // console.log('render')
        // return (
        //     <Query 
        //         query={gql`
        //             query Kanji($level: String!) {
        //                 randomKanji(level: $level) {
        //                     value
        //                 }
        //             }
        //         `}
        //         variables={{
        //             level: "N5"
        //         }}
        //     >
        //     {({loading, error, data}) => {
        //         if (loading) return <p>Loading...</p>
        //         if (error) return <p>Error</p>

        //         return <h2 onClick={this.handleClick}>QuestionComponent {data.randomKanji.value}</h2>
        //     }}
        //     </Query>
        // )
    }

    handleClick = () => {
        console.log("handleClick")
        //this.props.onClick()
        //this.renderQuestion()
        // this.renderQuestion()
        // this.setState({
        //     aaa: "World"
        // })

        // const { loading, error, data } = useLazyQuery(gql`
        //     query Kanji($level: String!) {
        //         randomKanji(level: $level) {
        //             value
        //         }
        //     }
        // `)

        // if (loading) return <p>Loading...</p>;
        // if (error) return <p>Error :(</p>;

        // console.log(data)
    }


    render() {
        return (
            <div>
                <h2 onClick={this.queryKanji.bind(this)}>Hello</h2>
            </div>
        )
    }
}

export default compose(
    graphql(QUERY_KANJI, { name: "randomKanji" })
)(QuestionComponent)