import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomersService } from '../../customers.service';

@Component({
  selector: 'app-add-to-cart',
  templateUrl: './add-to-cart.component.html',
  styleUrls: ['./add-to-cart.component.scss']
})
export class AddToCartComponent implements OnInit {

  outfitId: string;
  @Input() cartCount: number;
  constructor(private route: ActivatedRoute,private customersService: CustomersService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.outfitId = params.id;
    })
  }

  onAddToCart() {
    this.customersService.addToCart(this.outfitId,this.cartCount);
  }

}
