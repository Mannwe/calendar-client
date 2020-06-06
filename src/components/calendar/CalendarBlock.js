import React, { useContext }        from 'react'
import { Link }                     from 'react-router-dom'
import styled                       from 'styled-components'
import PropTypes                    from 'prop-types'

import CalendarContext              from '../../context/calendar/CalendarContext'
import ServiceContext               from '../../context/service/ServiceContext'

/* Styled components para el bloque del calendario */
const Block = styled.div`
    cursor: pointer;    
    background-color: ${props => props.sameDate ? '#d5e8c8' : 'white'};
    padding: 1rem;
    border-radius: 5px;
    box-shadow: 0 0 5px #d7d7d7;
    border: 2px solid ${props => props.sameDate ? 'green' : '#ccc'};
    transition: all .3s ease;

    p{
        font-size: 25px;
        grid-area: block;
    }

    &:hover{
        background-color: #d7d7d7;
        border: 2px solid ${props => props.sameDate ? 'green' : 'white'};
        color: ${props => props.sameDate ? 'green' : 'black'}
    }
`

const CalendarBlock = ({ day, exams, tasks, others }) => {

    // Obtenemos los states de los context
    const calendarContext = useContext(CalendarContext)
    const { period, monthName, setSelectedDay } = calendarContext

    const serviceContext = useContext(ServiceContext)
    const { loadExamNotes, loadTaskNotes, loadOtherNotes } = serviceContext

    // Extraemos variables
    const { year, month } = period

    const currentDate = new Date()
    const sameDate = currentDate.getDate() === day &&
                     currentDate.getMonth() + 1 === month &&
                     currentDate.getFullYear() === year

    const handleSelectedDay = () => {
        // Inicializamos los arrays de tareas
        loadExamNotes([])            
        loadTaskNotes([])
        loadOtherNotes([])

        setSelectedDay(day)        
    }  

    return (
        <Link   
            to={'sheet'}
            day={day}
        >
            <Block 
                sameDate={sameDate}
                className="m-2 text-dark"
                onClick={handleSelectedDay}                
            >
                {exams.length > 0 ? (<i className="fa fa-circle text-primary mr-1"></i>) : null}
                {tasks.length > 0 ? (<i className="fa fa-circle text-orange mr-1"></i>) : null}
                {others.length > 0 ? (<i className="fa fa-circle text-purple mr-1"></i>) : null}
                <p>{`${day} de ${monthName}`}</p>            
            </Block>
        </Link>
    );
}

CalendarBlock.propTypes = {
    day: PropTypes.number.isRequired,
    exams: PropTypes.array.isRequired,
    tasks: PropTypes.array.isRequired,
    others: PropTypes.array.isRequired
}

export default CalendarBlock