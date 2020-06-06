import React, { useReducer }        from 'react';

import AlertReducer                 from './AlertReducer'
import AlertContext                 from './AlertContext'
import { SHOW_ALERT, HIDE_ALERT }   from '../../types'

const AlertState = props => {
    
    const initialState = {
        alert: null
    }

    // Extraemos el state y dispatch del reducer
    const [ state, dispatch ] = useReducer(AlertReducer, initialState)

    const { alert } = state

    const showAlert = alert => {
        dispatch({
            type: SHOW_ALERT,
            payload: alert
        })        
    }

    const hideAlert = () => {
        dispatch({
            type: HIDE_ALERT
        })
    }

    // Devolvemos un componente provider para que sea accesible por el resto de la aplicación
    return(
        <AlertContext.Provider
            value={{
                alert,
                showAlert,
                hideAlert
            }}
        >
            {props.children}
        </AlertContext.Provider>
    )
}
 
export default AlertState

