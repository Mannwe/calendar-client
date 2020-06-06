import React, { useContext }    from 'react';

import SheetContext             from '../../context/sheet/SheetContext'
import AlertContext             from '../../context/alerts/AlertContext'      
import ServiceContext           from '../../context/service/ServiceContext'
import LoadingContext           from '../../context/loading/LoadingContext'

import './Notes.css'

const Note = ({ note }) => {

    // Extraemos los estados de  los contextos
    const sheetContext = useContext(SheetContext)
    const { selectNoteToEdit, showSheetForm, showNewNote } = sheetContext

    const serviceContext = useContext(ServiceContext)            
    const { deleteExamNote, deleteTaskNote, deleteOtherNote,
            updateExamNote, updateTaskNote, updateOtherNote } = serviceContext

    const loadingContext = useContext(LoadingContext)            
    const { setLoading } = loadingContext
    
    const alertContext = useContext(AlertContext)
    const { hideAlert } = alertContext
        
    const { text } = note

    const reset = () => {
        showNewNote(false)
        selectNoteToEdit(null)
        showSheetForm(false)
        hideAlert() // Si hubiera alerta, la eliminamos
    }

    const handleClick = () => {
        // Sólo permitimos actualizar las notas not completadas
        if(!note.completed){

            /* Para que no salte el warning de componente no controlado,
               tenemos que darle un valor inicial a todos las variables
               del estado note de SheetForm. El valor de repeatTo no viene
               de la base de datos, por lo que hay que asignárselo aquí */
            note.repeatTo = ''

            hideAlert() // Primero ocultamos alertas
            selectNoteToEdit(note)
            showSheetForm(true)
            showNewNote(false)            
        }else{
            // Reseteamos valores y volvemos al estado inicial de la hoja
            reset()    
        }
    }

    const handleComplete = () => {
        note.completed = !note.completed

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

        // Reseteamos valores y volvemos al estado inicial de la hoja
        reset()
    }

    const handleDelete = () => {

        // Cargamos el state de cargando...
        setLoading(true)
        
        switch(note.type){
            case 'Examen':
                deleteExamNote(note)
                break
            case 'Tarea':
                deleteTaskNote(note)
                break
            case 'Otros':
                deleteOtherNote(note)
                break
            default:
                break
        }

        // Reseteamos valores y volvemos al estado inicial de la hoja
        reset()
    }

    return (
        <li className='row'>
            <span
                title={note.completed ? 'Para modificar la nota primero debes reabrirla' : 'Pulsa para modificar la nota'}
                className={`note col-md-10 ${note.completed ? 'note-completed' : 'text-dark'}`}
                onClick={handleClick}
            >{text}            
            </span>
            <span className='action-btn col px-0'>
                <button
                    title={note.completed ? `Reabrir la nota` : 'Marcar la nota como completada'}
                    className='btn bg-transparent px-1 py-0'
                    onClick={handleComplete}
                >
                    {note.completed 
                    ?
                        <i className="fa fa-undo text-secondary float-right"></i>
                    :
                        <i className="fa fa-check text-success float-right"></i>
                    }
                </button> 
                <button
                    title='Eliminar la nota'
                    className='btn bg-transparent px-1 py-0'
                    onClick={handleDelete}
                >
                    <i className="fa fa-trash text-danger float-right"></i>
                </button>
            </span>
        </li>
    );
}
 
export default Note;