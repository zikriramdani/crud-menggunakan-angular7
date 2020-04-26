import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Employee } from 'src/app/models/employee';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Employee[]>('/employees');
    }

    register(employee: Employee) {
        return this.http.post('/employees/register', employee);
    }

    delete(id: number) {
        return this.http.delete('/employees/' + id);
    }

    details(id: number) {
        return this.http.get('/employeesDetails/' + id);
    }

    // edit(employee: Employee) {
    //     return this.http.put(`/employeesEdit/${employee.id}`, employee);
    // }
}