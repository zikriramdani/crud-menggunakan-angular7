import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { first, map, startWith } from 'rxjs/operators';

export interface User {
  name: string;
}

import { User, Employee, Pulsa, Operator } from 'src/app/models';
import { AlertService, EmployeeService, PulsaService, OperatorService, AuthenticationService } from 'src/app/services';

@Component({
    selector: 'app-add-employee',
    templateUrl: './addemployee.component.html',
    styleUrls: ['./addemployee.component.css']
})
export class AddEmployeeComponent implements OnInit {
    employeeForm: FormGroup;
    loading = false;
    submitted = false;

    currentUser: User;
    currentUserSubscription: Subscription;
    employees: Employee[] = [];

    public selectedPulsa = "";

    operators: Operator[] = [];
    pulsas: Pulsa[] = [];
    hargaModel: any;
    isLoading = true;

    emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";

    myControl = new FormControl();
    options: User[] = [
        {name: 'Mary'},
        {name: 'Shelley'},
        {name: 'Igor'}
    ];
    filteredOptions: Observable<User[]>;

    constructor(
        private router: Router,
        private formBuilder: FormBuilder,
        private alertService: AlertService,
        private authenticationService: AuthenticationService,
        private EmployeeService: EmployeeService,
        private pulsaService: PulsaService,
        private operatorService: OperatorService
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
            basicSalary: ['', Validators.required]
        });

        this.loadAllOperator();
        this.resetForm();

        this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.options.slice())
      );
    }

    displayFn(user: User): string {
        return user && user.name ? user.name : '';
    }

    private _filter(name: string): User[] {
        const filterValue = name.toLowerCase();

        return this.options.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
    }

    // convenience getter for easy access to form fields
    get f() { return this.employeeForm.controls; }

    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.currentUserSubscription.unsubscribe();
    }

    private loadAllOperator() {
        this.operatorService.getAll().subscribe(operators => {
            this.operators = operators;
        });
    }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.employeeForm.invalid) {
            return;
        }

        this.loading = true;
        this.EmployeeService.register(this.employeeForm.value).pipe(first()).subscribe(
            data => {
                this.alertService.success('Employee successful', true);
                this.router.navigate(['/employee']);
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });
    }

    resetForm() {
        this.employeeForm.reset({
            'fullName':'',
            'birthDate': '',
            'email': '',
            'basicSalary': ''
        });
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }

}
