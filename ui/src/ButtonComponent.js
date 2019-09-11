import {Button} from "react-bootstrap";
import React, {Component} from "react";

export default class ButtonComponent extends Component {
    handleClick = () => {
        this.props.onClick();
    };

    render() {
        return (
            <Button block
                    variant={this.props.isAnswered ? (this.props.isCorrect ? "success" : "danger") : "outline-secondary"}
                    >
                {this.props.text}
            </Button>
        );
    }
}