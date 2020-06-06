import React, { useReducer }            from 'react'

import { SAVE_PERIOD, 
         SET_SELECTED_DAY }             from '../../types'
import CalendarReducer                  from './CalendarReducer'         
import CalendarContext                  from './CalendarContext'

const CalendarState = props => {

    // Estado inicial para el reducer
    const initialState = {
        period:{
            year: 0,
            month: 0
        },
        selectedDay: 0,
        monthName: '',
        lastDay: 0,
        sheets: false
    }

    // Dispatch para ejecutar las acciones
    const [ state, dispatch ] = useReducer(CalendarReducer, initialState)

    // Extraemos los valores del state
    const { period, monthName, lastDay, selectedDay } = state

    // Guardamos en el state el year y month seleccionados
    const savePeriod = period => {
        
        if(!period) return
        
        const { year, month } = period

        let monthName = '', lastDay = 0

        // Obtenemos el nombre del mes una vez conocido el período
        if(period && year !== 0 && month !== 0){ 
            switch(period.month){
                case 1:
                    monthName = 'Enero'
                    break
                case 2:
                    monthName = 'Febrero'
                    break
                case 3:
                    monthName = 'Marzo'
                    break
                case 4:
                    monthName = 'Abril'
                    break
                case 5:
                    monthName = 'Mayo'
                    break
                case 6:
                    monthName = 'Junio'
                    break
                case 7:
                    monthName = 'Julio'    
                    break
                case 8:
                    monthName = 'Agosto'
                    break
                case 9:
                    monthName = 'Septiembre'
                    break
                case 10:
                    monthName = 'Octubre'
                    break
                case 11:
                    monthName = 'Noviembre'
                    break
                case 12:
                    monthName = 'Diciembre'
                    break
                default:
                    monthName = ''
                    break
            }
        }

        // Obtenemos el último día del mes
        if(monthName === ''){
             lastDay = 0
        }else{
            if(monthName === 'Enero' || monthName === 'Marzo' || monthName === 'Mayo' || monthName === 'Julio' ||
            monthName === 'Agosto' || monthName === 'Octubre' || monthName === 'Diciembre'){
                lastDay = 31
            }else if(monthName === 'Febrero'){
                year % 4 === 0 ? lastDay = 29 : lastDay = 28 // En los bisiestos febrero tiene 29 días
            }else{
                lastDay = 30
            }
        }

        // Cargamos todas las varaibles en el state del contexto
        dispatch({
            type: SAVE_PERIOD,
            payload: {
                period: period,
                monthName: monthName,
                lastDay: lastDay
            }
        })
    }

    // Asignamos el día seleccionado en el calendario
    const setSelectedDay = day => {
        dispatch({
            type: SET_SELECTED_DAY,
            payload: day
        })
    }

    // Reseteamos la notificación de que la carga de hojas ha finalizado
    /*const resetSheetsLoaded = () => {
        dispatch({
            type: RESET_SHEETS_LOADED
        })
    }*/

    /**************
    const getSheets = async () => {
        try {
            const sheets = []
            for(let i = 1; i <= lastDay; i++){

                // Buscamos las notas, si las hay
                const calendarDate = new Date(period.year, period.month - 1, i)
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
                type: SAVE_CALENDAR_SHEETS,
                payload: sheets
            })
        } catch (error) {
            console.log(error.response)
        }        
    }
    ***************/

    // Devolvemos un componente provider para que sea accesible por el resto de la aplicación
    return (
        <CalendarContext.Provider
            value={{
                period,
                monthName,
                lastDay,
                selectedDay,
                savePeriod,
                setSelectedDay
            }}
        >
            {props.children}
        </CalendarContext.Provider>
    )
}

export default CalendarState