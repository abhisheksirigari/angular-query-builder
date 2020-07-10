import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ModalModule } from 'ngx-bootstrap/modal';
import { QueryBuilderModule } from "angular2-query-builder";

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QueryComponent } from './query/query/query.component';
import { ConditionBuilderComponent } from './condition-builder/condition-builder/condition-builder.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    ConditionBuilderComponent,
    QueryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
    }),
    QueryBuilderModule
  ],
  providers: [],
  entryComponents: [ConditionBuilderComponent, QueryComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
