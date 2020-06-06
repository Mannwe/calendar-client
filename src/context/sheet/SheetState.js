import React, { useReducer }            from 'react'
// Viene de mongodb - import { v4 as uuidv4 }          from 'uuid'

import { GET_CURRENT_NOTE,
         SHOW_SHEET_FORM,
         SHOW_NEW_NOTE}                 from '../../types'

import SheetReducer                     from './SheetReducer'
import SheetContext                     from './SheetContext'

const SheetState = props => {

    const initialState = {
        currentNote: null,
        newNote: false,
        sheetFormVisible: false
    }
    const [ state, dispatch ] = useReducer(SheetReducer, initialState)

    // Extraemos las variables del contexto
    const { currentNote, newNote, sheetFormVisible } = state

    
    // Selección de la nota a modificar
    const selectNoteToEdit = note => {
        dispatch({
            type: GET_CURRENT_NOTE,
            payload: note
        })
    }

    // Controlamos cuándo mostrar el formulario de la hoja
    const showSheetForm = show => {
        dispatch({
            type: SHOW_SHEET_FORM,
            payload: show
        })
    }

    // Controlamos cuando hacemos clic en el botón de agregar nota
    const showNewNote = show => {
        dispatch({
            type: SHOW_NEW_NOTE,
            payload: show
        })
    }

    return (
        <SheetContext.Provider
            value={{
                currentNote,
                newNote,
                sheetFormVisible,
                selectNoteToEdit,
                showSheetForm,
                showNewNote
            }}
        >
            {props.children}
        </SheetContext.Provider>
    )

}
 
export default SheetState;
