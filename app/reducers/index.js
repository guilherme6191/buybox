import { combineReducers } from 'redux';
import messages from './messages';
import auth from './auth';
import form from './form';
import alert from './alert';
import partner from '../components/AdminHome/reducer';
import suggestion from '../components/Alert-Suggestion/reducer';

export default combineReducers({
  alert,
  auth,
  form,
  messages,
  partner,
  suggestion
});
