import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ToDo } from './models/to-do.models';

@Injectable()
export class ToDoService {
    constructor(private http: HttpClient) { }

    url = 'http://localhost:3000/ToDoList';
    getAllTodos(): Observable<ToDo[]> {
        
        return this.http.get<ToDo[]>(this.url).map(todos=>todos.map(todo=>this.processDateString(todo)));
    }

    addToDo(todo: ToDo): Observable<ToDo> {
        return this.http.post<ToDo>(this.url, todo).map(todo=>this.processDateString(todo));
    }

  saveToDo(todo: ToDo): Observable<ToDo> {
      return this.http.put<ToDo>(this.url + '/' + todo.id,  todo ).map(todo=>this.processDateString(todo));
  }
  getToDo(id: string): Observable<ToDo> {
    return this.http.get<ToDo>(this.url + '/' + id ).map(todo=>this.processDateString(todo));
}

    deleteToDo(id: string): Observable<ToDo> {
        console.log("deleteToDo called" + id)
      return this.http.delete<ToDo>(this.url + '/' + id);
  }
    deleteToDoByToDo(todo): Observable<ToDo> {
        console.log("deleteToDoByToDo called" + todo.id)
        return this.http.delete<ToDo>(this.url + '/' + todo.id);
  }
  processDateString(todo: ToDo): ToDo{
    Object.keys(todo).forEach((key) =>{
        if(typeof todo[key] === 'string') {
            var temp = new Date(todo[key])
            if ( Object.prototype.toString.call(temp) === "[object Date]" ) {
                
                if ( isNaN( temp.getTime() ) ) {  
                  
                }
                else {
                    
                    todo[key] =temp;
                }
              }
             
        }
      })
      return todo;
  }
}
@Injectable()
export class ConfigService {
    constructor(private http: HttpClient) { }

    url = 'http://localhost:3000/Config';
    getConfig(): Observable<any[]> {
        
        return this.http.get<any []>(this.url);
    }

}