import React, { useContext, useEffect }         from 'react'
import styled                                   from 'styled-components'
import { Link }                                 from 'react-router-dom'

import './main.css'

import AuthContext                              from '../../context/auth/AuthContext'
import SheetContext                             from '../../context/sheet/SheetContext'
import AlertContext                             from '../../context/alerts/AlertContext'
import CalendarContext                          from '../../context/calendar/CalendarContext'
import ServiceContext                           from '../../context/service/ServiceContext'
import LoadingContext                           from '../../context/loading/LoadingContext'

/* Styled components para la cabecera */
const HeaderBar = styled.div`
    display: flex;
    justify-content: space-between; 
`

const Header = () => {

    // Obtenemos los states de los context
    const authContext = useContext(AuthContext)
    const { user, retrieveAuthenticatedUser, logout } = authContext

    const sheetContext = useContext(SheetContext)
    const { showSheetForm, showNewNote, selectNoteToEdit } = sheetContext
    
    const alertContext = useContext(AlertContext)
    const { hideAlert } = alertContext

    const calendarContext = useContext(CalendarContext)
    const { savePeriod } = calendarContext

    const serviceContext = useContext(ServiceContext)
    const { loadExamNotes, loadTaskNotes, loadOtherNotes, getSheets } = serviceContext

    const loadingContext = useContext(LoadingContext)
    const { setLoading } = loadingContext

    useEffect(() => {
        retrieveAuthenticatedUser()   
        // eslint-disable-next-line
    },[])

    const handleLogout = () => {

        // Cerramos todos los states
        const period = {
            year: 0,
            month: 0
        }
        showSheetForm(false)
        showNewNote(true)
        selectNoteToEdit(null)
        hideAlert()     
        savePeriod(period)
        loadExamNotes([])
        loadTaskNotes([])
        loadOtherNotes([])
        getSheets(period, 0)
        setLoading(false)

        logout()
    }

    return (
        <HeaderBar
            className='bg-dark text-light p-4 m-0 row'
        >
            <h3 className='col-md-6'>Calendario de Tareas</h3>
            <div className='col row justify-content-end'>
                {user 
                    ? 
                        (
                            <span className='col-md-2'><i className="fa fa-user"></i> {user.name}</span>
                        )
                    : null
                }
                <Link   
                    to={'/'}
                    className='btn-close'
                    onClick={handleLogout}
                >
                    Cerrar sesión
                </Link>
            </div>
        </HeaderBar>        
    );
}
 
export default Header;