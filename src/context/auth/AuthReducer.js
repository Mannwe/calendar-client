import { AUTHENTICATION_SUCCESS,
         AUTHENTICATION_ERROR,
         GET_USER_ERROR,
         GET_USER_SUCCESS,
         LOGOUT }            from '../../types'

export default (state, action) => {
    switch(action.type){
        case AUTHENTICATION_SUCCESS:
            localStorage.setItem('calendar-token', action.payload)

            return {
                ...state,
                messageObject: null,
                done: true,
                authenticated: true
            }
        case AUTHENTICATION_ERROR:
            localStorage.removeItem('calendar-token')
            return{
                ...state,
                messageObject: action.payload,
                done: true,
                authenticated: false
            }
        case GET_USER_SUCCESS:
            return{
                ...state,
                user: action.payload,
                authenticated: true
            }
        case GET_USER_ERROR:
            return{
                ...state,
                user: null
            }
        case LOGOUT:
            localStorage.removeItem('calendar-token')
            return{
                ...state,
                done: false,
                user: null,
                authenticated: false
            }
        default:
            return state
    }
}