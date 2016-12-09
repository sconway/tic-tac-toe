import {combineReducers} from 'redux'
import SomethingReducer from './reduceSomething'

const allReducers = combineReducers({
  something: SomethingReducer
});

export default allReducers;