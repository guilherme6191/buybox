import { browserHistory } from 'react-router';

export function addAlert(fields, token, userId) {

    return (dispatch) => {
        dispatch({
            type: 'CLEAR_MESSAGES'
        });
        fetch('/alerts/add', {
            method: 'post',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ fields, userId })
        }).then((response) => {
            if (response.ok) {
                return response.json().then((json) => {
                    dispatch({
                        type: 'ADD_ALERT',
                        fields: json.alert
                    });
                    dispatch({
                        type: 'ALERT_UPDATE_SUCCESS',
                        messages: [{ msg: 'Alerta salvo com sucesso.' }]
                    });
                });
            }
        });
    }
}

export function getAlerts(token, userId) {

    return (dispatch) => {
        fetch('/alerts', {
            method: 'post',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ userId })
        }).then((response) => {
            if (response.ok) {
                return response.json().then((json) => {
                    dispatch({
                        type: 'LOAD_ALERTS',
                        fields: json.alerts
                    });
                });
            }
        });
    }
}

export function deleteAlert(token, alertId) {
    return (dispatch) => {
        dispatch({
            type: 'ALERT_DELETE_SUCCESS',
            message: [{ msg: "Alerta excluído com sucesso." }]
        });
    }

}
