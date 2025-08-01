import {
  Component,
  TemplateRef,
  OnInit,
  Input,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AppComponent } from "../../app.component";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { ApiService } from "src/app/services/api.service";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { analyzeAndValidateNgModules } from "@angular/compiler";
import swal from "sweetalert2";

@Component({
  selector: 'app-escenarios-ins',
  templateUrl: './escenarios-ins.component.html',
  styleUrls: ['./escenarios-ins.component.css']
})
export class EscenariosInsComponent implements OnInit {
 
  modalRef: BsModalRef;
  titulopant : string = "Escenario"
  icono : string = "pe-7s-next-2"
  loading: boolean = false;

  //VARIABLES
    act:string='';
    inputDisabled: boolean = false;
    showFields: boolean = false;
    //ARRAYS PARA LISTAS
    dataAplicacion:any;
    dataEscenarios:any;
    dataAplicacionModulo:any;
    dataEstadoescenario:any;
    dataEquipoCalidad:any;
    //FIN ARRAY PARA LISTAS
    eqc_id:string= '0';
    apl_id:string= '0';
    obj_id:string= '0';
    eep_id:string= '0';
    esp_nombre:string='';
    esp_descri:string='';
    esp_cndini:string='';
    esp_fecini:string='';
    esp_fecfin:string='';
    esp_observ:string='';

    esp_feccie:string='';
    esp_codigo:string='';
    //VARIABLES PARA EL REGISTRO
    esp_id:string= '0';
    //FIN VARIABLES PARA EL REGISTRO
  //FIN VARIABLES

  //INICIO DATATABLES
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
    rowCallback: (row: Node, data: any[] | Object, index: number) => {
      const self = this;
      $("td", row).off("click");
      $("td", row).on("click", () => {
        this.rowSelected = data;
        if (this.rowSelected !== this.dataanteriorseleccionada) {
          this.dataanteriorseleccionada = this.rowSelected;
        }else{
          this.dataanteriorseleccionada = [];
        }
        let anular = document.getElementById('anular') as HTMLButtonElement;
        anular.disabled = false;
      });
      return row;
    },
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
  //FIN DATATABLES

  constructor(
    private router: Router,
    private modalService: BsModalService,
    private api: ApiService,
    private appComponent: AppComponent,
    private route: ActivatedRoute
  ) {
    this.appComponent.login = false;
  }

  ngOnInit() {
    
    this.loadAplicacion();
    this.loadEquipoCalidad();
    this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.esp_id = id;
          this.loadData();
        } else {
          this.esp_id = '0';
        }
      });

      this.route.queryParams.subscribe(params => {
        this.act = params['act'];
        this.inputDisabled = this.act === 'ver';

        if (this.act == 'edit' || this.act == 'ver') {
          this.showFields = true;  
          this.loadAplicacionModulo();
        }
      });
    }

  loadData() {
    this.loading = true;
    const data_post = {
      p_esp_id : (this.esp_id == null || this.esp_id === '') ? 0 : parseInt(this.esp_id),
      p_apl_id : (this.apl_id == null || this.apl_id === '') ? 0 : parseInt(this.apl_id),
      p_obj_id : (this.obj_id == null || this.obj_id === '') ? 0 : parseInt(this.obj_id),
      p_eep_id : (this.eep_id == null || this.eep_id === '') ? 0 : parseInt(this.eep_id),
      p_esp_codigo : '',
      p_esp_activo : 1,
    };
  
    this.api.Getescenariopruebasel(data_post).subscribe((data: any) => {
      this.apl_id= data[0].apl_id;
      this.obj_id= data[0].obj_id;
      this.eqc_id= data[0].eqc_id;
      this.esp_nombre= data[0].esp_nombre;
      this.esp_descri= data[0].esp_descri;
      this.esp_fecini= data[0].esp_fecini;
      this.esp_fecfin= data[0].esp_fecfin;
      this.esp_feccie= data[0].esp_feccie;
      this.esp_codigo= data[0].esp_codigo;
      this.esp_cndini= data[0].esp_cndini;
      this.esp_observ= data[0].esp_observ;
    });
    this.loading = false;
  }

  loadEquipoCalidad() {
    const data_post = {
      p_eqc_id: 0,
      p_usu_id: 0,
      p_eqc_apepat: '',
      p_eqc_apemat: '',
      p_eqc_activo: 9,
    };
    this.api.Getequipocalidadsel(data_post).subscribe((data: any) => {
      this.dataEquipoCalidad = data;
    });
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
    this.loading = true;
    const data_post = {
      p_aob_id: 0,
      p_apl_id: (this.apl_id == null || this.apl_id === '') ? 0 : parseInt(this.apl_id),
      p_obj_id: 0,
      p_aob_activo: 1,
    };

    this.api.Getaplicacionmodulo(data_post).subscribe((data: any) => {
      this.dataAplicacionModulo = data;
    });
    this.loading = false;
  }

  procesaRegistro(){
    this.loading = true;
    const dataPost = {
      p_esp_id:(this.esp_id == null || this.esp_id === '') ? 0 : parseInt(this.esp_id),
      p_apl_id:(this.apl_id == null || this.apl_id === '') ? 0 : parseInt(this.apl_id),
      p_obj_id:(this.obj_id == null || this.obj_id === '') ? 0 : parseInt(this.obj_id),
      p_eqc_id:(this.eqc_id == null || this.eqc_id === '') ? 0 : parseInt(this.eqc_id),
      p_esp_nombre:this.esp_nombre,
      p_esp_descri:this.esp_descri,
      p_esp_cndini:this.esp_cndini,
      p_esp_fecini:this.esp_fecini,
      p_esp_fecfin:this.esp_fecfin,
      p_esp_observ:this.esp_observ,
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
        this.api.Getescenariopruebareg(dataPost).subscribe((data: any) => {
          if(data[0].error == 0){
            this.loading = false;
            swal.fire({
              title: 'Exito',
              text: data[0].mensa.trim(),
              icon: 'success',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Aceptar',
            }).then((result) => {
              if (result.value) {
                setTimeout(() => {
                  this.router.navigate(["/escenarios"]);
                }, 300);
              }
            });
          }else{
            this.loading = false;
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
}
