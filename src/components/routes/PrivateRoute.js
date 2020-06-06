import React, { useContext, useEffect }     from 'react'
import { Route, Redirect }                  from 'react-router-dom'
import AuthContext                          from '../../context/auth/AuthContext'

const PrivateRoute = ({ component: Component, ...props }) => {

    const authContext = useContext(AuthContext)
    const { authenticated, retrieveAuthenticatedUser } = authContext

    useEffect(() => {
        retrieveAuthenticatedUser()
        // eslint-disable-next-line
    }, [])

    return (
        <Route {...props } render={ props => !authenticated ? 
            (
                <Redirect to={'/'} />
            )
            : 
            (
                 <Component {...props} />
            )}
        />
    )
}

export default PrivateRoute