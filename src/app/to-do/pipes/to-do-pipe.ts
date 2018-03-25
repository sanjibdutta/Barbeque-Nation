import { Pipe, PipeTransform } from '@angular/core';

import {BaseToDo} from '../models/base-to-do';

@Pipe({
    name: 'todoFilter',
    pure: false
})
/* This class is responsible for implementation of all filters for all type of data fields of a ToDo 
item (in fact any item). The applyFilter function is doing all nuts and bolts.*/

export class ToDoFilterPipe implements PipeTransform {
  transform(items: any[], filters: any[]): any [] {
    
    //console.log(filters) ; 
    if (!items || !filters) {
      return items;
    }
    
    return items.filter((item) => this.applyFilter(item, filters));
  }
  
/* applyFilter method is the key method of this class. It filters out data row according to filters 
applied to each column in filter panel at the top*. Each function call process each of the data row
and check filters for each possible type of column filter.
When a particular data row does not meet the filter criteria it returns false and the data row is 
filtered out. Todo: add function inline comments*/
  
  applyFilter(baseTodo: any, filters: any[]): boolean {
   var filter =filters['filterToDo']; 
    for (let key in filter) {
      
			
		if(key.startsWith('filter_') || key.startsWith('array_') || key.startsWith('from_') || key.startsWith('to_') ){
			continue; 
		}    
    
			

		
		if(filters['customize'][key] && !this.applyCustomFilter(baseTodo, filters, key)) {
			
			return false
		}
		if(typeof filter[key] ==='string' ) {
			
			if(filter['array_'+key] instanceof Array) {
				if (!filter['array_'+key].find((item)=>(item === 'All') || item === baseTodo[key]) ){
          
					return false;
				}
			}else{

				if (filter[key] !== '' && filter[key] !== undefined &&  baseTodo[key] !== undefined) {
					
					if (filter[key] !== 'All' && (baseTodo[key].toLowerCase().indexOf(filter[key].toLowerCase()) === -1)) {
						
						return false;
					}
				}
			}
			continue;
		}	else if(typeof filter[key] === 'boolean') {
			if (!filter['array_'+key].find(item=>item === 'All')){
				if( !(filter['array_'+key].find(item=>(item === 'Yes' && baseTodo[key]) || (item === 'No' && !baseTodo[key]) )))  {
					return false;
				}
			}
			continue;
		}else if(typeof filter[key] === 'object') {
      
			if (typeof (filter[key].getMonth) === 'function' ) {
			
				if (filter['to_'+key] < baseTodo[key] ||  baseTodo[key] < filter['from_'+key]) {
					
					return false;
				}
      }else if(filter['array_'+key].constructor === Array) {
				
				
        if (!filter['array_'+key].find((item)=>(item === -1) || (item ==='All') || (baseTodo[key].find((val)=> val === item) !== undefined)) ){
          
					return false;
				}
      }
      
    continue;  
    }else if(typeof filter[key] === 'number') {
			
			if (!filter['array_'+key].find((item)=>(item === -1) || item === baseTodo[key]) ){
          
				return false;
			}
			continue;

		}
    
	}
							

    return true;
}

applyCustomFilter(baseTodo: any, filters: any[], key: string): boolean {
	
	if(typeof baseTodo[key] === 'number'){
		var firstEval = this.applyCustomNumberFilter(baseTodo[key], filters['custFilterOption1'][key],filters['custFilterToDo1'][key]);
		var secondEval = this.applyCustomNumberFilter(baseTodo[key], filters['custFilterOption2'][key],filters['custFilterToDo2'][key]);
	} else if(typeof baseTodo[key] === 'string'){
		var firstEval = this.applyCustomTextFilter(baseTodo[key], filters['custFilterOption1'][key],filters['custFilterToDo1'][key]);
		var secondEval = this.applyCustomTextFilter(baseTodo[key], filters['custFilterOption2'][key],filters['custFilterToDo2'][key]);
	}else if(typeof baseTodo[key] === 'object'){
		if (typeof (baseTodo[key].getMonth) === 'function' ) {
			var firstEval = this.applyCustomDateFilter(baseTodo[key], filters['custFilterOption1'][key],filters['custFilterToDo1'][key]);
			var secondEval = this.applyCustomDateFilter(baseTodo[key], filters['custFilterOption2'][key],filters['custFilterToDo2'][key]);
		}else if((baseTodo[key].constructor === Array && typeof baseTodo[key][0] === 'number') || baseTodo[key].length === 0) {
			var firstEval = this.applyCustomNumberArrayFilter(baseTodo[key], filters['custFilterOption1'][key],filters['custFilterToDo1'][key]);
			var secondEval = this.applyCustomNumberArrayFilter(baseTodo[key], filters['custFilterOption2'][key],filters['custFilterToDo2'][key]);
		}else if((baseTodo[key].constructor === Array && typeof baseTodo[key][0] === 'string' ) || baseTodo[key].length === 0) {
			var firstEval = this.applyCustomTextArrayFilter(baseTodo[key], filters['custFilterOption1'][key],filters['custFilterToDo1'][key]);
			var secondEval = this.applyCustomTextArrayFilter(baseTodo[key], filters['custFilterOption2'][key],filters['custFilterToDo2'][key]);
		}
	}
	

	if(filters['custFilterOperator'][key] === 'AND'){
	
		return firstEval && secondEval;
	}
	if(filters['custFilterOperator'][key] === 'OR'){
	
		return firstEval || secondEval;
	}


	return true;
}

applyCustomNumberFilter(baseTodo: any, custFilterOption: any, custFilterTodo: any): boolean {
	//console.log('applyCustomNumberFilter called..key='+ key+'and  custFilterOption[key]='+custFilterOption[key])
	switch(custFilterOption) {
		case 'empty': {
			return baseTodo === null;
		}
		case 'not empty': {
			return !(baseTodo === null);
		}
		case 'equal': {
			
			return baseTodo === Number(custFilterTodo);
		}
		case 'not equal': {
			return !(baseTodo === Number(custFilterTodo));
		}
		case 'less than': {
			return baseTodo < Number(custFilterTodo);
		}
		case 'less than or ewual': {
			return baseTodo <= Number(custFilterTodo);
		}
		case 'greater than': {
			return baseTodo > Number(custFilterTodo);
		}
		case 'greater than or equal': {
			return baseTodo >= Number(custFilterTodo);
		}
		default: 
	}
	return true;
}
applyCustomNumberArrayFilter(baseTodo: any, custFilterOption: any, custFilterTodo: any): boolean {
	//console.log('applyCustomNumberFilter called..key='+ key+'and  custFilterOption[key]='+custFilterOption[key])
	switch(custFilterOption) {
		case 'empty': {
			
			return baseTodo.length===0;
		}
		case 'not empty': {
			return baseTodo.length!==0;
		}
		case '(any)equal': {
			
			return baseTodo.find(item=>item === Number(custFilterTodo));
		}
		case '(any)not equal': {
			return baseTodo.find(item=>item !== Number(custFilterTodo));
		}
		case '(all)not equal': {
			return baseTodo.filter(item=>item === Number(custFilterTodo)).length===0;
		}
		case '(any)less than': {
			return baseTodo.find(item=>item < Number(custFilterTodo));
		}
		case '(all)less than': {
			return baseTodo.filter(item=>item >= Number(custFilterTodo)).length===0;
		}
		case '(any)less than or equal': {
			return baseTodo.find(item=>item <= Number(custFilterTodo));
		}
		case '(all)less than or equal': {
			return baseTodo.filter(item=>item > Number(custFilterTodo)).length===0;
		}
		case '(any)greater than': {
			return baseTodo.find(item=>item < Number(custFilterTodo));
		}
		case '(all)greater than': {
			return baseTodo.filter(item=>item <= Number(custFilterTodo)).length===0;
		}
		case '(any)greater than or equal': {
			return baseTodo.find(item=>item >= Number(custFilterTodo));
		}
		case '(all)greater than or equal': {
			return baseTodo.filter(item=>item < Number(custFilterTodo)).length===0;
		}
		default: 
	}
	return true;
}

applyCustomTextFilter(baseTodo: any, custFilterOption: any, custFilterTodo: any): boolean {
	//console.log('applyCustomTextFilter called')
	switch(custFilterOption) {
		case 'empty': {
			return baseTodo === "";
		}
		case 'not empty': {
			return !(baseTodo === "");
		}
		case 'equal(match case)': {
			
			return baseTodo === custFilterTodo;
		}
		case 'equal': {
			
			return baseTodo.toLowerCase() === custFilterTodo.toLowerCase();
		}
		case 'contains(match case)': {

			return baseTodo.indexOf(custFilterTodo) !== -1;
		}
		case 'contains': {

			return baseTodo.toLowerCase().indexOf(custFilterTodo.toLowerCase()) !== -1;
		}
		case 'does not contain(match case)': {

			return baseTodo.indexOf(custFilterTodo) === -1;
		}
		case 'does not contain': {

			return baseTodo.toLowerCase().indexOf(custFilterTodo.toLowerCase()) === -1;
		}
		case 'starts with(match case)': {

			return baseTodo.startsWith(custFilterTodo);
		}
		case 'starts with': {

			return baseTodo.toLowerCase().startsWith(custFilterTodo.toLowerCase());
		}
		case 'ends with(match case)': {

			return baseTodo.endsWith(custFilterTodo);
		}
		case 'ends with': {

			return baseTodo.toLowerCase().endsWith(custFilterTodo.toLowerCase());
		}
		
		default: 
	}
	return true;
	
}
applyCustomTextArrayFilter(baseTodo: any, custFilterOption: any, custFilterTodo: any): boolean {
	
	switch(custFilterOption) {
		case 'empty': {
			return baseTodo.length===0;
		}
		case 'not empty': {
			return baseTodo.length!==0;
		}
		case '(any)equals': {
			
			return baseTodo.find(item=>item.toLowerCase() === custFilterTodo.toLowerCase());
		}
		case '(any)equals(match case)': {
			
			return baseTodo.find(item=>item === custFilterTodo);
		}
		case '(any)contains': {

			return baseTodo.find(item=>item.toLowerCase().indexOf(custFilterTodo.toLowerCase()) !== -1);
		}
		case '(all)contain': {
			//console.log(baseTodo.filter(item=>item.toLowerCase().indexOf(custFilterTodo.toLowerCase()) === -1).length)
			return baseTodo.filter(item=>item.toLowerCase().indexOf(custFilterTodo.toLowerCase()) === -1).length ===0;
		}
		case '(any)contains(match case)': {

			return baseTodo.find(item=>item.indexOf(custFilterTodo) !== -1);
		}
		case '(all)contain(match case)': {

			return baseTodo.filter(item=>item.indexOf(custFilterTodo) === -1).length ===0;
		}
		case '(any)does not contain': {

			return baseTodo.find(item=>item.toLowerCase().indexOf(custFilterTodo.toLowerCase()) === -1);
		}
		case '(all)do not contain': {

			return baseTodo.filter(item=>item.toLowerCase().indexOf(custFilterTodo.toLowerCase()) !== -1).length ===0;
		}
		case '(any)does not contain(match case)': {

			return baseTodo.find(item=>item.indexOf(custFilterTodo) === -1);
		}
		case '(all)do not contain(match case)': {

			return baseTodo.filter(item=>item.indexOf(custFilterTodo) !== -1).length ===0;
		}
		case '(any)starts with': {

			return baseTodo.find(item=>item.toLowerCase().startsWith(custFilterTodo.toLowerCase()));
		}
		case '(all)start with': {

			return baseTodo.filter(item=>item.toLowerCase().startsWith(custFilterTodo.toLowerCase()));
		}
		case '(any)starts with(match case)': {

			return baseTodo.find(item=>item.startsWith(custFilterTodo));
		}
		case '(all)start with(match case)': {

			return baseTodo.filter(item=>item.startsWith(custFilterTodo));
		}
		case '(any)ends with': {

			return baseTodo.find(item=>item.toLowerCase().endsWith(custFilterTodo.toLowerCase()));
		}
		case '(all)end with': {

			return baseTodo.filter(item=>item.toLowerCase().endsWith(custFilterTodo.toLowerCase()));
		}
		case '(any)ends with(match case)': {

			return baseTodo.find(item=>item.endsWith(custFilterTodo));
		}
		case '(all)end with(match case)': {

			return baseTodo.filter(item=>item.endsWith(custFilterTodo));
		}
		
		default: 
	}
	return true;
	
}
applyCustomDateFilter(baseTodo: any, custFilterOption: any, custFilterTodo: any): boolean {
	 
	switch(custFilterOption) {
		case 'empty': {
			return baseTodo === null;
		}
		case 'not empty': {
			return !(baseTodo === null);
		}
		case 'same date': {
			return (
				baseTodo.getFullYear() === custFilterTodo.getFullYear() &&
				baseTodo.getMonth() === custFilterTodo.getMonth() &&
				baseTodo.getDate() === custFilterTodo.getDate()
			  );
		}
		case 'not same date': {
			return (
				baseTodo.getFullYear() !== custFilterTodo.getFullYear() ||
				baseTodo.getMonth() !== custFilterTodo.getMonth() ||
				baseTodo.getDate() !== custFilterTodo.getDate()
			  );
		}
		case 'earlier than date': {
			
			return (
				
				this.formatDate(baseTodo) < this.formatDate(custFilterTodo) 
			  );
		}
		case 'earlier than or same date': {
			return (
				(this.formatDate(baseTodo) < this.formatDate(custFilterTodo)) ||
				(baseTodo.getFullYear() === custFilterTodo.getFullYear() &&
				baseTodo.getMonth() === custFilterTodo.getMonth() &&
				baseTodo.getDate() === custFilterTodo.getDate())

			  );
		}
		case 'later than date': {
			
			return (
				this.formatDate(baseTodo) > this.formatDate(custFilterTodo)
			  );
		}
		case 'later than date or same date': {
			return (
				(this.formatDate(baseTodo) > this.formatDate(custFilterTodo)) ||
				(baseTodo.getFullYear() === custFilterTodo.getFullYear() &&
				baseTodo.getMonth() === custFilterTodo.getMonth() &&
				baseTodo.getDate() === custFilterTodo.getDate()) 
			  );
		}
		default: 
	}
	return true;
}
formatDate(date:Date):string {
return ''+date.getFullYear()+date.getMonth()+date.getDate()
}
}

