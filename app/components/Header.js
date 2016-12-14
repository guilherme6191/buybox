import React from 'react';
import { IndexLink, Link } from 'react-router';
import { connect } from 'react-redux'
import { logout } from '../actions/auth';
import Messages from './Messages';

const msgStyle = {
    position: "fixed",
    top: "5%",
    left: "50%",
    width: "30%",
    marginLeft: "-15%"
};

class Header extends React.Component {
    handleLogout(event) {
        event.preventDefault();
        this.props.dispatch(logout());
    }

    render() {
        const active = { borderBottomColor: '#3f51b5' };
        const rightNav = this.props.token ? (
            <ul className="nav navbar-nav navbar-right">
                <li className="dropdown">
                    <a href="#" data-toggle="dropdown" className="navbar-avatar dropdown-toggle">
                        <img src={this.props.user.picture || this.props.user.gravatar}/>
                        {' '}{this.props.user.name || this.props.user.email || this.props.user.id}{' '}
                        <i className="caret"></i>
                    </a>
                    <ul className="dropdown-menu">
                        <li><Link to="/account">Minha Conta</Link></li>
                        <li className="divider"></li>
                        <li><a href="#" onClick={this.handleLogout.bind(this)}>Sair</a></li>
                    </ul>
                </li>
            </ul>
        ) : (
            <ul className="nav navbar-nav navbar-right">
                <li><Link to="/login" activeStyle={active}>Entrar</Link></li>
                <li><Link to="/signup" activeStyle={active}>Cadastre-se</Link></li>
            </ul>
        );
        return (
            <nav className="navbar navbar-default navbar-static-top">
                <div className="container">
                    <div className="navbar-header">
                        <button type="button" data-toggle="collapse" data-target="#navbar"
                                className="navbar-toggle collapsed">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar" />
                            <span className="icon-bar" />
                            <span className="icon-bar" />
                        </button>
                        <IndexLink to="/" className="navbar-brand">
                            <img src="../images/bbNameLogo.jpg" style={{marginTop: '-4px'}} width="120px" />
                        </IndexLink>
                    </div>
                    <div id="navbar" className="navbar-collapse collapse">
                        <ul className="nav navbar-nav">
                            <li><IndexLink to="/userHome" activeStyle={active}>Home</IndexLink></li>
                            <li><Link to="/contact" activeStyle={active}>Contato</Link></li>
                            <li><Link to="/trends" activeStyle={active}>Precisando de ideias?</Link></li>
                        </ul>
                        <div style={ msgStyle }>
                            <Messages messages={this.props.messages}/>
                        </div>
                        {rightNav}
                    </div>
                </div>
            </nav>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        user: state.auth.user,
        messages: state.messages
    };
};

export default connect(mapStateToProps)(Header);
