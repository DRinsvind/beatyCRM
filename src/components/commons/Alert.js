import React, {Component} from "react";
import PropTypes from "prop-types";

class Alert extends Component {
    constructor(props) {
        super(props);

        this.state = {
            stack: {
                "dir1": "down",
                "dir2": "left",
                "push": "top"
            }
        };
    }

    componentDidUpdate() {
        if (this.props.messages.length) {

            const message = this.props.messages[0];

            new window.PNotify({
                ...message,
                addclass: 'stack-topright',
                stack: this.state.stack,
                delay: 3000
            });
            this.props.onReadMessage();
        }
    }

    render() {
        return null;
    }
}

Alert.propTypes = {
    messages: PropTypes.array,
    onReadMessage: PropTypes.func.isRequired
};

export default Alert;
