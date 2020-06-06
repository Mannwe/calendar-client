import React, { useContext, useState }  from 'react'

import CalendarContext                  from '../../context/calendar/CalendarContext'
import ServiceContext                   from '../../context/service/ServiceContext'
import LoadingContext                   from '../../context/loading/LoadingContext'

const Footer = () => {

    // Obtenemos los estados de los context
    const calendarContext = useContext(CalendarContext)
    const { period, savePeriod } = calendarContext

    const serviceContext = useContext(ServiceContext)
    const { resetSheetsUpdated } = serviceContext

    const loadingContext = useContext(LoadingContext)
    const { setLoading } = loadingContext

    // Obtenemos el state de las variables de los select (mes y año)
    const [ selectedPeriod, setSelectedPeriod ] = useState({
        year: new Date().getFullYear(),
        month: 0
    })

    // Años del selector, empezando por el actual
    const years = []
    for(let i = 0; i < 5; i++){
        years.push(new Date().getFullYear() + i)
    }

    // Extraemos las variables del state
    const { year, month } = selectedPeriod;

    // Cargamos en el state el year y month seleccionados
    const handleChange = e => {
        setSelectedPeriod({
            ...selectedPeriod,
            [e.target.name]: parseInt(e.target.value)
        })
    }

    // Guardamos año y mes
    const handleGo = e => {
        e.preventDefault()

        // Habilitamos el spinner de carga
        resetSheetsUpdated()
        setLoading(true)

        savePeriod(selectedPeriod) // Ejecutamos la función del CalendarState para guardar los datos
    }

    // Botón mes anterior
    const handlePrevious = e => {
        e.preventDefault()

        // Habilitamos el spinner de carga
        resetSheetsUpdated()
        setLoading(true)

        if(period.month > 1){
            const previousPeriod = {
                year: period.year,
                month: period.month - 1
            }
            savePeriod(previousPeriod)            
        }else{
            const previousPeriod = {
                year: period.year - 1,
                month: 12
            }
            savePeriod(previousPeriod)
        }
    }

    // Botón mes siguiente
    const handleNext = e => {
        e.preventDefault()

        // Habilitamos el spinner de carga
        resetSheetsUpdated()
        setLoading(true)

        if(period.month < 12){
            const nextPeriod = {
                year: period.year,
                month: period.month + 1
            }
            savePeriod(nextPeriod)            
        }else{
            const nextPeriod = {
                year: period.year + 1,
                month: 1
            }
            savePeriod(nextPeriod)
        }
    }

    return (
        <form
            id='footer'
            className='p-5 row m-0 border border-dark border-bottom-0 border-right-0 border-left-0'
        >
            <div className='col-md-8 row m-0 justify-content-start'>
                <select 
                    className='custom-select col-md-3 form-control mr-3 text-dark'
                    onChange={handleChange}
                    name='year'
                    value={year}
                >
                    {years.map(year => 
                        <option
                            key={year}
                        >
                            {year}
                        </option>
                    )}
                </select>
                <select 
                    className='custom-select col-md-3 form-control text-dark'
                    onChange={handleChange}
                    name='month'
                    value={month}
                >
                    <option> --Selecciona el Mes--</option>
                    <option value='1'>Enero</option>
                    <option value='2'>Febrero</option>
                    <option value='3'>Marzo</option>
                    <option value='4'>Abril</option>
                    <option value='5'>Mayo</option>
                    <option value='6'>Junio</option>
                    <option value='7'>Julio</option>
                    <option value='8'>Agosto</option>
                    <option value='9'>Septiembre</option>
                    <option value='10'>Octubre</option>
                    <option value='11'>Noviembre</option>
                    <option value='12'>Diciembre</option>
                </select>
                <button 
                    className='col-md-2 ml-2 btn btn-dark'
                    onClick={handleGo}
                >Ir</button>
            </div>
            <div className='col-md-4 row m-0 justify-content-end'>
                <button 
                    className='col-md-5 btn btn-dark mr-2'
                    onClick={handlePrevious}
                >
                    <i className="fa fa-backward"></i> Anterior
                </button>
                <button 
                    className='col-md-5 btn btn-dark mr-2'
                    onClick={handleNext}
                >
                    Siguiente <i className="fa fa-forward"></i>
                </button>
            </div>
        </form>
    );
}
 
export default Footer;