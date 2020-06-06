import React, { useReducer }        from 'react';

import { AUTHENTICATION_SUCCESS,
         AUTHENTICATION_ERROR,
         GET_USER_ERROR,
         GET_USER_SUCCESS,
         LOGOUT }                   from '../../types'
import AuthContext                  from './AuthContext'
import AuthReducer                  from './AuthReducer'
import axiosClient                  from '../../config/axios'
import authToken                    from '../../config/authToken'

const AuthState = props => {

    // Estado inicial para el state
    const initialState = {
        user: null,
        messageObject: null,
        done: false,
        authenticated: false,
    }

    // Extraemos el state y dispatch del reducer
    const [ state, dispatch ] = useReducer(AuthReducer, initialState)
    const { user, done, authenticated, messageObject } = state

    // Funciones de autenticación
    const registerUser = async formUser => {
        try {
            const response = await axiosClient.post('/api/users', formUser)
            dispatch({
                type: AUTHENTICATION_SUCCESS,
                payload: response.data.token
            })
            retrieveAuthenticatedUser()
        } catch (error) {
            dispatch({
                type: AUTHENTICATION_ERROR,
                payload: {
                    text: error.response.data.msg,
                    messageType: 'alert-danger'
                }
            })
        }
    }

    const retrieveAuthenticatedUser = async () => {
        const token = localStorage.getItem('calendar-token')
        if(token){
            // Guardamos el token en la cabecera de Content-Type x-auth-token
            authToken(token)
        }
        
        try {
            const response = await axiosClient.get('/api/users')
            dispatch({
                type: GET_USER_SUCCESS,
                payload: response.data.user
            })
        } catch (error) {
            console.log(error.response)
            dispatch({
                type: GET_USER_ERROR,
                payload: {
                    text: error.response.data.msg,
                    messageType: 'alert-danger'
                }
            })
        }
    }

    const login = async formUser => {
        try {
            const response = await axiosClient.post('/api/auth', formUser)
            dispatch({
                type: AUTHENTICATION_SUCCESS,
                payload: response.data.token
            })
            retrieveAuthenticatedUser()
        } catch (error) {
            dispatch({
                type: AUTHENTICATION_ERROR,
                payload: {
                    text: error.response.data.msg,
                    messageType: 'alert-danger'
                }
            })
        }
    }

    const logout = () => {
        dispatch({
            type: LOGOUT            
        })
    }

    return(
        <AuthContext.Provider
            value={{
                user,
                done,
                authenticated,
                messageObject,
                retrieveAuthenticatedUser,
                registerUser,
                login,
                logout
            }}
        >
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthState