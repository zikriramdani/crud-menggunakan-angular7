import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { User, Employee, Pulsa, Operator } from 'src/app/models';
import { AlertService, EmployeeService, PulsaService, OperatorService, AuthenticationService } from 'src/app/services';

@Component({
    selector: 'app-employee',
    templateUrl: './employee.component.html',
    styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
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

    constructor(
        private router: Router,
        private formBuilder: FormBuilder,
        private alertService: AlertService,
        private authenticationService: AuthenticationService,
        private EmployeeService: EmployeeService,
        private pulsaService: PulsaService,
        private operatorService: OperatorService,
    ) {
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
            this.currentUser = user;
        });
    }

    ngOnInit() {
        this.employeeForm = this.formBuilder.group({
            phoneNumber: ['', Validators.required],
            operator: ['', Validators.required],
            pulsa: ['', Validators.required],
            harga: ['', Validators.required]
        });

        this.loadAllOperator();
        this.loadAllPulsa();
        this.loadAllEmployee();
        this.resetForm();
    }

    // convenience getter for easy access to form fields
    get f() { return this.employeeForm.controls; }

    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.currentUserSubscription.unsubscribe();
    }

    private loadAllEmployee() {
        // this.loading = true;
        this.EmployeeService.getAll().pipe(first()).subscribe(employees => {
            this.employees = employees;
            this.isLoading = false;
        });
    }

    private loadAllOperator() {
        this.operatorService.getAll().subscribe(operators => {
            this.operators = operators;
        });
    }

    private loadAllPulsa() {
        this.pulsaService.getAll().subscribe(pulsas => {
            this.pulsas = pulsas;
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
                this.loadAllEmployee();
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });
    }

    resetForm() {
        this.employeeForm.reset({
            'phoneNumber': '',
            'operator': '',
            'pulsa': '',
            'harga': ''
        });
    }

    onChange(event: any) {
        this.loadAllPulsa();
        const index = this.pulsas.findIndex(x => x.pulsa === this.employeeForm.get('pulsa').value);
        this.hargaModel = this.pulsas[index].harga;
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
