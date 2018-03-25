import { Component, OnInit } from '@angular/core';
import {ToDo} from '../models/to-do.models';
import {Input, Output } from '@angular/core';
// import { NgReduxModule, NgRedux } from 'ng2-redux';
import { EventEmitter } from '@angular/core';

export class BaseToDo extends Object {
  id: number ;
}

@Component({
  selector: 'app-to-do,[app-to-do]',
  templateUrl: './to-do.component.html',
  styleUrls: ['./to-do.component.css']
})
export class ToDoComponent implements OnInit {
  objectKeys = Object.keys;
  objectValues = Object.values;
  @Input() ToDoList: BaseToDo[];

  @Input() columns:  string[];
  @Input() propEnumMap: Object;
  @Output() deleteToDo: EventEmitter<any> = new EventEmitter();
  @Output() copyToDo: EventEmitter<any> = new EventEmitter();
  @Output() modifyToDo: EventEmitter<any> = new EventEmitter();
  @Output() saveChanges: EventEmitter<any> = new EventEmitter();
  @Output() cancelChanges: EventEmitter<any> = new EventEmitter();
  workToDo: BaseToDo  ;
  updateID: number;
    constructor() {

  }

  ngOnInit() {
  }

   removeToDo(id) {
      this.deleteToDo.emit(id);
    }
     copyAddToDo(id) {
       this.copyToDo.emit(id);
    }
    updateToDo(id) {
      const curToDo = this.ToDoList.find(td => td.id === id);
      this.workToDo = Object.assign( {}, curToDo ) ;
      this.updateID = id;
      this.modifyToDo.emit(id);
   }
   saveToDo(todo) {
    this.updateID = 0;
    this.saveChanges.emit(todo);
 }
 cancelSave(id) {
  this.updateID = 0;
  this.cancelChanges.emit(id);
}

type (prop: any): string {

 return typeof prop ;
}
}


