import { Component, OnDestroy, OnInit} from "@angular/core";
import { Subject, Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { DataStorageService } from "../shared/data-storage.service";

@Component({
    selector: 'app-header',
    templateUrl:'./header.component.html'
})

export class HeaderComponent implements OnInit, OnDestroy{

    isAuthenticated = false;
    private userSub : Subscription;

    constructor(private dataStorageService: DataStorageService, private authService: AuthService) {}

    ngOnInit() {
        this.userSub = this.authService.userSubject.subscribe(user => {
        this.isAuthenticated = !!user; // this does: !user ? false : true
        console.log(this.isAuthenticated)
        });
    }

    ngOnDestroy() {
        this.userSub.unsubscribe();
    }

    onLogout(){
        this.authService.logout();
    }

    onSaveData() {
        this.dataStorageService.storeRecipes();
    }
    
    onFetchData() {
        this.dataStorageService.fetchRecipes().subscribe();
    }
}