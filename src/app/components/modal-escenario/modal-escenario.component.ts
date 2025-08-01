import { Component, OnInit, ViewChild, ElementRef , TemplateRef,EventEmitter,Input,Output } from '@angular/core';

import { Router } from "@angular/router";
import { AppComponent } from "../../app.component";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { ApiService } from "src/app/services/api.service";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { analyzeAndValidateNgModules } from "@angular/compiler";

@Component({
  selector: 'app-modal-escenario',
  templateUrl: './modal-escenario.component.html',
  styleUrls: ['./modal-escenario.component.css']
})
export class ModalEscenarioComponent implements OnInit {

    titulopant : string = "Escenario" 
  //VARIABLES
    //ARREGLOS PARA LOS VALORES EN SELECT
    dataAplicacion: any;
    dataAplicacionModulo: any;
    dataEscenarios: any;

    apl_id:string= '0';
    obj_id:string= '0';
    eep_id:string= '0';
    //FIN PARA LOS ARREGLOS DE LOS VALORES EN SELECT
  //FIN VARIABLES

  @ViewChild('contenidoDiv', { static: false }) contenidoDiv!: ElementRef;

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false;
  varTmpDisplayCreaReg: string = 'inline-block';
  rowSelected : any;
  dataanteriorseleccionada : any;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {
    pagingType: "full_numbers",
    pageLength: 10,
    dom: "Bfrtip",
    buttons: ["excel"],
    select: true,
    responsive: true,
    language: {
      processing: "Procesando...",

      search: "Buscar:",
      lengthMenu: "Mostrar _MENU_ &eacute;l&eacute;ments",
      info: "Mostrando desde _START_ al _END_ de _TOTAL_ elementos",
      infoEmpty: "Mostrando ningún elemento.",
      infoFiltered: "(filtrado _MAX_ elementos total)",
      infoPostFix: "",
      loadingRecords: "Cargando registros...",
      zeroRecords: "No se encontraron registros",
      emptyTable: "No hay datos disponibles en la tabla",
      select: {
        rows: {
          _: "%d filas seleccionadas",
          0: "Haga clic en una fila para seleccionarla",
          1: "Marca Modelo seleccionado",
        },
      },
      paginate: {
        first: "Primero",
        previous: "Anterior",
        next: "Siguiente",
        last: "Último",
      },
      aria: {
        sortAscending: ": Activar para ordenar la tabla en orden ascendente",
        sortDescending: ": Activar para ordenar la tabla en orden descendente",
      },
    },
  };

  @Input() inputPersona : any;;
  @Output() confirmClicked: EventEmitter<void> = new EventEmitter<void>();
  @Output() cancelClicked: EventEmitter<void> = new EventEmitter<void>();
  @Output() seleccionarEscenario = new EventEmitter<{ esp_id: number, esp_nombre: string }>();

  constructor(
    private router: Router,
    private modalService: BsModalService,
    private api: ApiService,
    private appComponent: AppComponent
  ) {
    this.appComponent.login = false;
  }

  ngOnInit() {
    this.loadAplicacion();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ngAfterViewInit() {
    this.dtTrigger.next();
  }

  restrictNumeric(e) {
    let input;
    if (e.metaKey || e.ctrlKey) {
      return true;
    }
    if (e.which === 32) {
     return false;
    }
    if (e.which === 0) {
     return true;
    }
    if (e.which < 33) {
      return true;
    }
    input = String.fromCharCode(e.which);
    return !!/[\d\s]/.test(input);
  }

  loadAplicacion() {
    const data_post = {
      p_apl_id: 0,
      p_apl_activo: 1,
    };

    this.api.Getaplicacionsel(data_post).subscribe((data: any) => {
      this.dataAplicacion = data;
    });
  }
  
  loadAplicacionModulo() {
    const data_post = {
      p_aob_id: 0,
      p_apl_id: (this.apl_id == null || this.apl_id === '') ? 0 : parseInt(this.apl_id),
      p_obj_id: 0,
      p_aob_activo: 1,
    };

    this.api.Getaplicacionmodulo(data_post).subscribe((data: any) => {
      this.dataAplicacionModulo = data;
    });
  }

  loadData() {
    const data_post = {
      p_esp_id : 0,
      p_apl_id : (this.apl_id == null || this.apl_id === '') ? 0 : parseInt(this.apl_id),
      p_obj_id : (this.obj_id == null || this.obj_id === '') ? 0 : parseInt(this.obj_id),
      p_eep_id : 0,
      p_esp_codigo : '',
      p_esp_activo : 1,
    };
  
    this.api.Getescenariopruebasel(data_post).subscribe((data: any) => {
      if (Array.isArray(data) && data.length > 0) {
        this.dataEscenarios = [...data];     
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next();
        });
      } else {
        this.dataEscenarios = [];
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.clear().draw();
        });
      }
    });
  }

  SeleccionarEscenario(esp_id: number, esp_nombre: string) {
    this.seleccionarEscenario.emit({ esp_id, esp_nombre });
  }

  onCancelar(){
    this.cancelClicked.emit();
  }
}
