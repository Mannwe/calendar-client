import React, { useReducer }        from 'react'

import { ADD_EXAM_NOTE,
         ADD_TASK_NOTE,
         ADD_OTHER_NOTE, 
         GET_NOTE_ERROR,
         LOAD_ALL_SHEETS,
         LOAD_EXAM_NOTES,
         LOAD_TASK_NOTES,
         LOAD_OTHER_NOTES,
         RESET_SHEETS_UPDATED }     from '../../types'

import ServiceReducer               from './ServiceReducer'
import ServiceContext               from './ServiceContext'
import axiosClient                  from '../../config/axios'

const ServiceState = props => {

    const initialState = {
        examNotes: [],
        taskNotes: [],
        otherNotes: [],
        alertMessage: null,
        calendarSheets: [],
        sheetsUpdated: false
    }

    const [ state, dispatch ] = useReducer(ServiceReducer, initialState)
    const { examNotes, taskNotes, otherNotes, alertMessage, calendarSheets, sheetsUpdated } = state

    // Cargamos los arrays de notas de una hoja ya seleccionada
    const loadExamNotes = exams => {
        dispatch({
            type: LOAD_EXAM_NOTES,
            payload: exams
        })    
    }

    const loadTaskNotes = tasks => {
        dispatch({
            type: LOAD_TASK_NOTES,
            payload: tasks
        })    
    }

    const loadOtherNotes = others => {
        dispatch({
            type: LOAD_OTHER_NOTES,
            payload: others
        })    
    }

    // Guardamos las notas
    const addExamNote = async note => {
        try {
            const response = await axiosClient.post('/api/notes', note)
            dispatch({
                type: ADD_EXAM_NOTE,
                payload: response.data
            })    
        } catch (error) {
            console.log(error.response)            
            dispatch({
                type: GET_NOTE_ERROR,
                payload: {
                    message: error.response.data.msg,
                    type: 'alert-danger'
                }
            }) 
        }        
    }

    const addTaskNote = async note => {
        // Viene de mongodb - note.id = uuidv4() 
        try {
            const response = await axiosClient.post('/api/notes', note)
            dispatch({
                type: ADD_TASK_NOTE,
                payload: response.data
            })
        } catch (error) {
            console.log(error)
            dispatch({
                type: GET_NOTE_ERROR,
                payload: {
                    message: error.response.data.msg,
                    type: 'alert-danger'
                }
            }) 
        } 
    }

    const addOtherNote = async note => {
        // Viene de mongodb - note.id = uuidv4() 
        try {
            const response = await axiosClient.post('/api/notes', note)
            dispatch({
                type: ADD_OTHER_NOTE,
                payload: response.data
            })
        } catch (error) {
            console.log(error)
            dispatch({
                type: GET_NOTE_ERROR,
                payload: {
                    message: error.response.data.msg,
                    type: 'alert-danger'
                }
            }) 
        } 
    }

    const addAllExamNotes = async (notes, initialDate) => {
        // Viene de mongodb - note.id = uuidv4() 
        try {
            const response = await axiosClient.post('/api/notes/all', notes)
            /* El estado examNotes, taskNotes, etc. se refieren a las notas del día seleccionado,
               por lo que si hacemos carga masiva para varios días, sólo grabaremos el del primero */
            const updatedNotes = response.data
            const currentDateNote = updatedNotes.find(note => note.calendarDate === initialDate.toISOString()) 
            dispatch({
                type: ADD_EXAM_NOTE,
                payload: currentDateNote
            })
        } catch (error) {
            console.log(error)
            dispatch({
                type: GET_NOTE_ERROR,
                payload: {
                    message: error.response.data.msg,
                    type: 'alert-danger'
                }
            }) 
        } 
    }

    const addAllTaskNotes = async (notes, initialDate) => {
        // Viene de mongodb - note.id = uuidv4() 
        try {
            const response = await axiosClient.post('/api/notes/all', notes)
            /* El estado examNotes, taskNotes, etc. se refieren a las notas del día seleccionado,
               por lo que si hacemos carga masiva para varios días, sólo grabaremos el del primero */
            const updatedNotes = response.data
            const currentDateNote = updatedNotes.find(note => note.calendarDate === initialDate.toISOString()) 
            dispatch({
                type: ADD_TASK_NOTE,
                payload: currentDateNote
            })
            
        } catch (error) {
            console.log(error.response)
            dispatch({
                type: GET_NOTE_ERROR,
                payload: {
                    message: error.response.data.msg,
                    type: 'alert-danger'
                }
            }) 
        } 
    }

    const addAllOtherNotes = async (notes, initialDate) => {
        // Viene de mongodb - note.id = uuidv4() 
        try {
            const response = await axiosClient.post('/api/notes/all', notes)
            /* El estado examNotes, taskNotes, etc. se refieren a las notas del día seleccionado,
               por lo que si hacemos carga masiva para varios días, sólo grabaremos el del primero */
            const updatedNotes = response.data
            const currentDateNote = updatedNotes.find(note => note.calendarDate === initialDate.toISOString()) 
            dispatch({
                type: ADD_OTHER_NOTE,
                payload: currentDateNote
            })
        } catch (error) {
            console.log(error)
            dispatch({
                type: GET_NOTE_ERROR,
                payload: {
                    message: error.response.data.msg,
                    type: 'alert-danger'
                }
            }) 
        } 
    }

    // Guardamos notas existentes
    const updateExamNote = async note => {
        try {

            // Actualizamos
            await axiosClient.put(`/api/notes/${note._id}`, note)

            // Recuperamos las notas para mostrar las que correspondan por tipo
            const filter = note.calendarDate
            const response = await axiosClient.get(`/api/notes/${filter}`)

            const examNotes = response.data.notes.filter(note => note.type === 'Examen')

            dispatch({
                type: LOAD_EXAM_NOTES,
                payload: examNotes
            })
        } catch (error) {
            console.log(error.response)
            dispatch({
                type: GET_NOTE_ERROR,
                payload: {
                    message: error.response.data.msg,
                    type: 'alert-danger'
                }
            }) 
        } 
    }

    const updateTaskNote = async note => {
        // Viene de mongodb - note.id = uuidv4() 
        try {
            // Actualizamos
            await axiosClient.put(`/api/notes/${note._id}`, note)
            
            // Recuperamos las notas para mostrar las que correspondan por tipo
            const filter = note.calendarDate
            const response = await axiosClient.get(`/api/notes/${filter}`)

            const taskNotes = response.data.notes.filter(note => note.type === 'Tarea')
            dispatch({
                type: LOAD_TASK_NOTES,
                payload: taskNotes
            })
        } catch (error) {
            console.log(error.response)
            dispatch({
                type: GET_NOTE_ERROR,
                payload: {
                    message: error.response.data.msg,
                    type: 'alert-danger'
                }
            }) 
        } 
    }

    const updateOtherNote = async note => {
        // Viene de mongodb - note.id = uuidv4() 
        try {
            // Actualizamos
            await axiosClient.put(`/api/notes/${note._id}`, note)

            // Recuperamos las notas para mostrar las que correspondan por tipo
            const filter = note.calendarDate
            const response = await axiosClient.get(`/api/notes/${filter}`)

            const otherNotes = response.data.notes.filter(note => note.type === 'Otros')
            dispatch({
                type: LOAD_OTHER_NOTES,
                payload: otherNotes
            })
        } catch (error) {
            console.log(error.response)
            dispatch({
                type: GET_NOTE_ERROR,
                payload: {
                    message: error.response.data.msg,
                    type: 'alert-danger'
                }
            }) 
        }  
    }

    const deleteExamNote = async note => {
        try {
            // Borramos
            await axiosClient.delete(`/api/notes/${note._id}`, note)

            // Recuperamos las notas para mostrar las que correspondan por tipo
            const filter = note.calendarDate
            const response = await axiosClient.get(`/api/notes/${filter}`)

            const examNotes = response.data.notes.filter(note => note.type === 'Examen')
            dispatch({
                type: LOAD_EXAM_NOTES,
                payload: examNotes
            })
        } catch (error) {
            console.log(error.response)
            dispatch({
                type: GET_NOTE_ERROR,
                payload: {
                    message: error.response.data.msg,
                    type: 'alert-danger'
                }
            }) 
        }
    }

    const deleteTaskNote = async note => {
        try {
            // Borramos
            await axiosClient.delete(`/api/notes/${note._id}`, note)

            // Recuperamos las notas para mostrar las que correspondan por tipo
            const filter = note.calendarDate
            const response = await axiosClient.get(`/api/notes/${filter}`)

            const taskNotes = response.data.notes.filter(note => note.type === 'Tarea')
            dispatch({
                type: LOAD_TASK_NOTES,
                payload: taskNotes
            })
        } catch (error) {
            console.log(error.response)
            dispatch({
                type: GET_NOTE_ERROR,
                payload: {
                    message: error.response.data.msg,
                    type: 'alert-danger'
                }
            }) 
        }
    }

    const deleteOtherNote = async note => {
        try {
            // Borramos
            await axiosClient.delete(`/api/notes/${note._id}`, note)

            // Recuperamos las notas para mostrar las que correspondan por tipo
            const filter = note.calendarDate
            const response = await axiosClient.get(`/api/notes/${filter}`)

            const otherNotes = response.data.notes.filter(note => note.type === 'Otros')
            dispatch({
                type: LOAD_OTHER_NOTES,
                payload: otherNotes
            })
        } catch (error) {
            console.log(error.response)
            dispatch({
                type: GET_NOTE_ERROR,
                payload: {
                    message: error.response.data.msg,
                    type: 'alert-danger'
                }
            }) 
        }
    }

    const getSheets = async (period, lastDay) => {
        const sheets = []
        const { year, month } = period
        try {            
            for(let i = 1; i <= lastDay; i++){

                // Buscamos las notas, si las hay
                const calendarDate = new Date(year, month - 1, i)
                const filter = calendarDate.toISOString()
                const response = await axiosClient.get(`/api/notes/${filter}`)

                const examNotes = response.data.notes.filter(note => note.type === 'Examen')
                const taskNotes = response.data.notes.filter(note => note.type === 'Tarea')
                const otherNotes = response.data.notes.filter(note => note.type === 'Otros')

                const sheet = {
                    id: i,
                    date: calendarDate,
                    examNotes,
                    taskNotes,
                    otherNotes
                }

                sheets.push(sheet)
            }
            dispatch({
                type: LOAD_ALL_SHEETS,
                payload: sheets
            })
        } catch (error) {
            console.log(error.response)
        }        
    }

    // Para inicializar el state sheetsUpdated, necesario en algunos componentes
    const resetSheetsUpdated = () => {
        dispatch({
            type: RESET_SHEETS_UPDATED
        })
    }

    return (
        <ServiceContext.Provider
            value={{
                examNotes,
                taskNotes,
                otherNotes,
                alertMessage,
                calendarSheets,
                sheetsUpdated,
                addExamNote,
                addTaskNote,
                addOtherNote,
                updateExamNote,
                updateTaskNote,
                updateOtherNote,
                deleteExamNote,
                deleteTaskNote,
                deleteOtherNote,
                addAllExamNotes,
                addAllTaskNotes,
                addAllOtherNotes,
                loadExamNotes,
                loadTaskNotes,
                loadOtherNotes,
                getSheets,
                resetSheetsUpdated
            }}
        >
            {props.children}
        </ServiceContext.Provider>
    )
}

export default ServiceState
