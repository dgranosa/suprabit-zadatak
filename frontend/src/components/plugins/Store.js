import React, {createContext, useReducer} from "react";
import Reducer from '../functions/Reducer';

const initialState = {
    user: undefined,
    token: undefined,
};

const Store = ({children}) => {
    const [state, dispatch] = useReducer(Reducer, initialState);
    return (
        <Context.Provider value={[state, dispatch]}>
            {children}
        </Context.Provider>
    )
};

export const Context = createContext(initialState);
export default Store;