import { Component,TemplateRef,OnInit,Input,ViewChild,HostListener} from "@angular/core";
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { ApiService } from "src/app/services/api.service";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { analyzeAndValidateNgModules } from "@angular/compiler";
import swal from "sweetalert2";

interface PermisoBtn {
  bot_id: number;
  bot_descri: string;
  pus_activo: number | string;
}

@Component({
  selector: 'app-temaayuda',
  templateUrl: './temaayuda.component.html',
  styleUrls: ['./temaayuda.component.css']
})
export class TemaayudaComponent implements OnInit {
    private permSet = new Set<number>();
    btnPerm = {
      nuevo: false,
      excel: false,
    };
    titulopant : string = "Tema de Ayuda";
    icono : string = "pe-7s-next-2";
    loading: boolean = false;
    exportarHabilitado: boolean = false;
    modalRef?: BsModalRef;
    selectedTemaAyuda: any;
    modalMode: 'create' | 'edit' = 'create';
    modalReadOnly = false;
  
    btnnuevo:boolean=false;
    btnexcel:boolean=false;
  
    ObjetoMenu: any[] = [];
    jsn_permis: any[] = [];
    ruta: string = '';
    objid : number = 0 ;
  
    //INICIO PARAMETROS
    dataTemaAyudaPadre:any;
    dataTemaayuda:any;
    dataEquipo:any;
    dataAgente:any;
    
    usu_id: string = '';
    tea_descri:string='';
    tea_idpadr:string='0';
    age_id:string='0';
    equ_id:string='0';
  
    @ViewChild('OpenModalTemaAyuda', { static: false }) OpenModalTemaAyuda!: TemplateRef<any>;
  
    @ViewChild(DataTableDirective, { static: false })
    dtElement: DataTableDirective;
    isDtInitialized: boolean = false;
  
    rowSelected : any;
    dataanteriorseleccionada : any;
    
    dtTrigger: Subject<any> = new Subject<any>();
    dtOptions: any = {
      destroy: false,
      retrieve: true,
      pagingType: 'full_numbers',
      pageLength: 10,
      dom: 'Bfrtip',
      buttons: ['excel'],
      select: true,
      autoWidth: false,
      searching: true,
      responsive: {
        details: {
          type: 'inline',
          target: 'tr'
        },
        breakpoints: [
          { name: 'xl', width: Infinity },
          { name: 'lg', width: 1400 },
          { name: 'md', width: 1200 },
          { name: 'sm', width: 992 },
          { name: 'xs', width: 768 }
        ]
      },
      columnDefs: [
        { targets: 0, width : '20%'},
        { targets: 1, width : '20%'},
        { targets: 2, width : '20%'},
        { targets: 3, width : '10%'},
        { targets: 4, width : '10%'},
        { targets: 5, width : '7%'},
        { targets: 6, width : '7%'}
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
  
          const anular = document.getElementById('anular') as HTMLButtonElement | null;
          if (anular) {
            anular.disabled = false;
          }
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
            1: "Tema de Ayuda seleccionado",
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
      private api: ApiService
    ) {
    }
  
    ngOnInit(): void {
      this.usu_id = localStorage.getItem('usuario');
      this.loadTemadeAyudaPadre();
      this.loadAgente();
      this.loadEquipo();
      this.getObjetoMenu();
      this.ObtenerObjId();
      this.loadDataProceso();
      console.log(this.ObjetoMenu[0]);
    }
  
    ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
    }
  
    descargaExcel() {
      let btnExcel = document.querySelector('#tablaDataProceso .dt-buttons .dt-button.buttons-excel.buttons-html5') as HTMLButtonElement;
      btnExcel.click();
    }

    anularTemaAyuda(tea_id) {
      const dataPost = {
        p_tea_id:(tea_id == null || tea_id === '') ? 0 : parseInt(tea_id),
        p_tea_usureg:parseInt(localStorage.getItem("usuario"))
      };
  
      swal.fire({
        title: 'Mensaje',
        html: "¿Seguro de Anular Tema de Ayuda?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ACEPTAR',
        cancelButtonText: 'CANCELAR'
      }).then((result) => {
        if (result.isConfirmed) {
          this.api.gettemaayudaanu(dataPost).subscribe((data: any) => {
            if(data[0].error == 0){
              swal.fire({
                title: 'Exito',
                html: data[0].mensa.trim(),
                icon: 'success',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar',
              }).then((result) => {
                if (result.value) {
                  setTimeout(() => {
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
  
    @HostListener('window:resize') onResize() { this.adjustDt(); }
  
    ngAfterViewInit() {
      this.dtTrigger.next();
      setTimeout(() => this.adjustDt(), 0);
    }
  
    private adjustDt() {
      if (!this.dtElement) return;
      this.dtElement.dtInstance.then((dt: any) => {
        dt.columns.adjust();
        //if (dt.responsive.recalc) dt.responsive.recalc();
      });
    }
  
    CerrarModalProceso() {
      this.loadDataProceso();
      if (this.modalRef) {
        this.modalRef.hide();
      }
    }

    TemaayudaIns() {
      this.selectedTemaAyuda = null;         // sin datos
      this.modalMode = 'create';
      this.modalRef = this.modalService.show(this.OpenModalTemaAyuda, { class: 'modal-lg' });
    }
  
    loadDataProceso() {
      this.loading = true;
  
      const data_post = {
        p_tea_id:0,
        p_tea_idpadr:(this.tea_idpadr == null || this.tea_idpadr === '') ? 0 : parseInt(this.tea_idpadr),
        p_tea_descri:this.tea_descri,
        p_equ_id:(this.equ_id == null || this.equ_id === '') ? 0 : parseInt(this.equ_id),
        p_age_id:(this.age_id == null || this.age_id === '') ? 0 : parseInt(this.age_id),
        p_tea_activo:1,
      };
  
      this.api.gettemaayudasel(data_post).subscribe({
        next: (data: any[]) => {
          if (Array.isArray(data) && data.length > 0) {
            this.dataTemaayuda = data.map(item => ({
              ...item,
              bot_botons_parsed: this.safeParse(item.bot_botons)
            }));
            this.exportarHabilitado = true;
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              dtInstance.destroy();
              this.dtTrigger.next();
            });
          } else {
            this.dataTemaayuda = [];
            this.exportarHabilitado = false;
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              dtInstance.clear().draw();
            });
          }
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.exportarHabilitado = false;
          swal.fire('Error', 'Ocurrió un error al cargar los datos', 'error');
        }
      });
    }
  
    ObtenerObjId(){
      this.ruta = this.router.url.replace(/^\/+/, '');
      console.log('Ruta actual:', this.ruta);
  
      const match = this.ObjetoMenu.find(item => item.obj_enlace === this.ruta);
      if (match) {
        this.objid = match.obj_id;
        this.jsn_permis = match.jsn_permis;
  
        let permisos: PermisoBtn[] = [];
        const raw = match.jsn_permis;
    
        try {
          const parsed = (typeof raw === 'string') ? JSON.parse(raw) : raw;
          permisos = Array.isArray(parsed) ? parsed : [];
        } catch {
          permisos = [];
        }
  
        const ids = permisos.filter(p => Number(p.pus_activo) === 1).map(p => Number(p.bot_id));
        this.permSet = new Set<number>(ids);
        this.btnPerm.nuevo = this.permSet.has(1);
        this.btnPerm.excel = this.permSet.has(5);
      } else {
        console.log('Ruta no encontrada en objetosMenu');
      }
    }

    hasPerm(botId: number): boolean {
      return this.permSet.has(botId);
    }
  
    getObjetoMenu() {
      const ObjetoMenu = localStorage.getItem('objetosMenu');
      this.ObjetoMenu = ObjetoMenu ? JSON.parse(ObjetoMenu) : [];
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
    
    loadTemadeAyudaPadre() {
      const data_post = {
        p_tea_id: 0,
        p_tea_idpadr: 0,
        p_tea_activo: 1
      };

      this.api.gettemaayudasel(data_post).subscribe((data: any) => {
        this.dataTemaAyudaPadre = data;
      });
    }
    
    loadAgente() {
      const data_post = {
        p_age_id: 0,
        p_usu_id: 0,
        p_age_activo: 1
      };

      this.api.getagentesel(data_post).subscribe((data: any) => {
        this.dataAgente = data;
      });
    }
    
    loadEquipo() {
      const data_post = {
        p_equ_id: 0,
        p_equ_activo: 1
      };
  
      this.api.getequiposel(data_post).subscribe((data: any) => {
        this.dataEquipo = data;
      });
    }

    safeParse(jsonStr: string): any[] {
      try {
        return JSON.parse(jsonStr || '[]');
      } catch (e) {
        console.error('Error al parsear bot_botons:', e);
        return [];
      }
    }
  
    getIdButton(action: 'edit' | 'view' | 'annul', item: any) {
      switch (action) {
        case 'view':
          this.selectedTemaAyuda = item;
          this.modalMode = 'edit';
          this.modalReadOnly = true;
          this.modalRef = this.modalService.show(this.OpenModalTemaAyuda, { class: 'modal-lg' });
          break;

        case 'edit':
          this.selectedTemaAyuda = item;
          this.modalMode = 'edit';
          this.modalReadOnly = false;
          this.modalRef = this.modalService.show(this.OpenModalTemaAyuda, { class: 'modal-lg' });
          break;

        default:
          console.warn('Acción no reconocida:', action);
          break;
      }
    }

}
