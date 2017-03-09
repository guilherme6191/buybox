import React from 'react';
import { connect } from 'react-redux';
import AlertItem from './AlertItem';
import { getAlerts, deleteAlert } from '../../actions/alert'
import { browserHistory } from 'react-router';

class AlertList extends React.Component {
    constructor(props) {
        super(props);
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount() {
        if (!this.props.token) {
            return;
        }
        this.props.dispatch(getAlerts(this.props.token, this.props.user._id));
    }

    handleDelete(id) {
        this.props.dispatch(deleteAlert(this.props.token, id))
    }

    render() {
        const alerts = this.props.alerts && this.props.alerts.length > 0 ?
            this.props.alerts.map(alert =>
                <AlertItem key={alert._id} {...alert} onDelete={this.handleDelete}/>
            ) : <h4>Não há alertas cadastrados.</h4>;
        return (
            <div className="col-sm-12">
                <ul className="list-group">
                    { this.props.ready ? alerts : 'Carregando...'  }
                </ul>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        user: state.auth.user,
        alerts: state.alert.alerts,
        ready: state.alert.ready
    }
};

export default connect(mapStateToProps)(AlertList)
