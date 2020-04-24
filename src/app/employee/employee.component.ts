import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { User, Employee } from 'src/app/models';
import { AlertService, EmployeeService, AuthenticationService } from 'src/app/services';

@Component({
    selector: 'app-employee',
    templateUrl: './employee.component.html',
    styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
    currentUser: User;
    currentUserSubscription: Subscription;
    employees: Employee[] = [];
    isLoading = true;

    constructor(
        private router: Router,
        private alertService: AlertService,
        private authenticationService: AuthenticationService,
        private EmployeeService: EmployeeService,
    ) {
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
            this.currentUser = user;
        });
    }

    ngOnInit() {
        this.loadAllEmployee();
    }

    ngOnDestroy() {
        this.currentUserSubscription.unsubscribe();
    }

    private loadAllEmployee() {
        // this.loading = true;
        this.EmployeeService.getAll().pipe(first()).subscribe(employees => {
            this.employees = employees;
            this.isLoading = false;
        });
    }

    deleteEmployee(id: number) {
        this.EmployeeService.delete(id).pipe(first()).subscribe(() => {
            this.loadAllEmployee();
            this.alertService.success('Delete Employee successful', true);
        });
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }

}
