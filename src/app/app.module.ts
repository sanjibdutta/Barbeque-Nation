import { NgReduxModule, NgRedux } from 'ng2-redux';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {IAppState, INITIALSTATE} from './store';
import { AppComponent } from './app.component';
import { ToDoComponent } from './to-do/to-do.component';
import {ToDo} from './models/to-do.models';
import {reducers} from './reducers';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DatepickerModule } from 'angular-mat-datepicker'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import {ToDoFilterPipe} from './to-do/pipes/to-do-pipe';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import {EffectsModule} from '@ngrx/effects' ;
import {ToDoEffects} from './effects' ;
import {ToDoService,ConfigService} from './services';
import { Store, StoreModule } from '@ngrx/store';


/* App level module class to host all import, declaration and provider at module level
so that all component and classes can access them. Toso: add inline comments */

@NgModule({
  declarations: [
    AppComponent,
    ToDoComponent,
    ToDoFilterPipe
  ],

  imports: [
     BrowserModule, FormsModule,ReactiveFormsModule, HttpModule,  EffectsModule.forRoot([ToDoEffects]),StoreModule.forRoot(reducers),
     HttpClientModule, NgReduxModule,  DatepickerModule, BrowserAnimationsModule , Ng2OrderModule

  ],
  providers: [ToDoService,ConfigService],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(/**private ngRedux: NgRedux<IAppState>**/) {

     //this.ngRedux.configureStore(ToDoReducer, INITIALSTATE);
  }
}
