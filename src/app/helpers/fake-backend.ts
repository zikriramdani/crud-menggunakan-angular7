import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // array in local storage for registered users
        let users: any[] = JSON.parse(localStorage.getItem('users')) || [];

        // array in local storage for registered employees
        let employees: any[] = JSON.parse(localStorage.getItem('employees')) || [];

        // array in local storage for registered pulsas
        // let employees: Array<object> = [
        //     { id: '1', fullName: 'Telkomsel' },
        //     { id: '2', fullName: 'zikri' },
        //     { id: '3', fullName: 'Telkomsel' },
        //     { id: '4', fullName: 'im3' },
        //     { id: '5', fullName: 'Telkomsel' },
        //     { id: '6', fullName: 'im3' },
        //     { id: '7', fullName: 'Telkomsel' },
        //     { id: '8', fullName: 'im3' },
        //     { id: '9', fullName: 'Telkomsel' },
        //     { id: '10', fullName: 'im3' },
        //     { id: '11', fullName: 'Telkomsel' },
        //     { id: '12', fullName: 'im3' },
        //     { id: '13', fullName: 'Telkomsel' },
        //     { id: '14', fullName: 'im3' },
        //     { id: '15', fullName: 'Telkomsel' },
        //     { id: '16', fullName: 'im3' },
        //     { id: '17', fullName: 'Telkomsel' },
        //     { id: '18', fullName: 'im3' },
        //     { id: '19', fullName: 'Telkomsel' },
        //     { id: '20', fullName: 'im3' },
        //     { id: '21', fullName: 'Telkomsel' },
        //     { id: '22', fullName: 'im3' },
        //     { id: '23', fullName: 'Telkomsel' },
        //     { id: '24', fullName: 'im3' },
        //     { id: '25', fullName: 'Telkomsel' }
        // ];

        // wrap in delayed observable to simulate server api call
        return of(null).pipe(mergeMap(() => {

            // authenticate
            if (request.url.endsWith('/users/authenticate') && request.method === 'POST') {
                // find if any user matches login credentials
                let filteredUsers = users.filter(user => {
                    return user.username === request.body.username && user.password === request.body.password;
                });

                if (filteredUsers.length) {
                    // if login details are valid return 200 OK with user details and fake jwt token
                    let user = filteredUsers[0];
                    let body = {
                        id: user.id,
                        username: user.username,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        token: 'fake-jwt-token'
                    };

                    return of(new HttpResponse({ status: 200, body: body }));
                } else {
                    // else return 400 bad request
                    return throwError({ error: { message: 'Username or password is incorrect' } });
                }
            }

            // get users
            if (request.url.endsWith('/users') && request.method === 'GET') {
                // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    return of(new HttpResponse({ status: 200, body: users }));
                } else {
                    // return 401 not authorised if token is null or invalid
                    return throwError({ status: 401, error: { message: 'Unauthorised' } });
                }
            }

            // register user
            if (request.url.endsWith('/users/register') && request.method === 'POST') {
                // get new user object from post body
                let newUser = request.body;

                // validation
                let duplicateUser = users.filter(user => { return user.username === newUser.username; }).length;
                if (duplicateUser) {
                    return throwError({ error: { message: 'Username "' + newUser.username + '" is already taken' } });
                }

                // save new user
                newUser.id = users.length + 1;
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));

                // respond 200 OK
                return of(new HttpResponse({ status: 200 }));
            }

            // get employees
            if (request.url.endsWith('/employees') && request.method === 'GET') {
                // check for fake auth token in header and return employees if valid, this security is implemented server side in a real application
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    return of(new HttpResponse({ status: 200, body: employees }));
                } else {
                    // return 401 not authorised if token is null or invalid
                    return throwError({ status: 401, error: { message: 'Unauthorised' } });
                }
            }

            // register employees
            if (request.url.endsWith('/employees/register') && request.method === 'POST') {
                // get new employees object from post body
                let newEmployee = request.body;

                // save new employees
                newEmployee.id = employees.length + 1;
                employees.push(newEmployee);
                localStorage.setItem('employees', JSON.stringify(employees));

                // respond 200 OK
                return of(new HttpResponse({ status: 200 }));
            }

            // delete employees
            if (request.url.match(/\/employees\/\d+$/) && request.method === 'DELETE') {
                // check for fake auth token in header and return employees if valid, this security is implemented server side in a real application
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    // find employees by id in employees array
                    let urlParts = request.url.split('/');
                    let id = parseInt(urlParts[urlParts.length - 1]);
                    for (let i = 0; i < employees.length; i++) {
                        let employee = employees[i];
                        if (employee.id === id) {
                            // delete employees
                            employees.splice(i, 1);
                            localStorage.setItem('employees', JSON.stringify(employees));
                            break;
                        }
                    }

                    // respond 200 OK
                    return of(new HttpResponse({ status: 200 }));
                } else {
                    // return 401 not authorised if token is null or invalid
                    return throwError({ status: 401, error: { message: 'Unauthorised' } });
                }
            }

            // details employees
            if (request.url.match(/\/employeesDetails\/\d+$/) && request.method === 'GET') {
                // check for fake auth token in header and return employee if valid, this security is implemented server side in a real application
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    // find employee by id in employees array
                    let urlParts = request.url.split('/');
                    let id = parseInt(urlParts[urlParts.length - 1]);
                    let matchedEmployees = employees.filter(
                        employee => { return employee.id === id; }
                    );
                    let employee = matchedEmployees.length ? matchedEmployees[0] : null;

                    return of(new HttpResponse({ status: 200, body: employee }));
                } else {
                    // return 401 not authorised if token is null or invalid
                    return throwError({ status: 401, error: { message: 'Unauthorised' } });
                }
            }

            // pass through any requests not handled above
            return next.handle(request);

        }))

            // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(materialize())
            .pipe(delay(500))
            .pipe(dematerialize());
    }
}

export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};