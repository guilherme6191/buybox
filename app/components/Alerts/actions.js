export const CREATE_SUGGESTION_OK = "CREATE_SUGGESTION_OK";
export const CREATE_SUGGESTION_FAILURE = "CREATE_SUGGESTION_FAILURE";

export function createSuggestion(token, suggestion) {
    debugger;
    return (dispatch) => {
        fetch('/suggestion', {
            method: 'post',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(suggestion)
        }).then((response) => {
            if (response.ok) {
                return response.json().then((json) => {
                    dispatch({
                        type: CREATE_SUGGESTION_OK,
                        messages: [{
                            msg: `Sugestão salva com sucesso e enviada
                            para ${suggestion.userIds.length} usuário(s)!! o/`
                        }]
                    });
                });
            } else {
                return dispatch({
                    type: CREATE_SUGGESTION_FAILURE,
                    msg: [{
                        msg: 'Sua sugestão não foi salva devido à razões ainda incompreensíveis. ' +
                        'Por favor, tente mais tarde ou mande um email para a BuyBox em Contato.'
                    }]
                })
            }
        });
    }
}
