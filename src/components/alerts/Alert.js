import React, { useContext, useEffect }     from 'react'

import AuthContext                          from '../../context/auth/AuthContext'

/*const Alert = ({ message, alertType }) => {*/
const Alert = () => {    

    // Obtenemos el state del context
    const authContext = useContext(AuthContext)
    const { alert } = authContext
    const { message, type } = alert

    // Si se ha actualizado una alerta, mostraremos el mensaje
    useEffect(() => {
        if(alert){
            console.log(message, type)
        }
    },[alert])

    return (
        <div 
            className={`alert ${type}`} 
            role="alert"
        >
            {message}
        </div>
    );
}
 
export default Alert;