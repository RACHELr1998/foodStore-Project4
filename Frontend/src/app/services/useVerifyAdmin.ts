import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "./auth.service";
import { NotifyService } from "./notify.service";

@Injectable({
  providedIn: "root",
})
export class UseVerifyAdmin implements CanActivate {
  public constructor(
    private notify: NotifyService,
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (!this.authService.isLoggedIn) {
      this.router.navigateByUrl("/home");
      this.notify.error("You are not logged in!");
      return false;
    }

    if (!this.authService.isAdmin()) {
      this.router.navigateByUrl("/");
      this.notify.error("Access denied");
      return false;
    }
    return true;
  }
}
