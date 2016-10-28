import React from 'react';
import { connect } from 'react-redux';

const messageStyle = {
    position: 'fixed',
    zIndex: 9999,
    top: '30px',
    left: '40%'
};

class Messages extends React.Component {
    constructor(props) {
        super(props);
    }

    onClose(event) {
        event.preventDefault();
        this.props.dispatch({
            type: 'CLEAR_MESSAGES'
        });
    }

    render() {
        return this.props.messages.success ? (
            <div role="alert" className={ messageStyle } className="alert alert-success">
                <a href="#"
                   onClick={this.onClose.bind(this)}
                   class="close">&times;</a>

                {this.props.messages.success.map((message, index) => <div key={index}>{message.msg}</div>)}
            </div>
        ) : this.props.messages.error ? (
            <div role="alert" className={ messageStyle } className="alert alert-danger">
                <a href="#"
                   onClick={this.onClose.bind(this)}
                   class="close">&times;</a>

                {this.props.messages.error.map((message, index) => <div key={index}>{message.msg}</div>)}
            </div>
        ) : this.props.messages.info ? (
            <div role="alert" className={ messageStyle } className="alert alert-info">
                <a href="#"
                   onClick={this.onClose.bind(this)}
                   class="close">&times;</a>

                {this.props.messages.info.map((message, index) => <div key={index}>{message.msg}</div>)}
            </div>
        ) : null;
    }
}

export default connect()(Messages);
