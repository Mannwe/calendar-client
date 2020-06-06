import { SAVE_PERIOD, 
         SET_SELECTED_DAY }        from '../../types'

export default (state, action) => {
    switch(action.type){
        case SAVE_PERIOD:
            return{
                ...state,
                period: action.payload.period,
                monthName:action.payload.monthName,
                lastDay: action.payload.lastDay,
            }
        /*case SET_MONTH_NAME:
            return{
                ...state,
                monthName: action.payload
            }*/
        case SET_SELECTED_DAY:
            return{
                ...state,
                selectedDay: action.payload
            }
        /*case SAVE_CALENDAR_SHEETS:
            return{
                ...state,
                calendarSheets: action.payload
            }
        case RESET_SHEETS_LOADED:
            return{
                ...state
            }
        case LAST_MONTH_DAY:
            return{
                ...state,
                lastDay: action.payload
            }*/
        default:
            return state    
    }
}