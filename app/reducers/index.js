import { combineReducers } from 'redux';
import messages from './messages';
import auth from './auth';
import form from './form';
import alert from './alert';

export default combineReducers({
    alert,
    auth,
    form,
    messages
});
