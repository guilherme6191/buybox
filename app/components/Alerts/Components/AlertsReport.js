import React from 'react';
import { connect } from 'react-redux';
import CheckBoxList from './Grid';

import {getAlerts} from '../../../actions/alert';


class AlertsReport extends React.Component {
    componentDidMount() {
        if (!this.props.token) {
            return;
        }
        this.props.dispatch(getAlerts(this.props.token));
    }

    handleCheckboxListChange = (values) => {
        // values is array of selected item. e.g. ['apple', 'banana']
        debugger;
    };


    render() {
        const alerts = this.props.ready ?
            <CheckBoxList ref="chkboxList"
                          defaultData={this.props.alerts}
                          onChange={this.handleCheckboxListChange}/>

            : <div className="loader"></div>;
        return (
            <div>
                <h3>Alertas</h3>

                <ul className="list-group">
                    <li className="list-group-item-heading"><span>Ae</span>
                    </li>
                    {alerts}
                </ul>
            </div>
        );
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

export default connect(mapStateToProps)(AlertsReport)
