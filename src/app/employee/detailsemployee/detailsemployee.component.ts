import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { first, map, startWith } from 'rxjs/operators';

import { User, Employee } from 'src/app/models';
import { AlertService, EmployeeService, AuthenticationService } from 'src/app/services';

import { Location } from '@angular/common';

@Component({
    selector: 'app-details-employee',
    templateUrl: './detailsemployee.component.html',
    styleUrls: ['./detailsemployee.component.css']
})

export class DetailsEmployeeComponent implements OnInit {
    employeeForm: FormGroup;

    currentUser: User;
    currentUserSubscription: Subscription;
    employees: Employee[] = [];

    constructor(
        private router: Router,
        private formBuilder: FormBuilder,
        private alertService: AlertService,
        private authenticationService: AuthenticationService,
        private EmployeeService: EmployeeService,
        private activedRoute: ActivatedRoute,
        private location: Location
    ) {
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
            this.currentUser = user;
        });
    }

    ngOnInit() {
        this.employeeForm = this.formBuilder.group({
            fullName: [''],
            birthDate: [''],
            email: [''],
            basicSalary: [''],
            group: ['']
        });

        this.getEmployeesId();
    }

    getEmployeesId(id: number) {
        const id = +this.activedRoute.snapshot.paramMap.get('id');
        this.EmployeeService.details(id).pipe(first()).subscribe(
            employees => this.employees = employees
        );
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }

}
