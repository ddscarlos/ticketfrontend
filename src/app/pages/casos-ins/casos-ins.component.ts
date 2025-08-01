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
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-casos-ins',
  templateUrl: './casos-ins.component.html',
  styleUrls: ['./casos-ins.component.css']
})

export class CasosInsComponent implements OnInit {
  
  modalRef: BsModalRef;
  titulopant : string = "Caso"
  icono : string = "pe-7s-next-2";
  loading: boolean = false;

  //VARIABLES
    act:string='';
    inputDisabled: boolean = false;
    showFields: boolean = false;
    //VARIABLES DECLARADAS EN LA BD
    cap_id:string='0';

    esp_id:string='0';
    tip_id:string='0';
    eqt_id:string='0';
    eqc_id:string='0';
    cap_nombre:string='';
    cap_descri:string='';
    cap_requis:string='';
    cap_datent:string='';
    cap_paseje:string='';
    cap_fecini:string='';
    cap_fecfin:string='';
    cap_resesp:string='';
    cap_resobt:string='';
    cap_flualt:string='';
    cap_observ:string='';
    
    esp_fecini:string='';
    esp_fecfin:string='';

    //FIN VARIABLES DECLARADAS EN LA BD

    //VARIABLES NO DECLARADAS EN LA BD
    colab_nombre="";
    esp_nombre="";
    //FIN VARIABLES NO DECLARADAS EN LA BD

    //ARREGLOS PARA LOS VALORES EN SELECT
    dataEscenarios: any;
    dataTipoPrueba: any;
    dataEquipoCalidad:any;
    //FIN PARA LOS ARREGLOS DE LOS VALORES EN SELECT
    
    //VARIABLES X
    contenidoHtml: string = '';
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
    this.route.queryParams.subscribe(params => {
      let espid = params['esp'];
      if (espid) {
        this.loadEscenariobyUrl(espid);
      }
    });
    
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.cap_id = id;
        this.loadData();
      } else {
        this.cap_id = '0';
      }
    });

    this.route.queryParams.subscribe(params => {
      this.act = params['act'];
      this.inputDisabled = this.act === 'ver';
      if (this.act == 'edit' || this.act == 'ver') {
        this.showFields = true;
      }
    });

    this.loadEscenarios();
    this.loadTipoCasos();
    this.loadEquipoCalidad();
  }

  loadData() {
    this.loading = true;
    const data_post = {
      p_cap_id: parseInt(this.cap_id),
      p_esp_id: 0,
      p_tip_id: 0,
      p_ecp_id: 0,
      p_eqc_id: 0,
      p_eqt_id: 0,
      p_cap_codigo: '',
      p_cap_activo: 9
    };
  
    this.api.Getcasopruebasel(data_post).subscribe((data: any) => {
      this.esp_id= data[0].esp_id;
      this.esp_nombre= data[0].esp_nombre;
      this.tip_id= data[0].tip_id;
      this.eqc_id= data[0].eqc_id;
      this.cap_nombre= data[0].cap_nombre;
      this.cap_descri= data[0].cap_descri;
      this.cap_requis= data[0].cap_requis;
      this.cap_datent= data[0].cap_datent;
      this.cap_paseje= data[0].cap_paseje;
      this.cap_fecini= data[0].cap_fecini; 
      this.cap_fecfin= data[0].cap_fecfin; 
      this.cap_resesp= data[0].cap_resesp; 
      this.cap_resobt= data[0].cap_resobt; 
      this.cap_flualt= data[0].cap_flualt; 
      this.cap_observ= data[0].cap_observ;
      this.colab_nombre= data[0].col_nomcom;
    });
    this.loading = false;
  }

  loadEscenariobyUrl(espid:number) {
    const data_post = {
      p_esp_id : espid,
      p_apl_id : 0,
      p_obj_id : 0,
      p_eep_id : 0,
      p_esp_codigo : '',
      p_esp_activo : 1,
    };
  
    this.api.Getescenariopruebasel(data_post).subscribe((data: any) => {
      this.esp_id = data[0].esp_id;  
      this.esp_nombre = data[0].esp_nombre;
      this.esp_fecini = data[0].esp_fecini;
      this.esp_fecfin = data[0].esp_fecfin;
    });
  }

  loadEscenarios() {
    const data_post = {
      p_esp_id : 0,
      p_apl_id : 0,
      p_obj_id : 0,
      p_eep_id : 0,
      p_esp_codigo : '',
      p_esp_activo : 1,
    };
  
    this.api.Getescenariopruebasel(data_post).subscribe((data: any) => {
      this.dataEscenarios = data;  
    });
  }
  
  onColaboradorSeleccionado(event: { eqt_id: number, col_nombre: string }) {
    this.eqt_id=event.eqt_id.toString();
    this.colab_nombre=event.col_nombre;

    this.modalRef.hide();
  }

  onEscenarioSeleccionado(event: { esp_id: number, esp_nombre: string }) {
    this.esp_id=event.esp_id.toString();
    this.esp_nombre=event.esp_nombre;

    this.loadEscenariobyUrl(event.esp_id);
    this.modalRef.hide();
  }

  loadTipoCasos() {
    const data_post = {
      p_tip_id: 0,
      p_tip_activo: 1
    };
    this.api.Gettipopruebasel(data_post).subscribe((data: any) => {
      this.dataTipoPrueba = data;
    });
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
  
  openModalShow(template: TemplateRef<any>, clase: string) {
    this.modalRef = this.modalService.show(template, {class: clase});
  }

  procesaRegistro(){
    this.loading = true;
    const dataPost = {
      p_cap_id: (this.cap_id == null || this.cap_id === '') ? 0 : parseInt(this.cap_id),
      p_esp_id: (this.esp_id == null || this.esp_id === '') ? 0 : parseInt(this.esp_id),
      p_tip_id: (this.tip_id == null || this.tip_id === '') ? 0 : parseInt(this.tip_id),
      p_eqc_id: (this.eqc_id == null || this.eqc_id === '') ? 0 : parseInt(this.eqc_id),
      p_eqt_id: parseInt(localStorage.getItem("eqt_id")),
      p_cap_nombre: this.cap_nombre,
      p_cap_descri: this.cap_descri,
      p_cap_requis: this.cap_requis,
      p_cap_datent: this.cap_datent,
      p_cap_paseje: this.cap_paseje,
      p_cap_fecini: this.cap_fecini,
      p_cap_fecfin: this.cap_fecfin,
      p_cap_resesp: this.cap_resesp,
      p_cap_resobt: this.cap_resobt,
      p_cap_flualt: this.cap_flualt,
      p_cap_observ: this.cap_observ,
      p_cod_usuari: parseInt(localStorage.getItem("usuario"))
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
        this.api.Getcasopruebareg(dataPost).subscribe((data: any) => {
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
                  this.router.navigate(["/casos"]);
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

  onCancelar(){
    this.modalRef.hide();
  }
}
