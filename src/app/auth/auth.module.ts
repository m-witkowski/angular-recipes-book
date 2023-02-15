import { NgModule } from "@angular/core";
import { RouterModule } from '@angular/router';
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";
import { AuthComponent } from "./auth.component";

@NgModule({
    declarations: [
        AuthComponent
    ],
    imports: [
        FormsModule,
        SharedModule,
        CommonModule,
        RouterModule.forChild([{ path: '', component: AuthComponent }])
    ]
})
export class AuthModule { }