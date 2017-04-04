import { LOAD_SUGGESTIONS_SUCCESS } from './actions';

export default function suggestion(state = {}, action) {
  switch (action.type) {
  case (LOAD_SUGGESTIONS_SUCCESS):
    return Object.assign({}, state, {
      ...action
    });
  default:
    return state
  }
}
