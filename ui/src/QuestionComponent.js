import React, {Component} from "react";
import gql from "graphql-tag";
import {ApolloConsumer} from "react-apollo";
import {Button, ProgressBar} from "react-bootstrap";

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
    this._isMounted = false;
    this.state = {
      isAnswered: false,
      choices: [],
      score: 0,
      data: null,
      label: null,
      question: null,
    }
  }
  
  componentDidMount() {
    this._isMounted = true;
  }
  
  componentWillUnmount() {
    this._isMounted = false;
  }
  
  chooseRandomQuestion() {
    return QUESTIONS_TYPES[Math.floor(Math.random() * QUESTIONS_TYPES.length)];
  }
  
  handleClick(choice, client) {
    if (this.state.isAnswered) {
      return
    }
    
    this.setState({isAnswered: true});
    
    let isCorrectAnswer = this.state.choices[choice][1];
    
    this.props.updateScore(isCorrectAnswer, this.state.score, client).then();
    
    setTimeout(() => {
      this.query(client).then()
    }, 1000)
  }
  
  async query(client) {
    let question = this.chooseRandomQuestion()
    
    const {data} = await client.query({
      query: question.query,
      variables: {level: this.props.level},
      fetchPolicy: "network-only"
    })
    
    if (data.question.wrongOptions.length < 3) {
      return this.query(client)
    }
    
    let choices = []
    /** @namespace data.question.wrongOptions[] */
    choices.push([data.question.wrongOptions[0].value, false]);
    choices.push([data.question.wrongOptions[1].value, false]);
    choices.push([data.question.wrongOptions[2].value, false]);
    choices.splice(
      Math.floor(Math.random() * 4),
      0,
      /** @namespace data.question.correctOptions[] */
      [data.question.correctOptions[0].value, true]
    );
    this._isMounted && this.setState({
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
            <Button block
                    variant="danger"
                    className="btn-lg mt-2"
                    onClick={this.query.bind(this, client)}>Start the quiz!</Button>
          )}
        </ApolloConsumer>
      )
    } else {
      const progressMultiplier = 100 / this.props.questionsTotal
      const now = this.props.questionsCount * progressMultiplier
      return (
        <ApolloConsumer>
          {client => (
            <>
              <ProgressBar animated now={now}
                           label={this.props.questionsCount > 0 ? this.props.questionsCount + " / " + this.props.questionsTotal : null}
                           variant="info"
              />
              <div className="mt-3">
                <div className="text-center">
                  <h5 className="text-light">{this.state.label}</h5>
                  <h1 className="kanji">{this.state.question}</h1>
                </div>
                
                {this.state.choices.map((choice, i) => (
                  <Button key={i} block
                          variant={this.state.isAnswered ? (choice[1] ? "success" : "danger") : "info"}
                          className="funji-answer mb-4 btn-lg"
                          onClick={this.handleClick.bind(this, i, client)}>
                    {choice[0]}
                  </Button>
                ))}
              </div>
            </>
          )}
        </ApolloConsumer>
      )
    }
  }
}
