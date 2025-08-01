import { Component, TemplateRef, OnInit, Input, ViewChild, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AppComponent } from "../../app.component";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { ApiService } from "src/app/services/api.service";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { analyzeAndValidateNgModules } from "@angular/compiler";
import swal from "sweetalert2";

@Component({
  selector: 'app-resultados-caso',
  templateUrl: './resultados-caso.component.html',
  styleUrls: ['./resultados-caso.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class ResultadosCasoComponent implements OnInit {
  modalRef: BsModalRef;
  titulopant : string = "Resultados del Caso"
  icono : string = "pe-7s-next-2";
  loading: boolean = false;
  
  sel_cpt_id:string= '0';
  cpt_id:string= '0';
  text_caso:string= '';
  cap_id:string= '0';
  cct_id:string= '0';
  ecp_id:string= '0';
  cpt_activo:string= '1';

  btnshowadd:boolean=true;
  modoModal: 'ver' | 'editar' | 'nuevo' = 'ver';
  
  @ViewChild('OpenModalResultadoBuscar', { static: false }) OpenModalResultadoBuscar: TemplateRef<any>;

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false;
  varTmpDisplayCreaReg: string = 'inline-block';
  rowSelected : any;
  dataanteriorseleccionada : any;
  
  dataDocumentos: any;
  dataTipoDocumento : any;
  dataResultados : any;

  
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {
    pagingType: "full_numbers",
    pageLength: 10,
    dom: "Bfrtip",
    buttons: ["excel"],
    select: true,
    responsive: true,
    autoWidth: false,
    searching: false,
    columnDefs: [
      { width: "15px",  targets: 0 },
      { width: "15px",  targets: 1 },
      { width: "550px",   targets: 2 },
      { width: "30px",   targets: 3 },
      { width: "30px",   targets: 4 },
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
          1: "Trazabilidad seleccionada",
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
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.cap_id = id;
        this.loadCasobyUrl(parseInt(id));
      } else {
        this.cap_id = '0';
      }
    });

    this.loadDataProceso();
  }
  
  loadCasobyUrl(espid:number) {
    const data_post = {
      p_cap_id: espid,
      p_esp_id: 0,
      p_tip_id: 0,
      p_ecp_id: 0,
      p_eqc_id: 0,
      p_eqt_id: 0,
      p_cap_codigo: '',
      p_cap_activo: 1
    };
  
    this.api.Getcasopruebasel(data_post).subscribe((data: any) => {
      this.text_caso = data[0].cap_codigo + ' - '+ data[0].cap_nombre;
      if (data[0].ecp_id == 3) {
        this.btnshowadd = false;
      }else{
        this.btnshowadd = true;
      }
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

  loadDataProceso() {
    this.loading = true;
    const data_post = {
      p_cpt_id: (this.cpt_id == null || this.cpt_id === '') ? 0 : parseInt(this.cpt_id),
      p_cap_id: (this.cap_id == null || this.cap_id === '') ? 0 : parseInt(this.cap_id),
      p_cct_id: (this.cct_id == null || this.cct_id === '') ? 0 : parseInt(this.cct_id),
      p_ecp_id: (this.ecp_id == null || this.ecp_id === '') ? 0 : parseInt(this.ecp_id),
      p_cpt_activo: (this.cpt_activo == null || this.cpt_activo === '') ? 0 : parseInt(this.cpt_activo)
    };
  
    this.api.Getcasopruebatrazasel(data_post).subscribe((data: any) => {
      if (Array.isArray(data) && data.length > 0) {
        this.dataResultados = [...data];     
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next();
        });
      } else {
        this.dataResultados = [];
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.clear().draw();
        });
      }
      this.loading = false;
    });
  }

  ChangeEstadoTraza(cpt_id:any,cpt_activo:any){
    let activ:number;  
    if (cpt_activo == 1) {
      activ = 0;
    }else if(cpt_activo == 0){
      activ = 1;
    }

    const dataPost = {
      p_cpt_id: parseInt(cpt_id),
      p_cpt_activo: activ,
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
        this.api.Getcasopruebatrazaact(dataPost).subscribe((data: any) => {
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
                  this.loadCasobyUrl(parseInt(this.cap_id));
                  this.loadDataProceso();
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

  openModalShow(template: TemplateRef<any>, clase: string, cpt_id?: string) {
    if (cpt_id) {
      this.sel_cpt_id = cpt_id;
    }
    this.modalRef = this.modalService.show(template, {class: clase});
  }

  agregarNuevoResultado() {
    this.modoModal = 'nuevo';
    this.sel_cpt_id = '0'; // aseguramos que sea un nuevo registro
    this.openModalShow(this.OpenModalResultadoBuscar, 'modal-xl', '0');
  }
  
  verResultadoDetalle(cpt_id: string) {
    this.modoModal = 'ver';
    this.openModalShow(this.OpenModalResultadoBuscar, 'modal-lg', cpt_id);
  }
  
  EditarTraza(cpt_id: string) {
    this.modoModal = 'editar';
    this.openModalShow(this.OpenModalResultadoBuscar, 'modal-lg', cpt_id);
  }

  onCancelar(){
    this.modalRef.hide();
  }

  onColaboradorSeleccionado(event: { tst_id: number, col_nombre: string }) {
    this.modalRef.hide();
  }
  
  onRegistroGuardado() {
    this.modalRef.hide();
    this.loadDataProceso();
    this.loadCasobyUrl(parseInt(this.cap_id));
  }
}
