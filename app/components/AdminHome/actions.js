export const LOAD_PARTNERS_OK = "LOAD_PARTNERS_OK";
export const LOAD_PARTNERS_FAILURE = "LOAD_PARTNERS_FAILURE";
export const CREATE_PARTNER_OK = "CREATE_PARTNER_OK";
export const CREATE_PARTNER_FAILURE = "CREATE_PARTNER_FAILURE";
export const DELETE_PARTNER_OK = "DELETE_PARTNER_OK";


export function getPartners(token) {
  return (dispatch) => {
    fetch('/partners', {
      method: 'get',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    }).then((response) => {
      if (response.ok) {
        return response.json().then((json) => {
          dispatch({
            type: LOAD_PARTNERS_OK,
            partners: json,
            ready: true
          });
        });
      } else {
        return dispatch({
          type: LOAD_PARTNERS_FAILURE
        })
      }
    });
  }
}

export function createPartner({name, email, password, partner, admin}) {
  return (dispatch) => {
    return fetch('/signup', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name, email: email, password: password, admin, partner })
    }).then((response) => {
      return response.json().then((json) => {
        if (response.ok) {
          dispatch({
            type: CREATE_PARTNER_OK,
            partner: json.user,
            ready: true,
            messages: [{ msg: 'Parceiro criado com sucesso.' }]
          });
        } else {
          dispatch({
            type: CREATE_PARTNER_FAILURE,
            messages: Array.isArray(json) ? json : [json]
          });
        }
      });
    });
  }
}

export function deletePartner(token, id) {
  return (dispatch) => {
    dispatch({
      type: 'CLEAR_MESSAGES'
    });
    return fetch('/partner', {
      method: 'delete',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ id: id })
    }).then((response) => {
      if (response.ok) {
        return response.json().then((json) => {
          dispatch({
            type: DELETE_PARTNER_OK,
            id: id,
            ready: true
          });
          dispatch({
            type: 'DELETE_PARTNER_SUCCESS',
            messages: [json]
          });
        });
      } else {
        debugger;
      }
    });
  };
}
