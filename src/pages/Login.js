import React, { useState, useContext, useEffect }       from 'react'
import { Link }                                         from 'react-router-dom'

import AuthContext                                      from '../context/auth/AuthContext'
import AlertContext                                     from '../context/alerts/AlertContext'
import LoadingContext                                   from '../context/loading/LoadingContext'
import ServiceContext                                   from '../context/service/ServiceContext'

const Login = ({ history }) => {

    // Estados locales del formulario
    const [user, setUser] = useState({
        email: '',
        password: ''
    })
    
    // Obtenemos el estado de los context
    const authContext = useContext(AuthContext)
    const { messageObject, done, authenticated, login } = authContext

    const alertContext = useContext(AlertContext)
    const { alert, showAlert, hideAlert } = alertContext

    const loadingContext = useContext(LoadingContext)
    const { setLoading } = loadingContext
    
    const serviceContext = useContext(ServiceContext)
    const { resetSheetsUpdated } = serviceContext

    // Extracción de variables
    const { email, password } = user

    useEffect(() => {   

        setLoading(true)
        resetSheetsUpdated()

        if(authenticated){
            history.push('/main')
        }

        if(!done) return

        // Si se ha grabado un mensaje de alerta en AuthState mostramos la alerta
        if(messageObject){
            showAlert({
                message: messageObject.text, 
                type: messageObject.messageType
            })
            return
        }
        /* Con el state done, sólo ejecutamos hideAlert una vez ha concluido el intento
           de registro. De esa forma evitamos los flashes producidos al ejecutar hideAlert()
           tras las validaciones en el cliente y luego el showAlert() si hay error desde
           el servidor */
        hideAlert()           
        // eslint-disable-next-line
    }, [done, authenticated])

    // Guardamos usuario en el state
    const handleChange = e => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = e => {
        e.preventDefault()

        // Validamos que datos en blanco
        if(email.trim() === '' || password.trim() === ''){
            showAlert('Todos los campos son obligatorios', 'alert-danger')
            return
        }      

        // Iniciamos sesión
        login({
            email,
            password
        })
    }

    return (
        <div className='container'>
            <div className='login-box mt-5 bg-light p-5'>            
                <h1 className='text-center mb-4 text-secondary'>Inicio de Sesión</h1>
                <form
                    onSubmit={handleSubmit}
                >
                    <div className='row my-2 justify-content-center'>
                        <div className="input-group col-md-10">
                            <div className="input-group-prepend">
                                <div className="input-group-text">@</div>
                            </div>
                            <input 
                                onChange={handleChange}
                                className='form-control' 
                                type="text"
                                name='email'
                                placeholder='Introduce un e-mail'
                                id='login-email'
                                value={email}
                            />                        
                        </div>
                    </div>
                    <div className='row my-2 justify-content-center'>
                        <div className="input-group col-md-10">
                            <div className="input-group-prepend">
                                <div className="input-group-text"><i className="fa fa-lock"></i></div>
                            </div>
                            <input 
                                onChange={handleChange}
                                className='form-control' 
                                type="password"
                                name='password'
                                placeholder='Introduce una contraseña'
                                id='login-password'
                                value={password}
                            />
                        </div>
                    </div>
                    <div className='form-group row mt-3 mb-0 justify-content-center'>
                        <div className="col-md-10">
                            <button
                                type='submit'
                                className='btn btn-secondary btn-block'
                            >
                                Iniciar Sesión
                            </button>
                        </div>
                    </div>
                    {alert
                        ? 
                            (
                                <div className='form-group row mt-3 mb-0 justify-content-center'>
                                    <div className="col-md-10">
                                        <div 
                                            className={`alert ${alert.type}`}
                                            role="alert"
                                        >
                                            {alert.message}
                                        </div>
                                    </div>
                                </div>
                            )
                        : null
                    } 
                    <div className='form-group row mt-3 mb-0 justify-content-center '>
                        <div className="col-md-10">
                        <Link   
                            to={'new-account'}
                            className='font-italic text-muted'
                        >
                            Crea una nueva cuenta
                        </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
 
export default Login;