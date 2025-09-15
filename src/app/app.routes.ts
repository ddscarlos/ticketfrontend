import { Routes } from "@angular/router";
import { LoginComponent } from "./pages/login/login.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { AuthGuard } from "./guards/auth.guard";
import { NoAuthGuard } from "./guards/no-auth.guard";
import { ExampleComponent } from "./pages/example/example.component";
import { TicketComponent } from "./pages/ticket/ticket.component";
import { ReporteComponent } from "./pages/reporte/reporte.component";
import { NuevoTicketComponent } from "./pages/nuevo-ticket/nuevo-ticket.component";
import { TemaayudaComponent } from "./pages/temaayuda/temaayuda.component";
import { TicketsPorAgenteComponent } from "./pages/tickets-por-agente/tickets-por-agente.component";
import { AgentePorFechasComponent } from "./pages/agente-por-fechas/agente-por-fechas.component";
import { AgentesComponent } from "./pages/agentes/agentes.component";
import { TicketsTemaAyudaComponent } from "./pages/tickets-tema-ayuda/tickets-tema-ayuda.component";

export const ROUTES: Routes = [
  { path: "example", component: ExampleComponent},
  { path: "dashboard", component: DashboardComponent , canActivate: [AuthGuard]},
  
  //TICKET
  { path: "ticket", component: TicketComponent , canActivate: [AuthGuard]},
  { path: "nuevo-ticket", component: NuevoTicketComponent , canActivate: [AuthGuard]},
  { path: "editar-ticket/:id", component: NuevoTicketComponent , canActivate: [AuthGuard]},
  
  //REPORTE
  { path: "reporte-dashboard", component: ReporteComponent , canActivate: [AuthGuard]},
  { path: "ticket-por-agente", component: TicketsPorAgenteComponent , canActivate: [AuthGuard]},
  { path: "agente-por-fechas", component: AgentePorFechasComponent , canActivate: [AuthGuard]},
  
  //MANTENIMIENTO
  { path: "temaayuda", component: TemaayudaComponent , canActivate: [AuthGuard]},
  { path: "agente", component: AgentesComponent , canActivate: [AuthGuard]},
  { path: "ticket-tema-ayuda", component: TicketsTemaAyudaComponent , canActivate: [AuthGuard]},

  /* { path: "casos", component: CasosComponent , canActivate: [AuthGuard]}, */
  { path: "", pathMatch: "full", redirectTo: "login" },
  { path: "**", pathMatch: "full", redirectTo: "login" },
  { path: "login", component: LoginComponent ,canActivate: [NoAuthGuard]}
];