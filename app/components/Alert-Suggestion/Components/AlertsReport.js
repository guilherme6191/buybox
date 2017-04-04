import React from 'react';
import { connect } from 'react-redux';
import CheckBoxList from './Grid';

import {sendMessage} from '../../../actions/messages';
import {createSuggestion} from '../actions';
import {getAlerts} from '../../../actions/alert';

import SuggestionModal from './SuggestionModal';


class AlertsReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = { suggestionModalShown: false };
  }

  componentDidMount() {
    if (!this.props.token) {
      return;
    }
    this.props.dispatch(getAlerts(this.props.token));
  }

  handleSuggestion = (selectedItems) => {
    const alertQt = selectedItems.length;

    if (alertQt <= 0) {
      this.props.dispatch(sendMessage(
        'ALERT_NOT_SELECTED',
        'Favor selecionar os um ou mais Alertas para que os usuários que os criaram ' +
        'recebam sua sugestão.'
      ));
      return;
    }
    //select unique users
    const userIds = selectedItems.map((item) => item.userId)
      .sort()
      .filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
      });

    this.setState({
      suggestionModalShown: true,
      userQt: userIds.length,
      alertQt,
      userIds
    });
  };

  submitSuggestion = (data) => {
    const suggestion = Object.assign({}, data, { userIds: this.state.userIds });
    this.props.dispatch(createSuggestion(this.props.token, suggestion));
    this.closeModal();
  };

  closeModal = () => {
    this.setState({ suggestionModalShown: false });
  };

  render() {
    const alerts = this.props.ready ?
      <CheckBoxList ref="chkboxList"
                    defaultData={this.props.alerts}
                    handleSuggestion={this.handleSuggestion} />
      : <div className="loader"></div>;
    return (
      <div className="alerts-container">
        <h3>Alertas</h3>
        <ul className="list-group grid">
          {alerts}
        </ul>
        <SuggestionModal shown={this.state.suggestionModalShown}
                         alertQt={this.state.alertQt}
                         userQt={this.state.userQt}
                         close={this.closeModal}
                         submitSuggestion={this.submitSuggestion} />
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
