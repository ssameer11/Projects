import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ErrorComponent } from "./error/error.component";
// import { ErrorComponent } from "./error/error.component";
import { OutfitItemComponent } from "./outfit-item/outfit-item.component";
import { SpinnerComponent } from './spinner/spinner.component';

@NgModule({
    declarations: [
        OutfitItemComponent,
        SpinnerComponent,
        ErrorComponent
    ],
    imports: [CommonModule,FormsModule],
    exports: [CommonModule,OutfitItemComponent,FormsModule,SpinnerComponent,ErrorComponent]
})
export class SharedModule {}