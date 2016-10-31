import React from 'react';
import { connect } from 'react-redux'
import { forgotPassword } from '../../actions/auth';
import { sendMessage } from '../../actions/messages';
import Messages from '../Messages';
import  { browserHistory } from 'react-router';

class Forgot extends React.Component {
    constructor(props) {
        super(props);
        this.state = { email: '' };
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleForgot(event) {
        event.preventDefault();
        this.props.dispatch(forgotPassword(this.state.email));
        this.setState({ email: '' });
    }

    render() {
        return (
            <div className="container">
                <div className="panel">
                    <div className="panel-body">
                        <form onSubmit={this.handleForgot.bind(this)}>
                            <legend>Esqueci a senha :/</legend>
                            <div className="form-group">
                                <p>Insira seu email abaixo e enviaremos instruções.</p>
                                <label htmlFor="email">Email</label>
                                <input type="email" name="email" id="email" placeholder="Email" className="form-control"
                                       autoFocus value={this.state.email} onChange={this.handleChange.bind(this)}/>
                            </div>
                            <button type="submit" className="btn btn-success">Restaurar senha!</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect()(Forgot);
