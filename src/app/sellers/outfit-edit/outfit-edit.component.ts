import { HttpClient } from "@angular/common/http";
import { Component, Input, OnInit } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { map } from "rxjs/operators";
import { ResizeWindowService } from "src/app/resize-window.service";
import { Outfit } from "src/app/shared/outfit.modle";
import { categories } from "src/app/shared/utility";
import { SellersService } from "../sellers.service";
@Component({
    selector: 'app-outfit-edit',
    templateUrl: './outfit-edit.component.html',
    styleUrls: ['./outfit-edit.component.scss']
})
export class OutfitEditComponent implements OnInit{
    public outfitForm: FormGroup = new FormGroup({});
    public selectedFile: File = null;
    public selectedFilePath: string = null;
    private selectedOutfit: Outfit = null;
    private editMode = false; 
    public categories = categories;
    public isMobile = window.innerWidth <= 420;

    constructor(private sellersService: SellersService,
                private route: ActivatedRoute,
                private resizeWindowService: ResizeWindowService) {}

    get controls() {
        return (this.outfitForm.get('instructions') as FormArray).controls;
    }

    ngOnInit() {
        this.route.data.pipe(
            map(data => {
                this.selectedOutfit = data.outfitData.outfit;
                this.editMode = !!this.selectedOutfit;
                this.initForm();
            })
        ).subscribe();

        this.resizeWindowService.deviceDimensions.subscribe(data => {
            this.isMobile = data.width <= 420;
        })
    }

    initForm() {
        let title = '';
        let description = '';
        let price: (string | number)='';
        let category = categories[0];
        let stockCount: (string | number) ='';
        let rating: (string | number) ='';
        let instructions = new FormArray([]);
        if(this.editMode) {
            title = this.selectedOutfit.title;
            description = this.selectedOutfit.description;
            price = this.selectedOutfit.price;
            category = this.selectedOutfit.category;
            stockCount = this.selectedOutfit.stockCount;
            rating = this.selectedOutfit.rating;
            this.selectedFilePath = this.selectedOutfit.imageUrl;
            instructions = this.populateInstructions();
        }

        this.outfitForm = new FormGroup({
            'title': new FormControl(title),
            'image': new FormControl('',[Validators.required]),
            'description': new FormControl(description,[Validators.required]),
            'price': new FormControl(price,[Validators.required]),
            'stockCount': new FormControl(stockCount,[Validators.required]),
            'rating': new FormControl(rating,[Validators.required]),
            'category': new FormControl(category,[Validators.required]),
            'instructions': instructions
        })

    }

    private populateInstructions(): FormArray {
        const newFormArray = new FormArray([]);
        this.selectedOutfit.instructions.forEach(i => {
            newFormArray.push(new FormGroup({
                'name': new FormControl(i[0]),
                'value': new FormControl(i[1])
            }))
        })
        return newFormArray;
    }

    onImageChange(event) {
        if(event.target.files[0]) this.selectedFile = event.target.files[0];
        const reader = new FileReader();
        if(this.selectedFile) {
            reader.readAsDataURL(this.selectedFile);
            reader.onload = () => {
                this.selectedFilePath = reader.result as string;
            }
        }      
    }

    private formGroupToFormData() {
        const instructions: [string,string][] = [];

        const formData = new FormData();

        const valueObj = this.outfitForm.value;
        for(let key in valueObj) {
            if(key == 'instructions') {
                const instructionsFG = valueObj[key]; 
                for(let i = 0 ; i < instructionsFG.length; i++) {
                    const currentFG = instructionsFG[i];
                    instructions.push([currentFG.name,currentFG.value])
                }
                formData.set('instructions',JSON.stringify(instructions));
            } else {
                formData.set(key,valueObj[key])
            }
        }
        return formData;
    }

    onAddInstruction() {
        (this.outfitForm.get('instructions') as FormArray).push(new FormGroup({
            'name': new FormControl(''),
            'value': new FormControl('')
        }))
    }

    onRemoveInstruction(i: number) {
        (this.outfitForm.get('instructions') as FormArray).removeAt(i);
    }

    onSubmit() {
        this.outfitForm.get('rating').setValue(Math.min(this.outfitForm.get('rating').value,5).toString())
        const formData = this.formGroupToFormData();
        formData.set('image',this.selectedFile)
        if(this.editMode) {
            this.sellersService.updateOutfit(formData,this.selectedOutfit._id);
        } else {
            this.sellersService.createOutfit(formData);
        }
    }
}