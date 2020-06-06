import React                        from 'react'
import styled                       from 'styled-components'
import PropTypes                    from 'prop-types'

import CalendarBlock                from './CalendarBlock'

/* Styled components para el calendario */
const CalendarGrid = styled.div` 
    display: grid;
    padding: 2rem;
    width: 100%;
    margin: 0 auto;    

    grid-template-areas: 
        'block block block block block block block'
        'block block block block block block block'
        'block block block block block block block'
        'block block block block block block block'
        'block block block block block block block';
`

const Calendar = ({ monthName, period, calendarSheets }) => {

    return (
        <>
            <div
                id='header-calendar'
                className='row m-0 pl-4 pt-4 pb-0 border border-dark border-top-0 border-right-0 border-left-0'
            >
                <h4 className='col-md-4'>{`${monthName}, ${period.year}`}</h4>
                <div className='h6 col-md-3 offset-md-5 float-right'>
                    <span className='float-right mr-3'><i className="fa fa-circle text-purple ml-3"></i> Otros</span>
                    <span className='float-right'><i className="fa fa-circle text-orange ml-3"></i> Tareas</span>
                    <span className='float-right'><i className="fa fa-circle text-primary ml-3"></i> Exámenes</span>
                </div>
            </div>
            <CalendarGrid 
                id='calendar'
                className='row'
            >
                {calendarSheets.map(day => {
                    return(
                        <CalendarBlock
                            key={day.id}
                            day={day.id}
                            exams={day.examNotes}
                            tasks={day.taskNotes}
                            others={day.otherNotes}
                        />
                    )
                })}                
            </CalendarGrid>
        </>
    );
}

Calendar.propTypes = {
    monthName: PropTypes.string.isRequired,
    period: PropTypes.object.isRequired,
    calendarSheets: PropTypes.array.isRequired
}
 
export default Calendar;