import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from 'src/app/guards';
import { LoginComponent } from 'src/app/login/login.component';
import { RegisterComponent } from 'src/app/register/register.component';

import { EmployeeComponent } from 'src/app/employee/employee.component';
import { AddEmployeeComponent } from 'src/app/employee/addemployee/addemployee.component';

const appRoutes: Routes = [
  { path: 'employee', component: EmployeeComponent, canActivate: [AuthGuard] },
  { path: 'addemployee', component: AddEmployeeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: '**', redirectTo: '/employee' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { useHash: true })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
