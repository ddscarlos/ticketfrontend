import { BrowserModule } from "@angular/platform-browser";
import { LOCALE_ID, NgModule } from '@angular/core';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { ROUTES } from "./app.routes";
import { NgSelectModule } from '@ng-select/ng-select';
import { NgSelectConfig } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DataTablesModule } from "angular-datatables";
import { AppComponent } from "./app.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { MenuComponent } from "./components/menu/menu.component";
import { AgmCoreModule } from "@agm/core";
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { ModalModule } from "ngx-bootstrap/modal";
import { LoginComponent } from "./pages/login/login.component";
import { TreeviewModule } from "ngx-treeview";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { NgxPrintModule } from "ngx-print";
import { NgxDropzoneModule } from 'ngx-dropzone';
import { DatePipe } from '@angular/common';
import { QuillModule } from 'ngx-quill';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from "./guards/auth";
import { ExampleComponent } from './pages/example/example.component';
import { TicketComponent } from './pages/ticket/ticket.component';
import { ReporteComponent } from './pages/reporte/reporte.component';
import { NuevoTicketComponent } from './pages/nuevo-ticket/nuevo-ticket.component';
import { ModalAnularComponent } from './components/modal-anular/modal-anular.component';
import { ModalCerrarComponent } from './components/modal-cerrar/modal-cerrar.component';
import { ModalResponderComponent } from './components/modal-responder/modal-responder.component';
import { ModalAsignarComponent } from './components/modal-asignar/modal-asignar.component';
import { ModalValidarComponent } from './components/modal-validar/modal-validar.component';
import { ModalVerComponent } from './components/modal-ver/modal-ver.component';
import { ModalAtencionComponent } from './components/modal-atencion/modal-atencion.component';
import { ModalTrazabilidadComponent } from './components/modal-trazabilidad/modal-trazabilidad.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { ModalPreviewComponent } from './components/modal-preview/modal-preview.component';
import { FixDropdownOverflowDirectiveDirective } from './directives/fix-dropdown-overflow-directive.directive';
import { ActionMenuComponent } from './components/action-menu/action-menu.component';
import { TemaayudaComponent } from './pages/temaayuda/temaayuda.component';
import { ModaltemaayudaComponent } from "./components/modal-temaayuda/modal-temaayuda.component";
import { TicketsPorAgenteComponent } from './pages/tickets-por-agente/tickets-por-agente.component';
import { AgentePorFechasComponent } from './pages/agente-por-fechas/agente-por-fechas.component';
import { AgentesComponent } from './pages/agentes/agentes.component';
import { ModalEquipoAgenteComponent } from './components/modal-equipo-agente/modal-equipo-agente.component';
import { TicketsTemaAyudaComponent } from './pages/tickets-tema-ayuda/tickets-tema-ayuda.component';

registerLocaleData(localeEs);

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MenuComponent,
    LoginComponent,
    DashboardComponent,
    ExampleComponent,
    TicketComponent,
    ReporteComponent,
    NuevoTicketComponent,
    ModalAnularComponent,
    ModalCerrarComponent,
    ModalResponderComponent,
    ModalAsignarComponent,
    ModalValidarComponent,
    ModalVerComponent,
    ModalAtencionComponent,
    ModalTrazabilidadComponent,
    ModalPreviewComponent,
    FixDropdownOverflowDirectiveDirective,
    ActionMenuComponent,
    TemaayudaComponent,
    ModaltemaayudaComponent,
    TicketsPorAgenteComponent,
    AgentePorFechasComponent,
    AgentesComponent,
    ModalEquipoAgenteComponent,
    TicketsTemaAyudaComponent
  ],
  imports: [
    BrowserModule,
    HighchartsChartModule,
    DataTablesModule,
    HttpClientModule,
    ReactiveFormsModule,
    QuillModule,
    GooglePlaceModule,
    NgxPrintModule,
    NgxDropzoneModule,
    TreeviewModule.forRoot(),
    ModalModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: "",
      libraries: ["places"],
    }),
    RouterModule.forRoot(ROUTES, { useHash: false, scrollPositionRestoration: 'enabled' }),
    NgSelectModule,
    FormsModule
  ],
  providers: [
    NgSelectConfig,
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: LOCALE_ID,
      useValue: 'es-PE'
    }
  ],
  entryComponents: [ActionMenuComponent],
  exports: [ActionMenuComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
