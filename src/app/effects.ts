import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import { of } from 'rxjs/observable/of';
import { from } from 'rxjs/observable/from';
import * as fromActions from './actions';
import { ToDoService } from './services';


@Injectable()
export class ToDoEffects {

  constructor(
    private actions$: Actions,
    private todoService: ToDoService
  ) {}

  @Effect()
  loadAllTodos$: Observable<Action> = this.actions$
    .ofType<any>(fromActions.LOAD_TODOS)
    .switchMap(() =>
       this.todoService.getAllTodos()
       .map(todos => ({type: fromActions.LOAD_TODOS_SUCCESS, ToDoList: todos}))
       .catch(error => of({type: fromActions.LOAD_TODOS_FAILURE, error: error}))
    ) ;

  @Effect()
  addTodo$: Observable<Action> = this.actions$
  .ofType<any>(fromActions.ADD_TODO)
  .map(action => action.todo)
    .mergeMap(todo =>
         this.todoService.addToDo(todo).map( res => ({type: fromActions.ADD_TODO_SUCCESS, todo: res}))
         .catch(error => of({type: fromActions.ADD_TODO_FAILURE, error: error})));

  @Effect()
  saveTodo$: Observable<Action> = this.actions$
      .ofType<any>(fromActions.SAVE_TODO)
      .map(action =>action.todo)
      .mergeMap(todo =>
         this.todoService.saveToDo(todo)
         .map(res => ({type: fromActions.SAVE_TODO_SUCCESS, todo: res}))
         .catch(error => of( {type: fromActions.SAVE_TODO_FAILURE, error: error})
    ));
    @Effect()
    deleteTodo$: Observable<Action> = this.actions$
        .ofType<any>(fromActions.REMOVE_TODO)
        .map(action => action.id)
        .mergeMap(id =>
           this.todoService.deleteToDo(id)
           .map(() => ({type: fromActions.REMOVE_TODO_SUCCESS, id: id}))
           .catch(error => of( {type: fromActions.REMOVE_TODO_FAILURE, error: error})
      ));
      @Effect()
    deleteAllTodo$: Observable<Action> = this.actions$
        .ofType<any>(fromActions.DELETE_ALL_TODOS)
        .map(action => action.todos)
        .mergeMap(todos => from(todos)
            .mergeMap(todo=>this.todoService.deleteToDoByToDo(todo)
            .map(() => ({type: fromActions.DELETE_ALL_TODOS_SUCCESS}))
            .catch(error => of( {type: fromActions.DELETE_ALL_TODOS_FAILURE, error: error})
      )));
      @Effect()
      copyTodo$: Observable<Action> = this.actions$
          .ofType<any>(fromActions.COPY_TODO)
          .map(action => action.id)
          .mergeMap(id =>
             this.todoService.getToDo(id).map((res)=>{res.id=0; return res})
             .mergeMap(todo=>this.todoService.addToDo(todo))
             .map((res) => { console.log("copied"+ res);return ({type: fromActions.COPY_TODO_SUCCESS, todo: res});})
             .catch(error => of( {type: fromActions.COPY_TODO_FAILURE, error: error})
        ));

}
