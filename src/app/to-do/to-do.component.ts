import { Component, OnInit, ViewChild } from '@angular/core';
import {ToDo} from '../models/to-do.models';
import {Input, Output } from '@angular/core';
import { NgReduxModule, NgRedux } from 'ng2-redux';
import { EventEmitter } from '@angular/core';
import {BaseToDo} from './models/base-to-do';
//import { Profile } from 'selenium-webdriver/firefox';
import { FormGroup } from '@angular/forms';
import  {DynamicFormBuilder} from './DynamicFormBuilder' 


/* Main ToDoComponent, presentation component,  resposible for managing CRUD, filtering,
pagination operation of practically any data row of one level entity. It can be highly
configured at paren container component level.There is much oppertunity for further enhancement.
Todo: 1)Add inline comments 2)Add sorting function 3) change it to accept one single config object
with all configuration to avoid chaotic configuration options */
@Component({
  selector: 'app-to-do,[app-to-do]',
  templateUrl: './to-do.component.html',
  styleUrls: ['./to-do.component.css']
})
export class ToDoComponent implements OnInit {
  objectKeys = Object.keys;
  objectValues = Object.values;
  _ToDoList: BaseToDo[];

  @Input()
  set ToDoList(todolist: BaseToDo[]) {
    

    if(typeof this._ToDoList !== 'undefined' && this._ToDoList.length === todolist.length ){
      
      this.updateID = 0;
    }
    else if (typeof this._ToDoList !== 'undefined' && todolist.length - this._ToDoList.length > 0) {
        
        this.addForm.setValue(this.defaultToDo)
        Object.keys(this.addForm.controls).forEach(key => {
        
          this.addForm.get(key).markAsUntouched();
        });
        
      
    } 
    this.updateID = 0;
    this._ToDoList = todolist;
    this.limit = this._ToDoList.length;
    
  }

  @Input() defaultToDo: BaseToDo;
  @Input() columns:  string[];
  @Input() propEnumMap: Object;
  @Input() requiredFields: string[];
  @Input() validators: Object[];
  @Output() deleteToDo: EventEmitter<any> = new EventEmitter();
  @Output() copyToDo: EventEmitter<any> = new EventEmitter();
  @Output() saveChanges: EventEmitter<any> = new EventEmitter();
  @Output() addToDo: EventEmitter<any> = new EventEmitter();
  @Output() deleteAllToDos: EventEmitter<any> = new EventEmitter();
  @Output() modifyToDo: EventEmitter<any> = new EventEmitter();
  @Output() cancelChanges: EventEmitter<any> = new EventEmitter();

  filterToDo: BaseToDo;
  custFilterOption1: BaseToDo;
  custFilterOption2: BaseToDo;
  custFilterOperator: BaseToDo;
  custFilterToDo1: BaseToDo;
  custFilterToDo2: BaseToDo;
  customize: Object =new Object();
  filters: Object =new Object();
  updateID: number;
  showFilter: boolean = false;
  limit: number;
  page: number;
  columnCount: number;
  activeSortFlag: boolean = false;
  activeSortColIndex: number =0
  
  numberFilterOptions: string[] = ['empty', 'not empty','equal', 'not equal', 'less than', 'less than or equal', 'greater than', 'greater than or equal'];
  textFilterOptions: string[] = ['empty', 'not empty', 'contains', 'contains(match case)', 'does not contain','does not contain(match case)', 'starts with','starts with(match case)','ends with','ends with(match case)','equal','equal(match case)'];
  numberArrayFilterOptions: string[] = ['empty', 'not empty','(any)equals','(any)not equal',  '(all)not equal', '(any)less than','(all)less than', '(any)less than or equal','(all)less than or equal', '(any)greater than','(all)greater than', '(any)greater than or equal','(all)greater than or equal'];
  textArrayFilterOptions: string[] = ['empty', 'not empty', '(any)contains','(all)contain', '(any)contains(match case)','(all)contain(match case)', '(any)does not contain','(all)do not contain','(any)does not contain(match case)','(all)do not contain(match case)', '(any)starts with','(all)start with','(any)starts with(match case)','(all)start with(match case)','(any)ends with','(all)end with','(any)ends with(match case)','(all)end with(match case)','(any)equals','(all)equal','(any)equals(match case)','(all)equal(match case)'];
  dateFilterOptions: string[] = ['empty', 'not empty','same date', 'not same date', 'earlier than date', 'earlier than or same date', 'later than date', 'later than date or same date'];
  addForm: FormGroup
  updateForm: FormGroup
  constructor() {

  }

  ngOnInit() {
    
    this.filterToDo = Object.assign({},this.defaultToDo) ;
    this.custFilterOption1 = Object.assign({},this.defaultToDo) ;
    this.custFilterOption2 = Object.assign({},this.defaultToDo) ;
    this.custFilterOperator = Object.assign({},this.defaultToDo) ;
   
    this.custFilterToDo1 = Object.assign({},this.defaultToDo) ;
    this.custFilterToDo2 = Object.assign({},this.defaultToDo) ;
    
            
    this.page = 1;
    this.columnCount = this.columns.length;
    for(let key in Object.keys(this.filterToDo)){
      this.customize[key] = false;
    }
    
    this.filters['filterToDo'] = this.filterToDo;
    this.filters['custFilterOption1'] = this.custFilterOption1;
    this.filters['custFilterOption2'] = this.custFilterOption2;
    this.filters['custFilterOperator'] = this.custFilterOperator;
    this.filters['custFilterToDo1'] = this.custFilterToDo1;
    this.filters['custFilterToDo2'] = this.custFilterToDo2;
    this.filters['customize'] = this.customize;

    this.initializeFilter(this.filterToDo);
    
    this.addForm = new  DynamicFormBuilder().buildGroupFromAnyobject(this.defaultToDo,this.validators);
    this.updateForm = new  DynamicFormBuilder().buildGroupFromAnyobject(this.defaultToDo,this.validators);

    }

   
  initializeFilter(filterToDo: any){

    Object.keys(filterToDo).forEach((key) =>{
           
      
                   
        
          if(this.propEnumMap[key] && this.type(this.propEnumMap[key].values[0]) === 'string') {
            
            filterToDo['array_'+key]=['All'];
            this.custFilterToDo1[key]=''
            this.custFilterToDo2[key]=''
          }if(this.propEnumMap[key] && this.type(this.propEnumMap[key].values[0]) === 'number') {
           
            filterToDo['array_'+key]=[-1];
            
            this.custFilterToDo1[key]='';
            this.custFilterToDo2[key]='';
           
          }else if(this.type(filterToDo[key]) === 'string'){
            filterToDo[key]='';
            this.custFilterToDo1[key]=''
            this.custFilterToDo2[key]=''
            
          }else if(this.type(filterToDo[key]) === 'number'){
          filterToDo['array_'+key]=[-1];
          this.custFilterToDo1[key]='';
          this.custFilterToDo2[key]='';
        
          }else if(this.type(filterToDo[key]) === 'object'){
            if(this.type(filterToDo[key].getMonth) === 'function'){
            filterToDo["from_"+key]= new Date();
            filterToDo["from_"+key].setYear(filterToDo[key].getYear()-40);
            filterToDo["to_"+key]= new Date(Date.now());
            this.custFilterToDo1[key]=new Date(Date.now());
            this.custFilterToDo2[key]=new Date(Date.now());
            }
          }else if(this.type(filterToDo[key]) === 'boolean'){
           
          filterToDo["array_"+key]=['All'];
        
      }
      this.custFilterOption1[key] = 'not empty' ;
      this.custFilterOption2[key] = 'empty' ;
      this.custFilterOperator[key] = 'OR' ;

    });
    
    
  }
  removeToDo(id) {
      this.deleteToDo.emit(id);
  }
  copyAddToDo(id) {
       this.copyToDo.emit(id);
  }
    
  saveToDo() {
    if(!this.updateForm.invalid) {  
      var temp  = this.updateForm.value
      this.saveChanges.emit(temp);
     }
     else {
      
      Object.keys(this.updateForm.controls).forEach(key => {
        
        this.updateForm.get(key).markAsTouched();
      });
     }
    
  }

  addNewToDo() {
    
     if(!this.addForm.invalid) {  
      var temp  = this.addForm.value
      this.addToDo.emit(temp);
     }
     else {
      
      Object.keys(this.addForm.controls).forEach(key => {
        
        this.addForm.get(key).markAsTouched();
      });
     }
    
  }

  removeAllToDos(){
    
    this.deleteAllToDos.emit(this._ToDoList);
  }
 cancelSave(id) {
  this.updateID = 0;
  this.cancelChanges.emit(id);
 }
 updateToDo(id) {
  const curToDo = this._ToDoList.find(td => td.id === id);
  this.updateForm.setValue(curToDo)
  this.updateID = id;
  this.modifyToDo.emit(id);
}

type (prop: any): string {

 return typeof prop ;
}
initCap(text: string){
  return text.charAt(0).toUpperCase()+text.slice(1);
}

valuesForObjectArray(objects: Object[], key: string): any[]{
    return objects.map(a=>a[key]);
}
displayFilter(){
  document.getElementById('hide-filter').style.display='none';
  document.getElementById('show-filter').style.display='';
  this.showFilter=true;

}
hideFilter(){
  document.getElementById('show-filter').style.display='none';
  document.getElementById('hide-filter').style.display='';
  this.showFilter=false;

}
fotmatDate(date: Date): string {
  
  return date.toDateString();

}

sortColumn(n: number, sort: number) {
  
  if(n===this.activeSortColIndex){
    this.activeSortFlag =!this.activeSortFlag;
  }
  else{
    this.activeSortFlag =false;
    this.activeSortColIndex = n;
  }

}
checkRequired(form: FormGroup, field: string): boolean {

  // if(form.get(field).invalid && form.get(field).touched) {
  //   return true;
  // }
  
  if(form.get(field).touched && form.get(field).errors && form.get(field).errors.required) {
    return true;
  }

}
checkMin(form: FormGroup, field: string): boolean {
  
  if(form.get(field).touched && form.get(field).errors && form.get(field).errors.minlength) {
    return true;
  }

}
checkMax(form: FormGroup, field: string): boolean {

  if(form.get(field).touched && form.get(field).errors && form.get(field).errors.maxlength) {
    return true;
  }

}
checkPattern(form: FormGroup, field: string): boolean {

  if(form.get(field).touched && form.get(field).errors && form.get(field).errors.pattern) {
    return true;
  }

}
minLength(field: string): number {

  return this.validators[field]['minLength']

}
maxLength( field: string): number {

  return this.validators[field]["maxLength"]

}
pattern( field: string): number {

  return this.validators[field]['pattern']

}

}


