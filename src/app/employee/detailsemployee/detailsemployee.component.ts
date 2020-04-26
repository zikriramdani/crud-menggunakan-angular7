import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { first, map, startWith } from 'rxjs/operators';

import { User, Employee } from 'src/app/models';
import { AlertService, EmployeeService, AuthenticationService } from 'src/app/services';

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

    isLoading = true;
    emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";

    myGroup = new FormControl();
    options: string[] = [
        'Group 1',
        'Group 2',
        'Group 3',
        'Group 4',
        'Group 5',
        'Group 6',
        'Group 7',
        'Group 8',
        'Group 9',
        'Group 10'
    ];
    filteredOptions: Observable<string[]>;

    minDate: Date;
    maxDate: Date;

    constructor(
        private router: Router,
        private formBuilder: FormBuilder,
        private alertService: AlertService,
        private authenticationService: AuthenticationService,
        private EmployeeService: EmployeeService,
    ) {
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
            this.currentUser = user;
        });
    }

    ngOnInit() {
        this.employeeForm = this.formBuilder.group({
            fullName: ['', Validators.required],
            birthDate: ['', Validators.required],
            email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
            basicSalary: ['', Validators.required],
            myGroupControl: ['', Validators.required]
        });
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }

}
