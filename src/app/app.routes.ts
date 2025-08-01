import { Routes } from "@angular/router";
import { LoginComponent } from "./pages/login/login.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { EscenariosComponent } from "./pages/escenarios/escenarios.component";
import { CasosComponent } from "./pages/casos/casos.component";
import { CasosInsComponent } from "./pages/casos-ins/casos-ins.component";
import { EscenariosInsComponent } from "./pages/escenarios-ins/escenarios-ins.component";
import { ResultadosCasoComponent } from "./pages/resultados-caso/resultados-caso.component";
import { AuthGuard } from "./guards/auth.guard";
import { NoAuthGuard } from "./guards/no-auth.guard";
import { ExampleComponent } from "./pages/example/example.component";

export const ROUTES: Routes = [
  { path: "example", component: ExampleComponent},
  { path: "escenarios", component: EscenariosComponent , canActivate: [AuthGuard]},
  { path: "escenario-ins", component: EscenariosInsComponent , canActivate: [AuthGuard]},
  { path: "escenario-ins/:id", component: EscenariosInsComponent , canActivate: [AuthGuard]},
  { path: "resultados-caso/:id", component: ResultadosCasoComponent , canActivate: [AuthGuard]},
  
  { path: "dashboard", component: DashboardComponent , canActivate: [AuthGuard]},
  
  { path: "casos", component: CasosComponent , canActivate: [AuthGuard]},
  { path: "caso-ins", component: CasosInsComponent , canActivate: [AuthGuard]},
  { path: "caso-ins/:id", component: CasosInsComponent , canActivate: [AuthGuard]},

  { path: "", pathMatch: "full", redirectTo: "login" },
  { path: "**", pathMatch: "full", redirectTo: "login" },
  { path: "login", component: LoginComponent ,canActivate: [NoAuthGuard]}
];