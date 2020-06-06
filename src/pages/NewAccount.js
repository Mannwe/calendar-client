import React, { useState, useContext, useEffect }   from 'react'
import { Link }                                     from 'react-router-dom'

import AuthContext                                  from '../context/auth/AuthContext'
import AlertContext                                 from '../context/alerts/AlertContext'

const NewAccount = ({ history }) => {

    // States
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        confirm: ''
    })

    // Obtenemos el estado de los context
    const authContext = useContext(AuthContext)
    const { messageObject, done, authenticated, registerUser } = authContext

    const alertContext = useContext(AlertContext)
    const { alert, showAlert, hideAlert } = alertContext

    useEffect(() => {

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

    // Extracción de variables
    const { name, email, password, confirm } = user;

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
        if(name.trim() === '' || email.trim() === '' || password.trim() === ''){
            showAlert({
                message: 'Todos los campos son obligatorios', 
                type: 'alert-danger'
            })
            return
        }

        // La contraseña no puede tener menos de seis caracteres
        if(password.length < 6){
            showAlert({
                message: 'La contraseña tiene que tener como mínimo de seis caracteres', 
                type: 'alert-danger'
            })
            return
        }

        // Las contraseñas tienen que ser iguales
        if(password !== confirm){
            showAlert({
                message: 'Las contraseñas deben coincidir', 
                type: 'alert-danger'
            })
            return
        }
        
        // Guardamos usuario en bbdd
        registerUser({ name, email, password })
    }

    return (
        <div className='container'>
            <div className='login-box mt-5 bg-light p-5'>            
                <h1 className='text-center mb-4 text-secondary'>Registro</h1>
                <form
                    onSubmit={handleSubmit}
                >
                    <div className='row my-2 justify-content-center'>
                        <div className="input-group col-md-10">
                            <div className="input-group-prepend">
                                <div className="input-group-text"><i className="fa fa-user"></i></div>
                            </div>
                            <input 
                                onChange={handleChange}
                                className='form-control' 
                                type="text"
                                name='name'
                                placeholder='Introduce un nombre'
                                id='name'
                                value={name}
                            />                        
                        </div>
                    </div>
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
                                id='email'
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
                                id='signup-password'
                                value={password}
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
                                name='confirm'
                                placeholder='Confirma la contraseña'
                                id='signup-confirm'
                                value={confirm}
                            />
                        </div>
                    </div>
                    <div className='form-group row mt-3 mb-0 justify-content-center'>
                        <div className="col-md-10">
                            <button
                                type='submit'
                                className='btn btn-secondary btn-block'
                            >
                                Crear Cuenta
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
                    <div className='form-group row mt-3 mb-0 justify-content-center'>
                        <div className="col-md-10">
                            <Link   
                                to={'/'}
                                className='font-italic text-muted'
                            >
                                Iniciar sesión si ya está registrado
                            </Link>
                        </div>
                    </div>           
                </form>
            </div>
        </div>
    );
}
 
export default NewAccount;