import { ADD_EXAM_NOTE,
         ADD_TASK_NOTE,
         ADD_OTHER_NOTE, 
         LOAD_EXAM_NOTES,
         LOAD_TASK_NOTES,
         LOAD_OTHER_NOTES,
         GET_NOTE_ERROR,
         LOAD_ALL_SHEETS,
         RESET_SHEETS_UPDATED }       from '../../types'

export default (state, action) => {
    switch (action.type) {
        case ADD_EXAM_NOTE:
            return{
                ...state,
                examNotes: [...state.examNotes, action.payload],
                sheetsUpdated: false
            }
        case ADD_TASK_NOTE:
            return{
                ...state,
                taskNotes: [...state.taskNotes, action.payload],
                sheetsUpdated: false
            }    
        case ADD_OTHER_NOTE:
            return{
                ...state,
                otherNotes: [...state.otherNotes, action.payload],
                sheetsUpdated: false
            }
        case LOAD_EXAM_NOTES:
            return{
                ...state,
                examNotes: action.payload,
                sheetsUpdated: false
            }
        case LOAD_TASK_NOTES:
            return{
                ...state,
                taskNotes: action.payload,
                sheetsUpdated: false
            }
        case LOAD_OTHER_NOTES:
            return{
                ...state,
                sheetsUpdated: false,
                otherNotes: action.payload
            }
        case GET_NOTE_ERROR:
            return{
                ...state,
                alertMessage: action.payload
            }    
        case LOAD_ALL_SHEETS:
            return{
                ...state,
                calendarSheets: action.payload,
                sheetsUpdated: true
            }
        case RESET_SHEETS_UPDATED:
            return{
                ...state,
                sheetsUpdated: false
            }
        default:
            break
    }
}