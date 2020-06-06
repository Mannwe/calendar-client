import React, { useContext, useEffect, useState }       from 'react'
import styled                                           from 'styled-components'
import { Redirect }                                     from 'react-router-dom'

import CalendarContext                                  from '../context/calendar/CalendarContext'
import SheetForm                                        from '../components/sheet/SheetForm'
import ListOfNotes                                      from '../components/notes/ListOfNotes'
import SheetContext                                     from '../context/sheet/SheetContext'
import AlertContext                                     from '../context/alerts/AlertContext'
import LoadingContext                                   from '../context/loading/LoadingContext'
import ServiceContext                                   from '../context/service/ServiceContext'

import './Sheet.css'

// Styled component con el cuerpo de la hoja del calendario
const SheetWrapper = styled.div` 
    height: 60vh;
    background-color: white;    
    padding: 0px;

    span{
        line-height: 2.8rem;
    }

    i{
        line-height: 2.5rem;
    }

    ul{
        padding: 0px;
    }

    li{
        list-style: none;
    }

    .note{
        transition: all .3s ease;
    }

    .note{  
        &:hover{
            font-style: italic;
            font-weight: bold;
        }
    }
`
const Sheet = () => {

    // Estados locales
    const [ redirect, setRedirect ] = useState(false)

    // Obtenemos los estados del context
    const calendarContext = useContext(CalendarContext)
    const { period, selectedDay, monthName } = calendarContext

    const serviceContext = useContext(ServiceContext)
    const { examNotes, taskNotes, otherNotes, calendarSheets,
            loadExamNotes, loadTaskNotes, loadOtherNotes } = serviceContext

    const sheetContext = useContext(SheetContext)
    const { sheetFormVisible, showSheetForm, showNewNote, selectNoteToEdit } = sheetContext   

    const alertContext = useContext(AlertContext)
    const { hideAlert } = alertContext            

    const loadingContext = useContext(LoadingContext)
    const { loading, setLoading } = loadingContext

    const handleAdd = e => {
        e.preventDefault()

        showSheetForm(true)
        showNewNote(true)
        selectNoteToEdit(null)
    }

    // Obtenemos las notas correspondientes a la fecha seleccionada
    const dateToCompare = new Date(period.year, period.month - 1, selectedDay)
    let currentDateSheet = calendarSheets.find(sheet => 
        (sheet.date.getDate() === dateToCompare.getDate() &&
         sheet.date.getMonth() === dateToCompare.getMonth() &&
         sheet.date.getFullYear() === dateToCompare.getFullYear())
    )

    // Cuando renderizamos por primera vez, reseteamos valores
    useEffect(() => {        
        reset()     
        // eslint-disable-next-line  
    }, [])
    
    // Una vez se actualiza el state con las nuevas notas, las cargamos
    useEffect(() => {
        if(!currentDateSheet) {
            // eslint-disable-next-line
            currentDateSheet = {
                id: 0,
                date: new Date(),
                examNotes: [],
                taskNotes: [],
                otherNotes: []
            }
        }
        const { examNotes, taskNotes, otherNotes } = currentDateSheet
        
        if(examNotes.length > 0) loadExamNotes(examNotes)            
        if(taskNotes.length > 0) loadTaskNotes(taskNotes)
        if(otherNotes.length > 0) loadOtherNotes(otherNotes)        
    },[currentDateSheet])

    useEffect(() => {
        if(!loading) return
        
        setLoading(true) // Si ha habido cambios se produce un retraso que hay que controlar

        // eslint-disable-next-line
    }, [loading])

    const handleBackMain = () => {
        
        reset()
        setRedirect(true)        
    }

    const reset = () => {
        
        // Resetamos estados
        hideAlert()
        showNewNote(false)
        selectNoteToEdit(null)
        showSheetForm(false)
        loadExamNotes([])
        loadTaskNotes([])
        loadOtherNotes([])
    }

    if(!calendarSheets || calendarSheets.length === 0) return null

    if(!currentDateSheet) return null

    return (
        <>
            {redirect
            ?
                (
                    <Redirect 
                        to={{
                            pathname: '/main',
                            period: period
                        }}
                    />
                )
            :
            <>
                (
                    <SheetWrapper
                        className='sheet-container' 
                    >
                        <header className="bg-dark text-light p-4 m-0 row">
                            <h1 className='col-md-10'>{`${selectedDay} de ${monthName}`}</h1>
                            <div className='col-md-2 d-flex justify-content-end'>
                                <button 
                                    className='bg-transparent border-0'
                                    onClick={() => handleBackMain()}
                                >                    
                                    <i className="fa fa-home fa-2x text-light"></i>
                                    <span className='ml-1 text-light'> Volver</span>
                                </button>
                            </div>
                        </header>
                        <div 
                            className='p-2 row m-0 pt-4'
                            id="sheet-container"
                        >
                            <div className="col-md-4 text-justify">
                                {examNotes && examNotes.length > 0 
                                ?
                                    (
                                        <ListOfNotes 
                                            notes={examNotes}
                                            type='Exámenes' 
                                        />
                                    )
                                :null}
                            </div>
                            <div className="col-md-4 text-justify">
                                {taskNotes && taskNotes.length > 0 
                                ?
                                    (
                                        <ListOfNotes 
                                            notes={taskNotes}
                                            type='Tareas' 
                                        />
                                    )
                                    :null}  
                            </div>
                            <div className="col-md-4 text-justify">
                                {otherNotes && otherNotes.length > 0 
                                ?
                                    (
                                        <ListOfNotes 
                                            notes={otherNotes}
                                            type='Otros' 
                                        />
                                    )
                                    :null} 
                            </div>
                        </div>                         
                    </SheetWrapper>
                    <div className='sheet-container bg-light'>
                        <a href='#!'
                            className='float-right p-0 m-2 border-0'
                            onClick={handleAdd}
                        >
                            <i className="fa fa-plus-circle fa-3x text-secondary"></i>
                        </a>
                        <div className="clearfix"></div>
                    </div>
                    {sheetFormVisible 
                        ? 
                            (
                                <div className='sheet-container bg-dark px-5 pt-4 pb-1'>
                                    <SheetForm />
                                </div>
                            )
                        : null
                    }
                    )
                </>
            }
        </>
    )
}
 
export default Sheet