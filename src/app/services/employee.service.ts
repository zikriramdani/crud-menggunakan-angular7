import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Employee } from 'src/app/models/employee';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

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

    edit(id: number, employee: Employee) {
        const url = '/employeesEdit/' + id;
        return this.http.put(url, employee, httpOptions);
    }
}