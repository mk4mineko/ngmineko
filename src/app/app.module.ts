import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule, enableProdMode } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '@angular/material'; import 'hammerjs';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { UploadComponent } from './upload/upload.component';
import { TestComponent } from './test/test.component';

import { TicketComponent } from './ticket/ticket.component';
import { Step1Component } from './ticket/step1/step1.component';
import { Step2onlComponent } from './ticket/step2onl/step2onl.component';
import { Step2faxComponent } from './ticket/step2fax/step2fax.component';
import { Step2posComponent } from './ticket/step2pos/step2pos.component';
import { Step3Component } from './ticket/step3/step3.component';

enableProdMode();

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UploadComponent,
    TestComponent,
    TicketComponent,
    Step1Component,
    Step2onlComponent,
    Step2faxComponent,
    Step2posComponent,
    Step3Component,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule, ReactiveFormsModule,
    HttpModule,
    AppRoutingModule,
    MaterialModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  providers: [Title],
  bootstrap: [AppComponent]
})
export class AppModule { }
