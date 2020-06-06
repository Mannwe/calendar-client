import React, { useContext, useEffect } from 'react'

import Calendar                         from '../components/calendar/Calendar'
import Header                           from '../components/main/Header'
import Footer                           from '../components/main/Footer'
import Loading                          from '../components/loading/Loading'
import CalendarContext                  from '../context/calendar/CalendarContext'
import ServiceContext                   from '../context/service/ServiceContext'
import LoadingContext                   from '../context/loading/LoadingContext'

const Main = ({ location }) => {

    // Obtenemos los estados de los context
    const calendarContext = useContext(CalendarContext)
    const { period, monthName, lastDay, savePeriod } = calendarContext

    const serviceContext = useContext(ServiceContext)
    const { sheetsUpdated, calendarSheets, getSheets } = serviceContext

    const loadingContext = useContext(LoadingContext)
    const { loading, setLoading } = loadingContext

    // En el primer render cargamos el período correspondiente a la fecha actual
    useEffect(() => {
        if(location.period){
            const { period } = location
            savePeriod(period)

            return
        }
        savePeriod({
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1
        })
        // eslint-disable-next-line
    }, [location])

    // Generamos un array con el calendario cuando se actualice el state del número de días del mes
    useEffect(() => {
        if(!lastDay || lastDay === 0) return

        getSheets(period, lastDay)
        // eslint-disable-next-line
    }, [lastDay, period])

    // Notificación cuando las hojas han sido cargadas en el calendario
    useEffect(() => {
        if(sheetsUpdated && loading) {
            setLoading(false) // Acabó la carga
        }
        // eslint-disable-next-line
    }, [sheetsUpdated, loading])

    return (
        <div
            className='row m-0'
        >
            <div className="col p-0">
                <Header />
                {loading
                ?
                    <Loading />
                :
                <>          
                    <section id='content'>
                        <Calendar 
                            monthName={monthName}
                            period={period}
                            calendarSheets={calendarSheets}
                        />
                    </section>
                    <footer id='footer'>
                        <Footer />
                    </footer>
                </>
                }
            </div>  
        </div>
    );
}
 
export default Main;