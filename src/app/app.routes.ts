import { Routes } from "@angular/router";
import { LoginComponent } from "./pages/login/login.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { AuthGuard } from "./guards/auth.guard";
import { NoAuthGuard } from "./guards/no-auth.guard";
import { ExampleComponent } from "./pages/example/example.component";
import { TicketComponent } from "./pages/ticket/ticket.component";
import { ReporteComponent } from "./pages/reporte/reporte.component";
import { NuevoTicketComponent } from "./pages/nuevo-ticket/nuevo-ticket.component";

export const ROUTES: Routes = [
  { path: "example", component: ExampleComponent},

  { path: "dashboard", component: DashboardComponent , canActivate: [AuthGuard]},
  
  { path: "ticket", component: TicketComponent , canActivate: [AuthGuard]},
  { path: "nuevo-ticket", component: NuevoTicketComponent , canActivate: [AuthGuard]},
  { path: "reporte", component: ReporteComponent , canActivate: [AuthGuard]},
  
  /* { path: "casos", component: CasosComponent , canActivate: [AuthGuard]}, */

  { path: "", pathMatch: "full", redirectTo: "login" },
  { path: "**", pathMatch: "full", redirectTo: "login" },
  { path: "login", component: LoginComponent ,canActivate: [NoAuthGuard]}
];