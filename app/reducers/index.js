import { combineReducers } from 'redux';
import messages from './messages';
import auth from './auth';
import form from './form';

export default combineReducers({
    messages,
    auth,
    form
});
