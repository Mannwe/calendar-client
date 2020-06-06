import { GET_CURRENT_NOTE,
         SHOW_SHEET_FORM,
         SHOW_NEW_NOTE }             from '../../types'

export default (state, action) => {
    switch(action.type){
        case GET_CURRENT_NOTE:
            return{
                ...state,
                currentNote: action.payload
            }
        case SHOW_SHEET_FORM:
            return{
                ...state,
                sheetFormVisible: action.payload
            }
        case SHOW_NEW_NOTE:
            return{
                ...state,
                newNote: action.payload
            }
        default:
            return state
    }
}