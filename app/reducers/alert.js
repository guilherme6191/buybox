export default function alert(state = {}, action) {

    switch (action.type) {
    case ('LOAD_ALERTS_SUCCESS'):
        return Object.assign({}, state, {
            alerts: action.alerts,
            ready: action.ready
        });
    case ('ALERT_DELETE_SUCCESS'):
        const alerts = state.alerts.filter(item =>
            item._id != action.deletedAlertId
        );
        return {
            alerts: alerts,
            ready: action.ready
        };
    default:
        return state
    }
}
