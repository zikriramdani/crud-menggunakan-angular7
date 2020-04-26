import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
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

    displayedColumns: string[] = ['id', 'fullName', 'birthDate', 'basicSalary', 'group', 'details', 'update', 'delete'];
    dataSource = new MatTableDataSource<Employee>();
    @ViewChild(MatPaginator, {}) paginator: MatPaginator;

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
        this.dataSource.paginator = this.paginator;
        this.loadAllEmployee();
    }

    ngOnDestroy() {
        this.currentUserSubscription.unsubscribe();
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    private loadAllEmployee() {
        this.EmployeeService.getAll().pipe(first()).subscribe(employees => {
            this.dataSource = new MatTableDataSource(employees);
            console.log('data', this.dataSource)
            this.dataSource.paginator = this.paginator;
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
