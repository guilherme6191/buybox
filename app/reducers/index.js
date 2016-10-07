import { combineReducers } from 'redux';
import messages from './messages';
import auth from './auth';
import { reducer as form } from 'redux-form';

export default combineReducers({
    messages,
    auth,
    form
});
