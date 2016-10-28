const form = (state, action) => {

    const initialState = {
        fields: [{}]
    };

    debugger;
    switch(action) {
    case 'ADD_ALERT':
        return state.alerts.concat({ fields : action.fields });
    default:
        return initialState
    }


};

