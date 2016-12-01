import React from 'react';
import { connect } from 'react-redux';
import AlertItem from './AlertItem';
import { deleteAlert } from '../../actions/alert'
import Messages from '../Messages';
import { browserHistory } from 'react-router';

class AlertList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ready: false
        };
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount() {
        if (!this.props.token) {
            return;
        }
        fetch('/alerts', {
            method: 'post',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.props.token}` },
            body: JSON.stringify({ userId: this.props.user._id })
        }).then((response) => {
            if (response.ok) {
                response.json().then((json) => {
                    this.setState({
                        ready: true,
                        alerts: json.alerts
                    })
                });
            }
        });
    }

    handleDelete(id) {
        this.setState({
            ready: true,
            alerts: this.state.alerts.filter(item => item._id != id)
        });
        this.props.dispatch(deleteAlert(this.props.token, id))
    }

    render() {
        const alerts = this.state.alerts && this.state.alerts.length > 0 ?
            this.state.alerts.map(alert =>
                <AlertItem key={alert._id} {...alert} onDelete={()=>this.handleDelete(alert._id)}/>
            ) : <h4>Não há alertas cadastrados.</h4>;
        return (
            <div className="col-sm-10">
                <ul className="list-group" style={{marginLeft: '2%'}}>
                    { this.state.ready ? alerts : 'Carregando...'  }
                </ul>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        user: state.auth.user
    }
};

export default connect(mapStateToProps)(AlertList)
