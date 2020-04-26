import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from 'src/app/guards';
import { LoginComponent } from 'src/app/login/login.component';
import { RegisterComponent } from 'src/app/register/register.component';

import { EmployeeComponent } from 'src/app/employee/employee.component';
import { AddEmployeeComponent } from 'src/app/employee/addemployee/addemployee.component';
import { DetailsEmployeeComponent } from 'src/app/employee/detailsemployee/detailsemployee.component';
import { EditEmployeeComponent } from 'src/app/employee/editemployee/editemployee.component';

const appRoutes: Routes = [
    { path: 'employee', component: EmployeeComponent, canActivate: [AuthGuard],},
    { path: 'employee/add', component: AddEmployeeComponent, canActivate: [AuthGuard] },
    { path: 'employee/details/:id', component: DetailsEmployeeComponent, canActivate: [AuthGuard] },
    { path: 'employee/edit/:id', component: EditEmployeeComponent, canActivate: [AuthGuard] },
    
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },

    { path: '**', redirectTo: '/employee', pathMatch: 'full' }
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes, { useHash: true }),
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }
