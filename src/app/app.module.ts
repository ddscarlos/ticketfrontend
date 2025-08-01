import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
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
import { ModalColaboradorComponent } from './components/modal-colaborador/modal-colaborador.component';
import { EscenariosComponent } from './pages/escenarios/escenarios.component';
import { CasosComponent } from './pages/casos/casos.component';
import { CasosInsComponent } from './pages/casos-ins/casos-ins.component'
import { QuillModule } from 'ngx-quill';
import { EscenariosInsComponent } from './pages/escenarios-ins/escenarios-ins.component';
import { ModalEscenarioComponent } from './components/modal-escenario/modal-escenario.component';
import { ResultadosCasoComponent } from './pages/resultados-caso/resultados-caso.component';
import { ModalResultadoComponent } from './components/modal-resultado/modal-resultado.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from "./guards/auth";
import { ExampleComponent } from './pages/example/example.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MenuComponent,
    LoginComponent,
    DashboardComponent,
    ModalColaboradorComponent,
    EscenariosComponent,
    CasosComponent,
    CasosInsComponent,
    EscenariosInsComponent,
    ModalEscenarioComponent,
    ResultadosCasoComponent,
    ModalResultadoComponent,
    ExampleComponent
  ],
  imports: [
    BrowserModule,
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
      apiKey: "AIzaSyD5vGKR2yl1fnF1aT6tn-gPxPANhSBBg8Q",
      libraries: ["places"],
    }),
    RouterModule.forRoot(ROUTES, { useHash: false }),
    NgSelectModule,
    FormsModule
  ],
  providers: [NgSelectConfig, DatePipe,{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent],
})
export class AppModule {}
