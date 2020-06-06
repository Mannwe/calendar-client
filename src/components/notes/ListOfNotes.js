import React, { useState, useEffect }       from 'react'
import Note                                 from './Note'

const ListOfNotes = ({ type, notes }) => {

    // States locales del componente
    const [ bullet, setBullet ] = useState('')

    useEffect(() => {
        switch(type){
            case 'Exámenes':
                setBullet('text-primary')
                break
            case 'Tareas':
                setBullet('text-orange')
                break
            case 'Otros':
                setBullet('text-purple')
                break
            default:
                break
        } 
    }, [type])   

    return (
        <>
            <h3 className='text-center mb-3'><i className={`fa fa-circle ${bullet} mr-1`}></i> {type}</h3>
            <ul>
                {notes.map(note => (
                    <Note 
                        key={note._id}
                        note={note} />)
                )}
            </ul>
        </>
    );
}
 
export default ListOfNotes;