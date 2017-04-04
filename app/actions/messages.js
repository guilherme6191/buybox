export function sendMessage(type, txt) {
  return (dispatch) =>
    dispatch({
      type,
      messages: [{ msg: txt }]
    })
}
