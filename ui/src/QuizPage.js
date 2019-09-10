import React, {Component} from "react";
import "./App.css";
import {Button, Col, Container, Row} from "react-bootstrap";
import ButtonComponent from "./ButtonComponent";
import gql from "graphql-tag";
import {Paper, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, Tooltip} from "@material-ui/core";
import {Query} from "react-apollo";

class QuizPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentLevel: "N2",
            isAnswered: false,
            data: null
        }
    }

    componentDidMount() {

    }

    handleClick = () => {
        this.setState({isAnswered: true});
    };

    renderButton(text, isCorrect) {
        return <ButtonComponent text={text} isCorrect={isCorrect} isAnswered={this.state.isAnswered}
                                onClick={this.handleClick}/>
    }

    render() {
        // Hello, {this.props.location.state.name}
        return (
            <Query
                query={gql`
          query {randomKanji($level: String)
          {     value
                meanings(first:1){value}
                notMeanings{value}
          }}
        `}
                variables={{
                    level: this.state.currentLevel,
                }}
            >
                {({loading, error, data}) => {
                    if (loading) return <p>Loading...</p>;
                    if (error) return <p>Error</p>;

                    return (

                        <Container className="h-100">
                            {data.randomKanji.map(n => {
                                return (
                                    <Row className="align-items-center h-100 justify-content-center">
                                        <Col md={6}>
                                            <h1 className="text-light font-weight-bold text-center">
                                                Fun字
                                            </h1>
                                            <p className="text-light">What is the meaning of this kanji: {n.value}?</p>
                                            {/*{this.renderButton(n.meanings[0].value, false)}*/}
                                            {/*{this.renderButton(n.notMeanings[0].value, false)}*/}
                                            {/*{this.renderButton(n.notMeanings[1].value, false)}*/}
                                            {/*{this.renderButton(n.notMeanings[2].value, false)}*/}
                                        </Col>
                                    </Row>

                                );
                            })}

                        </Container>
                    );
                }}
            </Query>


            //-----------
            // <Container className="h-100">
            // <Row className="align-items-center h-100 justify-content-center">
            // <Col md={6}>
            // <h1 className="text-light font-weight-bold text-center">
            // Fun字
            // </h1>
            // <p className="text-light">Question</p>
            // {this.renderButton("option 1", false)}
            // {this.renderButton("option 2", true)}
            // {this.renderButton("option 3", false)}
            // {this.renderButton("option 4", false)}
            // </Col>
            // </Row>
            // </Container>
        );
    }
}

export default QuizPage;
