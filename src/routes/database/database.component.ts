import { Component, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: 'database',
    templateUrl: './database.component.html'
})
export class DatabaseComponent {
    private activeRoute = inject(ActivatedRoute);

    constructor() {
        console.log(this.activeRoute.snapshot);
    }
}
