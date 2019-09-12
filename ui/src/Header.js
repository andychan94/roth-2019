import React, {Component} from "react"

export default class Header extends Component {
  render() {
    return (
      <h1 className="text-light font-weight-bold align-middle logo-line text-center mb-3">
        <span role="img" aria-label="Fungi">&#x1F344;</span> Fun<span className="kanji">字</span>
      </h1>
    )
  }
}