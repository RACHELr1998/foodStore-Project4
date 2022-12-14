import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Unsubscribe } from "redux";
import { CustomerModel } from "src/app/models/customer-model.model";
import { authStore } from "src/app/redux/auth.state";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit, OnDestroy {
  public customer: CustomerModel;
  private unsubscribe: Unsubscribe;

  constructor(public router: Router) {}

  ngOnInit(): void {
    this.customer = authStore.getState().customer;
    this.unsubscribe = authStore.subscribe(() => {
      this.customer = authStore.getState().customer;
    });
  }

  ngOnDestroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}
