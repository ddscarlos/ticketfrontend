import { Component, TemplateRef, OnInit, Input, ViewChild} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AppComponent } from "../../app.component";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { ApiService } from "src/app/services/api.service";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { analyzeAndValidateNgModules } from "@angular/compiler";
import swal from "sweetalert2";

@Component({
  selector: 'app-casos',
  templateUrl: './casos.component.html',
  styleUrls: ['./casos.component.css']
})

export class CasosComponent implements OnInit {
  modalRef: BsModalRef;
  titulopant : string = "Casos"
  icono : string = "pe-7s-next-2"
  loading: boolean = false;
  
  cdu_id:string= '0';
  tdr_id:string= '0';
  nudore:string= '';
  fecini:string= '';
  fecfin:string= '';
  nuexre:string= '';
  bit_id:string= '0';
  tdo_id:string= '0';
  nudoor:string= '0';
  uor_id:string= '0';
  ten_id:string= '0';
  activo:string= '1';
  esp_id:string= '0';
  colab_nombre="";
  esp_nombre= "";
  p_cam_id: string = "0";
  p_cae_id: string = "0";
  p_cae_activo: string = "1";
  
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false;
  varTmpDisplayCreaReg: string = 'inline-block';
  rowSelected : any;
  dataanteriorseleccionada : any;
  
  dataDocumentos: any;
  dataTipoDocumento : any;
  dataUnidadOrganizativa : any;
  dataCasoPrueba:any;
  dataTipoPrueba:any;
  dataTester:any;
  dataCasos:any;

  p_tidoid: string = "0";
  p_coduor: string = "0";
  p_est_id: string = "1";
  
  eep_id:string= '0';
  tip_id:string= '0';

  cap_id:string= '0';
  ecp_id:string= '0';
  eqt_id:string= '0';
  eqc_id:string= '0';
  cap_codigo:string= '';
  cap_activo:string= '9';

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {
    pagingType: "full_numbers",
    pageLength: 10,
    dom: "Bfrtip",
    buttons: ["excel"],
    select: true,
    responsive: true,
    autoWidth: false,
    searching: true,
    columnDefs: [
      { width: "20px",  targets: 0 },
      { width: "20px",  targets: 1 },
      { width: "180px", targets: 2 },
      { width: "30px",  targets: 3 },
      { width: "15px",  targets: 4 },
      { width: "190px", targets: 5 },
      { width: "20px",  targets: 6 },
      { width: "20px",  targets: 7 },
      { width: "40px",  targets: 8 },
    ],
    rowCallback: (row: Node, data: any[] | Object, index: number) => {
      const self = this;
      $("td", row).off("click");
      $("td", row).on("click", () => {
        this.rowSelected = data;
        if (this.rowSelected !== this.dataanteriorseleccionada) {
          this.dataanteriorseleccionada = this.rowSelected;
        } else {
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
      lengthMenu: "Mostrar _MENU_ elementos",
      info: "Mostrando desde _START_ al _END_ de _TOTAL_ elementos",
      infoEmpty: "Mostrando ningún elemento.",
      infoFiltered: "(filtrado _MAX_ elementos total)",
      loadingRecords: "Cargando registros...",
      zeroRecords: "No se encontraron registros",
      emptyTable: "No hay datos disponibles en la tabla",
      select: {
        rows: {
          _: "%d filas seleccionadas",
          0: "Haga clic en una fila para seleccionarla",
          1: "Escenario seleccionado",
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
    this.loadEstadoCasoPrueba();
    this.loadTipoCasos();
    this.loadEquipoTester();

    this.route.queryParams.subscribe(params => {
      let espid = params['esp'];
      if (espid) {
        this.esp_id = espid; 
        this.loadEscenariobyUrl(parseInt(espid));
      }else{
        this.esp_id = '0';
      }
    });
    this.loadDataProceso();
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
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  descargaExcel() {
    let btnExcel = document.querySelector('#tablaDataProceso .dt-buttons .dt-button.buttons-excel.buttons-html5') as HTMLButtonElement;
    btnExcel.click();
  }

  ngAfterViewInit() {
    this.dtTrigger.next();
  }
  
  loadEstadoCasoPrueba() {
    const data_post = {
      p_ecp_id: 0,
      p_ecp_activo: 9
    };

    this.api.Getestadocasopruebasel(data_post).subscribe((data: any) => {
      this.dataCasoPrueba = data;
    });
  }
  
  loadEquipoTester() {
    const data_post = {
      p_eqt_id: 0,
      p_usu_id: 0,
      p_eqt_apepat: '',
      p_eqt_apemat: '',
      p_eqt_activo: 9,
    };
    this.api.Getequipotestersel(data_post).subscribe((data: any) => {
      this.dataTester = data;
    });
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

  loadDataProceso() {
    this.loading = true;
    const data_post = {
      p_cap_id: (this.cap_id == null || this.cap_id === '') ? 0 : parseInt(this.cap_id),
      p_esp_id: (this.esp_id == null || this.esp_id === '') ? 0 : parseInt(this.esp_id),
      p_tip_id: (this.tip_id == null || this.tip_id === '') ? 0 : parseInt(this.tip_id),
      p_ecp_id: (this.ecp_id == null || this.ecp_id === '') ? 0 : parseInt(this.ecp_id),
      p_eqc_id: (this.eqc_id == null || this.eqc_id === '') ? 0 : parseInt(this.eqc_id),
      p_eqt_id: (this.eqt_id == null || this.eqt_id === '') ? 0 : parseInt(this.eqt_id),
      p_cap_codigo: this.cap_codigo,
      p_cap_activo: (this.cap_activo == null || this.cap_activo === '') ? 1 : parseInt(this.cap_activo)
    };
  
    this.api.Getcasopruebasel(data_post).subscribe((data: any) => {
      if (Array.isArray(data) && data.length > 0) {
        this.dataCasos = [...data];     
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next();
        });
      } else {
        this.dataCasos = [];
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.clear().draw();
        });
      }
      this.loading = false;
    });
  }

  openModalShow(template: TemplateRef<any>, clase: string) {
    this.modalRef = this.modalService.show(template, {class: clase});
  }

  onCancelar(){
    this.modalRef.hide();
  }

  onColaboradorSeleccionado(event: { eqt_id: number, col_nombre: string }) {
    this.eqt_id=event.eqt_id.toString();
    this.colab_nombre=event.col_nombre;
    this.modalRef.hide();
  }
  
  onEscenarioSeleccionado(event: { esp_id: number, esp_nombre: string }) {
    this.esp_id=event.esp_id.toString();
    this.esp_nombre=event.esp_nombre;

    this.modalRef.hide();
  }

  ChangeEstadoCaso(id:any,cap_activo:any){
      let activ:number;  
      if (cap_activo == 1) {
        activ = 0;
      }else if(cap_activo == 0){
        activ = 1;
      }
  
      const dataPost = {
        p_cap_id: parseInt(id),
        p_cap_activo: activ,
      };
  
      swal.fire({
        title: 'Mensaje',
        html: "¿Seguro de Cambiar estado del Caso Prueba?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ACEPTAR',
        cancelButtonText: 'CANCELAR'
      }).then((result) => {
        if (result.isConfirmed) {
          this.api.Getcasopruebaact(dataPost).subscribe((data: any) => {
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
                    this.loadDataProceso();
                    this.router.navigate(["/casos"]);
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

  nuevoCaso(id:number){
    this.route.queryParams.subscribe(params => {
      const esp = params['esp'];

      if (esp !== undefined && esp !== null && esp !== '') {
        this.router.navigate(['/caso-ins'], { queryParams: { esp: esp } });
      } else {
        this.router.navigate(['/caso-ins']);
      }
    });
  }

  resultadosCaso(id:number){
    this.router.navigate(['/resultados-caso',id]); 
  }

  editarCaso(id:number,esp_id:number){
    this.router.navigate(['/caso-ins',id], { queryParams: { 
      act: 'edit',
      esp: esp_id
    } }); 
  }

  verCaso(id:number,esp_id:number){
    this.router.navigate(['/caso-ins',id], { queryParams: { 
      act: 'ver',
      esp: esp_id
    } }); 
  }
}
