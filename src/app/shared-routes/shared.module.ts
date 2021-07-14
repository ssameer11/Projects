import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
import { OutfitDetailComponent } from "./outfit-detail/outfit-detail.component";
import { OutfitListComponent } from "./outfit-list/outfit-list.component";
import { SharedRoutes } from "./shared-routes.module";
import { SharedComponent } from "./shared.component";

@NgModule({
    declarations: [
        SharedComponent,
        OutfitDetailComponent,
        OutfitListComponent,
    ],
    imports: [
        CommonModule,
        SharedRoutes,
        RouterModule,
        SharedModule],
})
export class SharedRoutesModule {}