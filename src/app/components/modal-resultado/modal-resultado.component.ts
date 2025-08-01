import { Component,OnInit,ViewChild,OnChanges, SimpleChanges,ElementRef,EventEmitter,Input,Output } from '@angular/core';

import { Router } from "@angular/router";
import { AppComponent } from "../../app.component";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { ApiService } from "src/app/services/api.service";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { analyzeAndValidateNgModules } from "@angular/compiler";
import swal from "sweetalert2";

@Component({
  selector: 'app-modal-resultado',
  templateUrl: './modal-resultado.component.html',
  styleUrls: ['./modal-resultado.component.css']
})
export class ModalResultadoComponent implements OnInit {
    titulopant : string = "Resultado";
  //VARIABLES
    p_col_id: string = "0";
    p_tdi_id: string = "0";
    p_col_numdoi: string = "";
    p_tge_id: string = "0";
    p_ard_id: string = "0";
    p_col_apepat: string = "";
    p_col_apemat: string = "";

    cpt_id: string = '0';
    cap_id: string = '0';
    ecp_id: string = '0';
    cct_id: string = '0';
    cpt_caurai: string= '';
    cpt_fecdet: string= '';
    cpt_feccor: string= '';
    cpt_fecapr: string= '';
    cpt_resobt: string= '';
    cpt_observ: string= '';

    //ARREGLOS PARA LOS VALORES EN SELECT
    
    dataColaboradores: any;
    dataCasoPrueba: any;
    dataCriticidad: any;

    inputsDisabled:boolean=false;
    btnShowNuevoFechaCorrec:boolean=false;

    showAprobado:boolean=false;
    showconError:boolean=false;
    
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

  @Input() capId: string;
  @Input() cptId: string;
  @Input() modo: 'ver' | 'editar' | 'nuevo' = 'ver';

  @Output() registroGuardado = new EventEmitter<void>();
  @Output() cancelClicked: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private router: Router,
    private modalService: BsModalService,
    private api: ApiService,
    private appComponent: AppComponent
  ) {
    this.appComponent.login = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cptId'] || changes['modo']) {
      if (this.modo === 'nuevo') {
        this.inputsDisabled = false;
        this.btnShowNuevoFechaCorrec = true;
        this.resetFormulario();
      } else if (parseInt(this.cptId) > 0) {
        this.btnShowNuevoFechaCorrec = false;
        this.inputsDisabled = this.modo === 'ver';
        this.loadData();
      } else {
        this.btnShowNuevoFechaCorrec = false;
        this.inputsDisabled = false;
        this.resetFormulario();
      }
    }
  }
  
  ngOnInit() {
    this.cap_id = this.capId;
    this.loadEstadoCasoPrueba();
    this.loadCriticidadCasoPruebaTrazaSel();
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
  
  loadEstadoCasoPrueba() {
    const data_post = {
      p_ecp_id: 0,
      p_ecp_activo: 1
    };

    this.api.Getestadocasopruebasel(data_post).subscribe((data: any) => {
      this.dataCasoPrueba = data;
    });
  }
  
  loadCriticidadCasoPruebaTrazaSel() {
    const data_post = {
      p_cct_id: 0,
      p_cct_activo: 1
    };

    this.api.Getcriticidadcasopruebatrazasel(data_post).subscribe((data: any) => {
      this.dataCriticidad = data;
    });
  }

  loadEstadoCasoPruebaTraza() {
    if (parseInt(this.ecp_id) == 3) {
      this.showAprobado = true;
      this.showconError = false;
    }else if (parseInt(this.ecp_id) == 4) {
      this.showconError = true;
      this.showAprobado = false;
    }
  }

  loadData() {
    const data_post = {
      p_cpt_id: parseInt(this.cptId),
      p_cap_id: 0,
      p_cct_id: 0,
      p_ecp_id: 0,
      p_cpt_activo: 1,
    };

    this.api.Getcasopruebatrazasel(data_post).subscribe((data: any) => {
      this.ecp_id = data[0].ecp_id;
      this.cct_id = data[0].cct_id;
      this.cpt_caurai = data[0].cpt_caurai;
      this.cpt_fecdet = data[0].cpt_fecdet;
      this.cpt_feccor = data[0].cpt_feccor;
      this.cpt_resobt = data[0].cpt_resobt;
      this.cpt_observ = data[0].cpt_observ;
      if (parseInt(this.ecp_id) == 3) {
        this.showAprobado = true;
        this.showconError = false;
      }else if (parseInt(this.ecp_id) == 4) {
        this.showconError = true;
        this.showAprobado = false;
      }
    });
  }

  ProcesarRegistro(){
    const dataPost = {
      p_cpt_id:(this.cptId == null || this.cptId === '') ? 0 : parseInt(this.cptId),
      p_cap_id:(this.cap_id == null || this.cap_id === '') ? 0 : parseInt(this.cap_id),
      p_ecp_id:(this.ecp_id == null || this.ecp_id === '') ? 0 : parseInt(this.ecp_id),
      p_cct_id:(this.cct_id == null || this.cct_id === '') ? 0 : parseInt(this.cct_id),
      p_eqt_id:parseInt(localStorage.getItem("eqc_id")),
      p_cpt_caurai:this.cpt_caurai,
      p_cpt_fecdet:this.cpt_fecdet,
      p_cpt_feccor:this.cpt_feccor,
      p_cpt_fecapr:this.cpt_fecapr,
      p_cpt_resobt:this.cpt_resobt,
      p_cpt_observ:this.cpt_observ,
      p_cod_usuari:parseInt(localStorage.getItem("usuario"))
    };

    swal.fire({
      title: 'Mensaje',
      html: "¿Seguro de Guardar Datos?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ACEPTAR',
      cancelButtonText: 'CANCELAR'
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.Getcasopruebatrazareg(dataPost).subscribe((data: any) => {
          if(data[0].error == 0){
            swal.fire({
              title: 'Exito',
              text: data[0].mensa.trim(),
              icon: 'success',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Aceptar',
            }).then((result) => {
              if (result.value) {
                setTimeout(() => {
                  this.registroGuardado.emit();
                }, 300);
              }
            });
          }else{
            swal.fire({
                title: 'Error',
                text: data[0].mensa.trim(),
                icon: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar',
              });
          }
        });
      }
    })
  }

  resetFormulario() {
    this.ecp_id = '0';
    this.cct_id = '0';
    this.cpt_caurai = '';
    this.cpt_fecdet = '';
    this.cpt_feccor = '';
    this.cpt_resobt = '';
    this.cpt_observ = '';
  }

  onCancelar(){
    this.cancelClicked.emit();
  }
}
