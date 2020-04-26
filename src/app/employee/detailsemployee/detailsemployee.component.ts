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
    employees: any;

    selectedGroup: Group[] = [];
    myGroup = new FormControl();
    filteredGroup: Observable<Group[]>;
    arrGroup = [
        new Group('1', 'Group 1'),
        new Group('2', 'Group 2'),
        new Group('3', 'Group 3'),
        new Group('4', 'Group 4'),
        new Group('5', 'Group 5'),
        new Group('6', 'Group 6'),
    ];

    employeesId: number;
    groupId: number;

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
            group: new FormControl(this.selectedGroup)
        });

        this.filteredGroup = this.myGroup.valueChanges.pipe(
            startWith(''),
            map((val) => this.filter(val))
        );

        this.getEmployeesId();
    }

    filter(val: any): Group[] {
        return this.arrGroup.filter((item: any) => {
          if (typeof val === 'object') { val = "" };
          const TempString = item.name;
          return TempString.toLowerCase().includes(val.toLowerCase());
        });
    }

    AutoCompleteDisplay(item: any): string {
        if (item == undefined) { return }
        return item.name;
    }

    OnGroupSelected(selectedGroup) {
        // console.log('### Trigger');
        // console.log(selectedGroup);
        // console.log(this.selectedGroup);
    }

    getEmployeesId() {
        const id = +this.activedRoute.snapshot.paramMap.get('id');
        this.EmployeeService.details(id).pipe(first()).subscribe(employees => {
            this.employees = employees;
        });
    }

    ngOnDestroy() {
        this.currentUserSubscription.unsubscribe();
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }

}

export class Group {
  constructor(
    public id: string,
    public name: string,
  ) { }
}