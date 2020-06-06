import { LOADING }      from '../../types/index'

export default (state, action) => {
    switch(action.type){
        case LOADING:
            return{
                loading: action.payload
            }
        default:
            return state
    }
}