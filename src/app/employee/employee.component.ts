import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { User, Employee } from 'src/app/models';
import { AlertService, EmployeeService, AuthenticationService } from 'src/app/services';

import { MatTableDataSource } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';

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

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    ngOnInit() {
        this.loadAllEmployee();
        this.dataSource.paginator = this.paginator;
    }

    ngOnDestroy() {
        this.currentUserSubscription.unsubscribe();
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
        console.log('key');
    }

    private loadAllEmployee() {
        // this.loading = true;
        this.EmployeeService.getAll().pipe(first()).subscribe(employees => {
            this.dataSource = new MatTableDataSource(employees);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
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
