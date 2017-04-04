import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux'
import { login } from '../../actions/auth';
import { facebookLogin, twitterLogin, googleLogin } from '../../actions/oauth';
import Messages from '../Messages';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: '', password: '' };
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleLogin(event) {
    event.preventDefault();
    this.props.dispatch(login(this.state.email, this.state.password));
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
            <form onSubmit={this.handleLogin.bind(this)}>
              <legend>Entrar</legend>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email"
                       placeholder="Email" autoFocus className="form-control"
                       value={this.state.email} onChange={this.handleChange.bind(this)} />
              </div>
              <div className="form-group">
                <label htmlFor="password">Senha</label>
                <input type="password" name="password" id="password"
                       placeholder="Password" className="form-control"
                       value={this.state.password} onChange={this.handleChange.bind(this)} />
              </div>
              <div className="form-group"><Link to="/forgot"><strong>Esqueceu sua
                senha?</strong></Link>
              </div>
              <button type="submit" className="btn btn-success">Entrar!</button>
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
          Não tenha uma conta? <Link to="/signup"><strong>Cadastre-se!</strong></Link>
        </p>
      </div>
    );
  }
}

export default connect()(Login);
