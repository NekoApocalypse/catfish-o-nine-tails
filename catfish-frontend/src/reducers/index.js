import { combineReducers } from 'redux';
import todoList from './todoList';

const catfishApp = combineReducers({
    todoList,
});

export default catfishApp;
