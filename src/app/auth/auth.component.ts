import { Component, ComponentFactoryResolver, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
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

  // ViewChild not also returns the reference; it also returns you the element of a type; in our case the Placeholder directive
  // it will return the first ocrurence. 
  @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective;

  constructor(private authService: AuthService,
              private router: Router,
              private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit(): void {
    
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode
  }

  onHandleError() {
    console.log(this.error)
    this.error = null; // this will remove the condition of the ngIf and close the alert
  }

  private showErrorAlert(message: string) {
    // dynamically create the alert component. to do so, we need to use the component factory resolver,
    // which creates a factory that creates alerts
   const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);

   // tell angular were to insert component, you need to give the position to the DOM using the view reference
   // because the PlaceholderDirective exposes the view container as an attribute in the constructor, we can access the element!
   console.log(this.alertHost)
   const hostViewContainerRef = this.alertHost.viewContainerRef

   // clear anything rendered in the component before
   hostViewContainerRef.clear();

   hostViewContainerRef.createComponent(alertComponentFactory);



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
        this.error = errorMessage;
        this.isLoading = false;
        this.showErrorAlert(errorMessage);
      }
    );

    

    form.reset();
  }

}
