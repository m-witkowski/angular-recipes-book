import { DataStorageService } from './../shared/data-storage.service';
import { Component, OnDestroy, OnInit } from "@angular/core";
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
    isAuthenticated = false;
    private userSub: Subscription;

    constructor(private dataStorage: DataStorageService, private authSerice: AuthService) { }

    ngOnInit(): void {
        this.userSub = this.authSerice.user.subscribe(user => {
            this.isAuthenticated = !!user;
        });
    }

    onSaveData() {
        this.dataStorage.storeRecipes();
    }

    onFetchData() {
        this.dataStorage.fetchRecipes().subscribe();
    }

    onLogout() {
        this.authSerice.loggout();
    }

    ngOnDestroy(): void {
        this.userSub.unsubscribe();
    }
}