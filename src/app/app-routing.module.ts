import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { UploadComponent } from './upload/upload.component';
import { TestComponent } from './test/test.component';
import { TicketComponent } from './ticket/ticket.component';

const routes: Routes = [
  { path: '', component: HomeComponent},

  { path: 'test', component: TestComponent},

  { path: 'home', component: HomeComponent},

  { path: 'ticket', component: TicketComponent },
  { path: 'ticket/:tick', component: TicketComponent },
  { path: 'ticket/:tick/:tipo', component: TicketComponent },
  { path: 'ticket/:tick/:tipo/:mode', component: TicketComponent },
  { path: 'ticket/:tick/:tipo/:mode/:step', component: TicketComponent },

  { path: 'empirica', component: UploadComponent},
  { path: 'empirica/:folder', component: UploadComponent},

  { path: '**', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
