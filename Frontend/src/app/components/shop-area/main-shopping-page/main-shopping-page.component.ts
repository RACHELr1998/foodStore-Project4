import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Unsubscribe } from "redux";
import { CartItemModel } from "src/app/models/cartItem-model.model";
import { CustomerModel } from "src/app/models/customer-model.model";
import RoleEnum from "src/app/models/role-enum.model";
import { authStore } from "src/app/redux/AuthState";
import { cartsStore } from "src/app/redux/carts.state";
import { CartService } from "src/app/services/cart.service";
import { NotifyService } from "src/app/services/notify.service";

@Component({
  selector: "app-main-shopping-page",
  templateUrl: "./main-shopping-page.component.html",
  styleUrls: ["./main-shopping-page.component.css"],
})
export class MainShoppingPageComponent implements OnInit {
  public customer: CustomerModel;
  public opened: boolean = true;
  public allCartItemsOfCart: CartItemModel[] = [];
  public totalAmount: number;
  private unsubscribe: Unsubscribe;

  constructor(
    private router: Router,
    public cartService: CartService,
    public notifyService: NotifyService,
    public dialog: MatDialog
  ) {}

  async ngOnInit() {
    //Check the role of customer:
    this.customer = authStore.getState().customer;

    //If the role === admin -> navigate to admin-area:
    if (this.customer.role == RoleEnum.Admin) {
      this.router.navigateByUrl("/admin-home");
    }

    //If the cart is empty don't open the sidenav:
    if (cartsStore.getState().cartItems.length === 0) {
      this.opened = false;
    }

    const cart = await this.cartService.getCart();
    this.allCartItemsOfCart = await this.cartService.getAllItemsByCart(
      cart?._id
    );
    this.totalAmount = this.cartService.getTotalPriceCart();

    this.unsubscribe = cartsStore.subscribe(() => {
      this.allCartItemsOfCart = cartsStore.getState().cartItems;
      this.totalAmount = this.cartService.getTotalPriceCart();
    });
  }
}