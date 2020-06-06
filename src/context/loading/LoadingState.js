import React, { useReducer }    from 'react'

import { LOADING }              from '../../types/index'

import LoadingContext           from './LoadingContext'
import LoadingReducer           from './LoadingReducer'

const LoadingState = props => {

    const initialState = {
        loading: true
    }

    // Creamos el context
    const [ state, dispatch ] = useReducer(LoadingReducer, initialState)

    // Extraemos variables
    const { loading } = state

    const setLoading = loading => {
        dispatch({
            type: LOADING,
            payload: loading
        })
    }

    return(
        <LoadingContext.Provider
            value={{
                loading,
                setLoading
            }}
        >
            {props.children}
        </LoadingContext.Provider>
    )
}

export default LoadingState