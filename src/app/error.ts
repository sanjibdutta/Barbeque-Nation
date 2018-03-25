import * as fromActions from './actions';

export var errorMap = new Map();
errorMap.set(fromActions.LOAD_TODOS_FAILURE,"Error in loading ToDo list");
errorMap.set(fromActions.ADD_TODO_FAILURE,"Error in adding ToDo");
errorMap.set(fromActions.REMOVE_TODO_FAILURE,"Error in deleting ToDo");
errorMap.set(fromActions.COPY_TODO_FAILURE,"Error in copying ToDo");
errorMap.set(fromActions.SAVE_TODO_FAILURE,"Error in saving ToDo");
errorMap.set(fromActions.DELETE_ALL_TODOS_FAILURE,"Error in deleting ToDo list");


