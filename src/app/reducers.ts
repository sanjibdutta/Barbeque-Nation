import {Action} from 'redux';
import {IAppState, IUIState,INITIALSTATE, State} from './store';
import * as fromActions from './actions';
import {ActionReducerMap} from '@ngrx/store';
import {errorMap} from './error';

/*This is Redux reducer class with pur function. This class receives call from store in response 
to any action dispached from App component class. This class returns a state object according to
the received action request but never modifies the orginal state passed on to it.*/

export const reducers: ActionReducerMap<State> = {
  todo: ToDoReducer,
  ui: UIReducer,
};
export  function ToDoReducer (state: IAppState = INITIALSTATE  , action): IAppState {
  
  switch (action.type) {
    
    case fromActions.LOAD_TODOS_SUCCESS: {

      return {ToDoList: action.ToDoList , todoerror: ""};
    }
    case fromActions.REMOVE_TODO_SUCCESS: {
      return {ToDoList: state.ToDoList.filter(todo => todo.id !== action.id) , todoerror: ""};
    }
    case fromActions.COPY_TODO_SUCCESS: {
        const todo = state.ToDoList.find(td => td.id === action.id);
        return {ToDoList: [...state.ToDoList , action.todo],todoerror: ""};
          
    }
    
    case fromActions.SAVE_TODO_SUCCESS: {
      
      
      const ind = state.ToDoList.findIndex(td => td.id === action.todo.id);
      const len = state.ToDoList.length ;
      
      return {ToDoList: [...state.ToDoList.slice(0, ind ), action.todo, ...state.ToDoList.slice( ind + 1, len)], todoerror: ""};

    }
    case fromActions.ADD_TODO_SUCCESS: {
      
      const todo = action.todo ;
      return {ToDoList: [...state.ToDoList ,todo],todoerror: ""};
  }
  case fromActions.DELETE_ALL_TODOS_SUCCESS: {
    
    return {ToDoList: [], todoerror: ""};
}
case fromActions.LOAD_TODOS_FAILURE: 
case fromActions.REMOVE_TODO_FAILURE:
case fromActions.COPY_TODO_FAILURE:
case fromActions.SAVE_TODO_FAILURE:
case fromActions.ADD_TODO_FAILURE:
case fromActions.DELETE_ALL_TODOS_FAILURE:
{

  return {ToDoList: [...state.ToDoList] , todoerror: errorMap.get(action.type) +"-"+ action.error.message};
}
  

    default:
    
      return state;
  }
}

export  function UIReducer (state: IUIState = {uistate: {}}  , action): IUIState {

  switch (action.type) {
    default:
      return state;
  }
}
