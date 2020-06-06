import axiosClient              from './axios'

// Función que guardará el token de autenticación en el header de los requests
const authToken = token => {
    if(token){
        axiosClient.defaults.headers.common['x-auth-token'] = token
    }else{
        delete axiosClient.defaults.headers.common['x-auth-token']
    }
}

export default authToken