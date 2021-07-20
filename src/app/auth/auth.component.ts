import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import { AuthResponseData, AuthService } from './auth.service';
import * as fromApp from '../store/app.reducer'
import * as AuthActions from './store/auth.actions'

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {

  isLoginMode = true;
  isLoading = false;
  error : string = null;

  // ViewChild not also returns the reference; it also returns you the element of a type; in our case the Placeholder directive
  // it will return the first ocrurence. 
  @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective;

  private closeSub: Subscription;
  private storeSub: Subscription;

  constructor(private authService: AuthService,
              private router: Router,
              private componentFactoryResolver: ComponentFactoryResolver,
              private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.storeSub = this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.error = authState.authError;

      if (this.error) {
        this.showErrorAlert(this.error)
      }
    });
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode
  }

  onHandleError() {
    this.store.dispatch(new AuthActions.ClearError());
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
      
      this.store.dispatch(new AuthActions.LoginStart({email: email, password: password}))
    } else {
        this.store.dispatch(new AuthActions.SignupStart({email: email, password: password}))
    }

    form.reset();
  }

  private showErrorAlert(message: string) {
    // dynamically create the alert component. to do so, we need to use the component factory resolver,
    // which creates a factory that creates alerts
   const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);

   // tell angular were to insert component, you need to give the position to the DOM using the view reference
   // because the PlaceholderDirective exposes the view container as an attribute in the constructor, we can access the element!
   console.log(this.alertHost)
   const hostViewContainerRef = this.alertHost.viewContainerRef;

   // clear anything rendered in the component before
   hostViewContainerRef.clear();

   const componentRef = hostViewContainerRef.createComponent(alertComponentFactory);

   // take the instance and select the property of the component
   componentRef.instance.message = message;
   this.closeSub =componentRef.instance.close.subscribe(
     () => {
       // basically we subscribe to the button, and when is emitted close this subscription
       // AND clear the component
      this.closeSub.unsubscribe();
      hostViewContainerRef.clear();
     }
   );


  }

  ngOnDestroy() {
    if (this.closeSub){
      this.closeSub.unsubscribe();
    }

    if (this.storeSub){
      this.storeSub.unsubscribe();
    }
  }

}
