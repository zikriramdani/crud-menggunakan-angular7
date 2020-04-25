import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { first, map, startWith } from 'rxjs/operators';

export interface Group {
  name: string;
}

import { User, Employee } from 'src/app/models';
import { AlertService, EmployeeService, AuthenticationService } from 'src/app/services';

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

    isLoading = true;
    emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";

    myGroup = new FormControl();
    options: Group[] = [
        {name: 'Group 1'},
        {name: 'Group 2'},
        {name: 'Group 3'},
        {name: 'Group 4'},
        {name: 'Group 5'},
        {name: 'Group 6'},
        {name: 'Group 7'},
        {name: 'Group 8'},
        {name: 'Group 9'},
        {name: 'Group 10'}
    ];
    filteredOptions: Observable<Group[]>;

    constructor(
        private router: Router,
        private formBuilder: FormBuilder,
        private alertService: AlertService,
        private authenticationService: AuthenticationService,
        private EmployeeService: EmployeeService
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
            myGroup: null
        });

        this.filteredOptions();
        this.resetForm();
    }

    private filteredOptions(){
        this.filteredOptions = this.myGroup.valueChanges.pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : value.name),
            map(name => name ? this._filter(name) : this.options.slice())
        );
    }

    displayFn(group: Group): string {
        return group && group.name ? group.name : '';
    }

    private _filter(name: string): Group[] {
        const filterValue = name.toLowerCase();

        return this.options.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
    }

    get f() { return this.employeeForm.controls; }

    ngOnDestroy() {
        this.currentUserSubscription.unsubscribe();
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
            'basicSalary': '',
            'myGroup': ''
        });
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }

}
