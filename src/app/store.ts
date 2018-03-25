import {ToDo } from './models/to-do.models';
/* Main IAppState class that host the whole store for the application.an initialstate class(optional)
 which is passed on to module for initial entities but this */
 
 export interface IAppState {
  ToDoList:  ToDo [];
  todoerror: string;
  
}
export interface IUIState {
  uistate:  {};
  
}
export const INITIALSTATE: IAppState = {ToDoList:  [], todoerror: ""
};

export interface State {
  todo: IAppState;
  ui: IUIState;
}
