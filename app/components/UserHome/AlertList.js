import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import AlertItem from './AlertItem';
import MyModal from '../Modal';

import { getAlerts, deleteAlert } from '../../actions/alert'

class AlertList extends React.Component {
    constructor(props) {
        super(props);
        this.handleDelete = this.handleDelete.bind(this);
        this.state = {
            modalShown: false
        }
    }

    componentDidMount() {
        if (!this.props.token) {
            return;
        }
        this.props.dispatch(getAlerts(this.props.token, this.props.user._id));
    }

    handleDelete(id) {
        debugger;
        this.setState({ selectedId: id });
        this.modalShow();
    }

    modalClose = () => {
        this.setState({ modalShown: false });
        this.setState({ selectedId: null });
    };

    modalShow = () => {
        this.setState({ modalShown: true })
    };

    modalConfirm = () => {
        this.props.dispatch(deleteAlert(this.props.token, this.state.selectedId));
        this.modalClose();
    };

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
                <MyModal shown={this.state.modalShown}
                         close={this.modalClose}
                         text="Essa ação é irreversível."
                         title="Tem certeza que deseja excluir este Alerta?"
                         confirm={this.modalConfirm}/>
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
