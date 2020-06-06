import React, { useState, useContext, useEffect }           from 'react'
import './Sheet.css'

import SheetContext                                         from '../../context/sheet/SheetContext'
import AlertContext                                         from '../../context/alerts/AlertContext'
import CalendarContext                                      from '../../context/calendar/CalendarContext'
import LoadingContext                                       from '../../context/loading/LoadingContext'
import ServiceContext                                       from '../../context/service/ServiceContext'

const SheetForm = () => {

    // Recuperamos los states de los contextos
    const sheetContext = useContext(SheetContext)
    const { currentNote, newNote, sheetFormVisible,  
            selectNoteToEdit, showSheetForm, showNewNote } = sheetContext

    const serviceContext = useContext(ServiceContext)    
    const { alertMessage, addExamNote, addTaskNote, addOtherNote, 
            updateExamNote, updateTaskNote, updateOtherNote,
            addAllTaskNotes, addAllExamNotes, addAllOtherNotes } = serviceContext

    const alertContext = useContext(AlertContext)
    const { alert, showAlert, hideAlert } = alertContext

    const calendarContext = useContext(CalendarContext)
    const { period, selectedDay } = calendarContext

    const loadingContext = useContext(LoadingContext)
    const { setLoading } = loadingContext

    // Estados locales del formulario
    const [ note, setNote ] = useState({
        id: '',
        type: '',
        text: '',
        repeat: false,
        repeatTo: ''
    })

    const [ repeatingPeriod, setRepeatingPeriod ] = useState({})

    // Extraemos variables del estado
    const { type, text, repeat, repeatTo } = note
    const { daily, weekly, monthly } = repeatingPeriod

    const clearNote = () => {
        setNote({
            id: '',
            type: '',
            text: '',
            repeat: false,
            repeatTo: ''            
        })
    }

    const clearRepeatingPeriod = () => {
        setRepeatingPeriod({})
    }

    useEffect(() => {
        if(currentNote){
            setNote(currentNote)
        }
        showSheetForm(sheetFormVisible)

        if(newNote){
            clearNote()            
            clearRepeatingPeriod()
        }
        // eslint-disable-next-line
    }, [currentNote, newNote, sheetFormVisible ])

    useEffect(() => {
        if(!alertMessage) return

        showAlert({
            message: alertMessage.message, 
            type: alertMessage.type
        })
        // eslint-disable-next-line
    }, [alertMessage])

    // Funciones para manejar los eventos
    const handleChange = e => {
        setNote({
            ...note,
            [e.target.name]: e.target.name === 'repeat' ? e.target.checked : e.target.value
        })
    }

    const handleChecked = e => {
        setRepeatingPeriod({
            [e.target.id]: e.target.checked
        })
    }

    const handleSubmit = e => {
        e.preventDefault()

        // Validamos los campos de entrada
        if(type.trim() === '' || text.trim() === ''){
            showAlert({
                message: 'Todos los campos son obligatorios', 
                type: 'alert-danger'
            })
            return
        }

        const initialDate = new Date(period.year, period.month - 1, selectedDay)

        const arrayNotes = []
        /* Si se ha seleccionado repeat, validamos que se haya introducido los parámetros de repetición
           y añadimos las notas para las nuevas fechas */
        if(repeat){
            if(!repeatTo || repeatTo === ''){
                showAlert({
                    message: 'Introduce el período final de la repetición de la nota', 
                    type: 'alert-danger'
                })
                return
            }

            if(Object.keys(repeatingPeriod).length === 0){
                showAlert({
                    message: 'Selecciona el período de repetición de la nota', 
                    type: 'alert-danger'
                })
                return
            }

            const repeatToDate = new Date(repeatTo)
            if(initialDate >= repeatToDate){
                showAlert({
                    message: 'La fecha final de la repetición de la nota no puede ser anterior o igual al día actual', 
                    type: 'alert-danger'
                })
                return
            }

            const differenceBetweenDates = repeatToDate - initialDate
            const differenceBetweenDatesInDays = Math.ceil(differenceBetweenDates / (1000 * 60 * 60 * 24))
            let daysOffset = 1 // Inicialmente, tomaremos como un día la diferencia. Si el período es semanal o mensual, lo cambiaremos

            if(weekly){
                if(differenceBetweenDatesInDays < 7){
                    showAlert({
                        message: 'Introduce una fecha final de la repetición de la nota superior a siete días desde el día actual', 
                        type: 'alert-danger'
                    })
                    return
                }
                daysOffset = 7
            }

            if(monthly){
                if(differenceBetweenDatesInDays < 30){
                    showAlert({
                        message: `Introduce una fecha final de la repetición de la nota superior a treinta días desde el día actual`, 
                        type: 'alert-danger'
                    })
                    return
                }
                daysOffset = 30
            }

            // Guardamos un array de notas que luego guardaremos en bloque
            note.calendarDate = initialDate
            arrayNotes.push(note)

            // Generamos el resto del array con todos los días desde el siguiente al actual hasta el último de la repetición
            for(let days = daysOffset; days < differenceBetweenDatesInDays; days = days + daysOffset){
                let newNote = {...note} // Tomamos una copia del objeto para añadir al array
                newNote.calendarDate = new Date(Number(initialDate))
                newNote.calendarDate = new Date(newNote.calendarDate.setDate(newNote.calendarDate.getDate() + days))

                arrayNotes.push(newNote)
            }

            // Guardamos el array con las repeticiones en la base de datos
            saveAllNotes(arrayNotes, initialDate)
        }else{
            /* En caso de que no haya repetición:
               Añadimos la fecha seleccionada y guardamos la nota en la base de datos */
            note.calendarDate = initialDate
            saveNote(note)
        }

        // En caso de que no haya error
        if(!alertMessage){
            /* Eliminamos la tarea actual para resetear el formulario y no 
            persista el modo edición */
            selectNoteToEdit(null)
        
            // Inicializamos formulario
            clearNote()
            clearRepeatingPeriod()

            // Reseteamos estados
            showSheetForm(false)
            showNewNote(false)
        }
    }

    // Guardamos el array de notas cuando se hace un submit con repeat
    const saveAllNotes = (notes, initialDate) => {

        if(!notes) return

        // Primero averiguamos el tipo de nota del bloque
        const type = notes[0].type
        if(!type) return

        // Cargamos el state de cargando...
        setLoading(true)
        
        switch(type){
            case 'Examen':
                addAllExamNotes(notes, initialDate)
                break
            case 'Tarea':
                addAllTaskNotes(notes, initialDate)
                break  
            case 'Otros':
                addAllOtherNotes(notes, initialDate)
                break  
            default:
                break
        }
    }

    const saveNote = note => {

        // Cargamos el state de cargando...
        setLoading(true)
        
        // Guardamos la nota
        if(currentNote){
            switch(note.type){
                case 'Examen':
                    updateExamNote(note)
                    break
                case 'Tarea':
                    updateTaskNote(note)
                    break  
                case 'Otros':
                    updateOtherNote(note)
                    break     
                default:
                    break 
            }
        }else{
            switch(type){
                case 'Examen':
                    addExamNote(note)
                    break
                case 'Tarea':
                    addTaskNote(note)
                    break  
                case 'Otros':
                    addOtherNote(note)
                    break
                default:
                    break      
            }
        }
    }

    const handleHide = e => {
        e.preventDefault()

        showSheetForm(false)
        showNewNote(false)
        selectNoteToEdit(null)
        hideAlert()
    }

    if(!sheetFormVisible) return null

    return (
        <>
            <form 
                className="form-group"
                onSubmit={handleSubmit}
            >
                <div className="row justify-content-end">
                    <a href='#!' 
                    className='text-light h3 p-0 m-0 float-right'
                    id='hide-form'
                    onClick={handleHide}
                    >&times;</a>
                </div>
                <div className='row mb-2'>
                    <select 
                        className='form-control form-control-sm text-dark col-md-3'
                        onChange={handleChange}
                        name='type'
                        value={type}
                    >
                        <option> --Selecciona el Tipo--</option>
                        <option>Tarea</option>
                        <option>Examen</option>
                        <option>Otros</option>
                    </select>                    
                    <div className='col row'>
                        <label 
                            htmlFor='text'
                            className='d-block text-right col-form-label-sm text-light col-md-2'
                        >
                            Apunte:
                        </label>
                        <input 
                            type="text"
                            className='form-control form-control-sm col ml-1'
                            name='text'
                            id='text'
                            value={text}
                            onChange={handleChange}
                        />                    
                    </div>
                </div>                
                <div className='row'>
                    <div className='form-check col-md-3'>
                        <input 
                            className='form-control-sm form-check-input' 
                            type='checkbox'
                            id='repeat'
                            name='repeat'
                            value={repeat}
                            onChange={handleChange}
                        />
                        <label
                            className='col-form-label-sm form-check-label text-light mt-1'
                            htmlFor='repeat'                            
                        >
                            Repetir
                        </label>
                    </div>
                    {repeat 
                    ?
                        (
                            <div className='form-group col row mb-0'>
                                <label
                                    className='d-block text-right col-form-label-sm text-light col-md-2'
                                    htmlFor='repeatTo'
                                >
                                    Repetir Hasta:
                                </label>
                                <input
                                    type='date'
                                    className='form-control form-control-sm col-md-3 ml-1'
                                    name='repeatTo'
                                    value={repeatTo}
                                    onChange={handleChange}
                                />
                                <div className="row col justify-content-center">
                                    <div className="custom-control-inline custom-radio text-light">
                                        <input 
                                            type="radio"
                                            name='periodicity'
                                            className='custom-control-input'
                                            id='daily'
                                            value={daily}
                                            onChange={handleChecked}
                                        />
                                        <label 
                                            htmlFor="daily"
                                            className='custom-control-label mr-4'
                                        >Diariamente</label>
                                    </div>
                                    <div className="custom-control-inline custom-radio text-light">
                                        <input 
                                            type="radio"
                                            name='periodicity'
                                            className='custom-control-input'
                                            id='weekly'
                                            value={weekly}
                                            onChange={handleChecked}
                                        />
                                        <label 
                                            htmlFor="weekly"
                                            className='custom-control-label mr-4'
                                        >Semanalmente</label>
                                    </div>
                                    <div className="custom-control-inline custom-radio text-light">
                                        <input 
                                            type="radio"
                                            name='periodicity'
                                            className='custom-control-input'
                                            id='monthly'
                                            value={monthly}
                                            onChange={handleChecked}
                                        />
                                        <label 
                                            htmlFor="monthly"
                                            className='custom-control-label mr-4'
                                        >Mensualmente</label>
                                    </div>
                                </div>
                            </div>
                        )
                    : null
                    }                    
                </div>
                <div className='row mt-2'>
                {currentNote 
                    ?
                        (
                            <button
                                type='submit'
                                className='btn btn-light btn-sm form-control col-md-2 offset-md-10'
                                onSubmit={handleSubmit}
                            >
                                Editar
                            </button>
                        )
                    :
                        (
                            <button
                                type='submit'
                                className='btn btn-light btn-sm form-control col-md-2 offset-md-10'
                                onSubmit={handleSubmit}
                            >
                                Nuevo
                            </button>
                        )
                    }
                </div>
                {alert && Object.keys(alert).length !== 0
                    ? 
                        (
                            <div className='row mt-3'>
                                <div className="col-md-12 p-0">
                                    <div 
                                        className={`alert mb-0 ${alert.type}`}
                                        role="alert"
                                    >
                                        {alert.message}
                                    </div>
                                </div>
                            </div>
                        )
                    : null
                }
            </form>
            <div className="clearfix"></div>
        </>
    );
}
 
export default SheetForm;