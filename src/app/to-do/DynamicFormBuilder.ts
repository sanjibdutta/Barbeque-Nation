import { FormGroup, FormControl,Validators } from '@angular/forms';

export class DynamicFormBuilder {
    
    buildGroupFromAnyobject (anyObject: any, validOptions: Object):FormGroup {
        var fControlsObect: any = new Object();
        Object.keys(anyObject).forEach((key)=>{
            
            var valids: any[] =[];
             
            if(validOptions[key] && validOptions[key]['required']) {
                valids.push(Validators.required)
            }

            if(validOptions[key] && validOptions[key]['minLength']) {
                valids.push(Validators.minLength(validOptions[key]['minLength']))
            }
            if(validOptions[key] && validOptions[key]['maxLength']) {
                valids.push(Validators.maxLength(validOptions[key]['maxLength']))
            } 

            if(validOptions[key] && validOptions[key]['pattern']) {
                valids.push(Validators.pattern(validOptions[key]['pattern']))
            }     
            
                         
            fControlsObect[key] = new FormControl (anyObject[key],valids);                      
       })

       return new FormGroup(fControlsObect);

    }

}
