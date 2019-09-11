import React from "react";
import ReactDOM from "react-dom";
import {Route, BrowserRouter as Router} from 'react-router-dom'
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";
import ApolloClient from "apollo-boost";
import {ApolloProvider} from "react-apollo";
import NameInputPage from "./NameInputPage";
import QuizPage from "./QuizPage";
import ResultPage from "./ResultPage";

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_URI
});

const Main = () => (
  <ApolloProvider client={client}>
    <Router>
      <div>
        <Route exact={true} path="/" component={NameInputPage}/>
        <Route exact={true} path="/quiz" component={QuizPage}/>
        <Route exact={true} path="/result" component={ResultPage}/>
      </div>
    </Router>
  </ApolloProvider>
);

ReactDOM.render(<Main/>, document.getElementById("root"));
registerServiceWorker();
