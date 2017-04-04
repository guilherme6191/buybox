import { LOAD_PARTNERS_OK, LOAD_PARTNERS_FAILURE, CREATE_PARTNER_OK, DELETE_PARTNER_OK } from './actions';

export default function partner(state = {}, action) {
  switch (action.type) {
  case (LOAD_PARTNERS_OK):
    return Object.assign({}, state, {
      ...action
    });
  case (CREATE_PARTNER_OK):
    return {
      ready: action.ready,
      partners: [
        ...state.partners,
        action.partner
      ]
    };
  case (DELETE_PARTNER_OK):
    const partners = state.partners.filter(item =>
      item._id != action.id
    );
    return {
      partners,
      ready: action.ready
    };
  default:
    return state
  }
}
