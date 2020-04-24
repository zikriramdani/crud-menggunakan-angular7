import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import icons from 'glyphicons';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// used to create fake backend
import { fakeBackendProvider } from 'src/app/helpers';
import { JwtInterceptor, ErrorInterceptor } from 'src/app/helpers';

import { AppComponent } from 'src/app/app.component';
import { HeaderComponent } from 'src/app/master/header/header.component';
import { NavbarComponent } from 'src/app/master/navbar/navbar.component';
import { LoginComponent } from 'src/app/login/login.component';
import { RegisterComponent } from 'src/app/register/register.component';
import { AlertComponent } from 'src/app/master/alert/alert.component';

// Pages
import { EmployeeComponent } from 'src/app/employee/pages/employee.component';

// Routing Module
import { AppRoutingModule } from 'src/app/app.routing.module';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        NavbarComponent,
        LoginComponent,
        RegisterComponent,
        AlertComponent,

        // Pages
        EmployeeComponent
    ],
    imports: [
        BrowserModule,
        NgbModule,
        AppRoutingModule,
        ReactiveFormsModule,
        HttpClientModule,
        // AngularFontAwesomeModule,
        // icons
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

        // provider used to create fake backend
        fakeBackendProvider
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
