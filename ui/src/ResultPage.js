import React, {Component} from "react";
import "./App.css";

class ResultPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        <h1 className="text-light font-weight-bold align-middle logo-line text-center mb-3">
          &#x1F344; Fun<span className="kanji">字</span>
        </h1>
        <h5 className="text-center mb-5">
          Hey, {this.props.location.state.userName}, your got {this.props.location.state.score} points!
        </h5>
      </>
    );
  }
}

export default ResultPage;
