import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux'
import { signup } from '../../actions/auth';
import { facebookLogin, twitterLogin, googleLogin, vkLogin, githubLogin } from '../../actions/oauth';
import Messages from '../Messages';

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: '', email: '', password: '' };
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSignup(event) {
    event.preventDefault();
    this.props.dispatch(signup(this.state.name, this.state.email, this.state.password));
  }

  handleFacebook() {
    this.props.dispatch(facebookLogin())
  }

  handleTwitter() {
    this.props.dispatch(twitterLogin())
  }

  handleGoogle() {
    this.props.dispatch(googleLogin())
  }

  render() {
    return (
      <div className="login-container container">
        <div className="panel">
          <div className="panel-body">
            <form onSubmit={this.handleSignup.bind(this)}>
              <legend>Crie uma conta</legend>
              <div className="form-group">
                <label htmlFor="name">Nome</label>
                <input type="text" name="name" id="name" placeholder="Name" autoFocus
                       className="form-control" value={this.state.name}
                       onChange={this.handleChange.bind(this)} />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email" placeholder="Email"
                       className="form-control"
                       value={this.state.email} onChange={this.handleChange.bind(this)} />
              </div>
              <div className="form-group">
                <label htmlFor="password">Senha</label>
                <input type="password" name="password" id="password" placeholder="Password"
                       className="form-control" value={this.state.password}
                       onChange={this.handleChange.bind(this)} />
              </div>
              <button type="submit" className="btn btn-success">Criar sua conta!</button>
            </form>
            <div className="hr-title"><span>ou</span></div>
            <div className="btn-toolbar text-center">
              <button onClick={this.handleFacebook.bind(this)} className="btn btn-facebook">Entre
                com
                Facebook
              </button>
              <button onClick={this.handleTwitter.bind(this)} className="btn btn-twitter">Entre com
                Twitter
              </button>
              <button onClick={this.handleGoogle.bind(this)} className="btn btn-google">Entre com
                Google
              </button>
            </div>
          </div>
        </div>
        <p className="text-center">
          Já tem uma conta? <Link to="/login"><strong>Entre!</strong></Link>
        </p>
      </div>
    );
  }
}

export default connect()(Signup);
