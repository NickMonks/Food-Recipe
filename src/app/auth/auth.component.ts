import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  isLoginMode = true;
  isLoading = false;
  error : string = null;

  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode
  }

  onSubmit(form: NgForm){

    this.error = null;

    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthResponseData>;

    this.isLoading = true;
    console.log(email, password)

    // check if we are in login mode
    if (this.isLoginMode) {
      authObs = this.authService.logIn(email, password)
    } else {
        // inject auth service
      authObs = this.authService.signUp(email, password)
    }

    // either with signup or signIn, we will subscribe so we do it here
    // once the observable returns data, we subscribe to it and use a callback
    authObs.subscribe(
      resData => {
        console.log(resData);
        this.isLoading = false;
        // once the authentication is successful, provide the recipes endpoint
        this.router.navigate(['/recipes']);
      }, 
      // errorMessage retrieves the observable of throwError from the pipe 
      errorMessage => {
        console.log(errorMessage);
        
        this.error = errorMessage;
        this.isLoading = false;
      }
    );

    

    form.reset();
  }

}
