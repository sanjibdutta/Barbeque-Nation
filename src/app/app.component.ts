import { Component } from '@angular/core';
import {ToDo} from './models/to-do.models';
import { OnInit } from '@angular/core';
import {State} from './store';
import { select } from 'ng2-redux';
import {Observable} from 'rxjs/Observable';
import { NgReduxModule, NgRedux } from 'ng2-redux';
import {INITIALSTATE} from './store';
import {ToDoReducer} from './reducers';
import * as fromActions from './actions';
import {Store} from '@ngrx/store'
import { ConfigService } from './services';
import { first,takeWhile } from 'rxjs/operators';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
}) 
/* Parent Container component class that configure todo component and pass on required configurarion
It manages dispatching actions to store once notified by todo component class. It also subscribe to
store for notification of any chages that it passes on to todo component Todo: Add inline comments*/
export class AppComponent implements OnInit {
  ToDoList;
  defaultToDo;

  columns: string[] //= ['ID', 'Description', 'Complete by days','Depends on ToDo IDs','Participants','Completed','Priority','Owner', 'Created'];
  propEnumMap: Object // = {depends_on_todo_ids: {values: [1,2,3,4,5,6,7,8,9,10], multiple: true},participants: {values: ['Geo leads','Squad team','E&C team','Product Owner','user','ES team','Iteration Manager'],multiple: true},priority: {values: [1, 2, 3,4], multiple: false},owner:{values: ['Sanjib Dutta','Parul Rathi','Prashant Goel','Vikas Jain'],multiple: false}};
  
  requiredFields: string[]
  validators: Object[]
  error: string;
  constructor(private store: Store<State>, private configService: ConfigService) {


  }

  ngOnInit () {
    
    this.store.dispatch({type: fromActions.LOAD_TODOS});
    
    this.store.select('todo').subscribe(state => {this.ToDoList = state.ToDoList; this.defaultToDo=this.initializeDefault(Object.assign({},state.ToDoList[0]));this.error = state.todoerror;});
    this.configService.getConfig().subscribe((config)=>{this.columns=config[0].columns;this.propEnumMap=config[1].propEnumMap; this.validators=config[3].validators;})
    console.log("test"+ this.validators)
    //this.defaultToDo = {id: 0, description: '' , time_to_complete_days: 0, depends_on_todo_ids: [], participants: [],completed: false, priority: 1, owner: '', created: new Date(Date.now()) } ;
    //console.log(this.ToDoList[0]);
    //this.defaultToDo = this.initializeDefault(this.defaultToDo);
  }
  initializeDefault(dtodo: ToDo): ToDo {
    

    Object.keys(dtodo).forEach((key) =>{
      
      if(typeof dtodo[key] === 'number') {
        dtodo[key]= 0;
      }
      else if(typeof dtodo[key] === 'boolean'){
        dtodo[key]= false;
      }
      else if(typeof dtodo[key] === 'string') {
        
        dtodo[key] ='';
      }
      else if(dtodo[key] instanceof Array) {
        
        dtodo[key] =[];
        
      }
      else if ( Object.prototype.toString.call(new Date(dtodo[key])) === "[object Date]" ) {
          
        if ( !isNaN( new Date(dtodo[key]).getTime() ) ) {  
          dtodo[key] =new Date();
        }
        
      }
      else if ( typeof(dtodo[key]) === "object" ) {
          
        if ( typeof(dtodo[key].getMonth) === 'function'  ) {  
          dtodo[key] =new Date(Date.now());
        }
        
      }
    })
    return dtodo;

  }
  removeToDo(id) {

    this.store.dispatch({type: fromActions.REMOVE_TODO, id: id});
  }
  copyToDo(id) {
     
    this.store.dispatch({type: fromActions.COPY_TODO, id: id});
  }
  
  saveChanges(todo) {
    if(this.validateToDo(todo)){
      this.store.dispatch({type: fromActions.SAVE_TODO, todo: todo});
    }

  }

  addToDo(todo) {
  
    if(this.validateToDo(todo)){
     this.store.dispatch({type: fromActions.ADD_TODO, todo: todo});
    }
  }
  deleteAllToDos(todos: ToDo[]){
    
    this.store.dispatch({type: fromActions.DELETE_ALL_TODOS, todos: todos});
  }

  modifyToDo(id) {
  
 this.store.dispatch({type: fromActions.MODIFY_TODO, id: id});

}
cancelChanges(id) {
 this.store.dispatch({type: fromActions.CANCEL_CHANGES, id: id});

}
validateToDo(todo: ToDo): boolean{
  // if(todo.description.trim().length < 1){
  //   alert("Description fieid cannot be blank or all space characters");
  //   return false ;
  // }
  
  // Object.keys(todo).forEach((key)=>{
    
  //   if(this.requiredFields.includes(key) && !todo[key ]){
  //     this.error+= "'"+key.charAt(0).toUpperCase()+ key.replace(/_/g, ' ').slice(1) + " is Required field\n"
  //   }
      
  // });
  // if(this.error !== '') return false;
  return true;
}



}
