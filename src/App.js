import React                                        from 'react';
import { BrowserRouter as Router, Switch, Route }   from 'react-router-dom'

import Login                                        from './pages/Login'
import NewAccount                                   from './pages/NewAccount'
import Main                                         from './pages/Main'
import CalendarState                                from './context/calendar/CalendarState'
import Sheet                                        from './pages/Sheet'
import Loading                                      from './components/loading/Loading'
import SheetState                                   from './context/sheet/SheetState'
import AuthState                                    from './context/auth/AuthState'
import AlertState                                   from './context/alerts/AlertState'
import LoadingState                                 from './context/loading/LoadingState'
import ServiceState                                 from './context/service/ServiceState'
import PrivateRoute                                 from './components/routes/PrivateRoute'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.min.css'

function App() {
    return (
        <>
            <AlertState>
                <AuthState>
                    <CalendarState>
                        <SheetState>
                            <LoadingState>
                                <ServiceState>
                                    <Router>
                                        <Switch>
                                            <Route exact path='/' component={Login} />
                                            <Route exact path='/login' component={Login} />
                                            <Route exact path='/new-account' component={NewAccount} />
                                            <PrivateRoute exact path='/main' component={Main} />
                                            <PrivateRoute exact path='/sheet' component={Sheet} />
                                            <Route exact path='/loading' component={Loading} />
                                        </Switch>
                                    </Router> 
                                </ServiceState>
                            </LoadingState>
                        </SheetState>
                    </CalendarState>
                </AuthState>
            </AlertState>
        </>
    );
}

export default App;
