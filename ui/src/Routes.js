import {Route, Switch} from "react-router-dom";
import React, { Component } from "react";
import NameInputPage from "./NameInputPage";
import QuizPage from "./QuizPage";

export default class Routes extends Component {
    render() {
        return (
            <div>
                <Switch>
                    <Route exact={true} path="/" component={NameInputPage}/>
                    <Route exact={true} path="/quiz" component={QuizPage}/>
                </Switch>
            </div>
        )
    }
}