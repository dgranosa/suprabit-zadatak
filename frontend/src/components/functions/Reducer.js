const Reducer = (state, action) => {
    switch (action.type) {
        case 'SET_USER':
            return {
                ...state,
                user: action.payload
            };
        case 'SET_TOKEN':
            return {
                ...state,
                token: action.payload
            }
        case 'SET_LOGIN':
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token
            }
        case 'CLEAR_LOGIN':
            return {
                ...state,
                user: undefined,
                token: undefined
            }
        default:
            return state;
    }
};

export default Reducer;