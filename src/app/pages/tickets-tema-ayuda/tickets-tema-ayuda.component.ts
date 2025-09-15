import { Component,TemplateRef,OnInit,Input,ViewChild,HostListener} from "@angular/core";
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { ApiService } from "src/app/services/api.service";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import swal from "sweetalert2";

interface PermisoBtn {
  bot_id: number;
  bot_descri: string;
  pus_activo: number | string;
}

@Component({
  selector: 'app-tickets-tema-ayuda',
  templateUrl: './tickets-tema-ayuda.component.html',
  styleUrls: ['./tickets-tema-ayuda.component.css']
})
export class TicketsTemaAyudaComponent implements OnInit {
private permSet = new Set<number>();
    btnPerm = {
      nuevo: false,
      excel: false,
    };

    titulopant : string = "Tickets Tema de Ayuda";
    icono : string = "pe-7s-next-2";
    loading: boolean = false;
    exportarHabilitado: boolean = false;
    modalRef?: BsModalRef;

    selectedTicketsPorAgente: any;
    
    btnnuevo:boolean=false;
    btnexcel:boolean=false;
    ObjetoMenu: any[] = [];
    jsn_permis: any[] = [];
    ruta: string = '';
    objid : number = 0 ;
  
    //INICIO PARAMETROS
    dataTickets:any;
    
    tkt_fecini:string='';
    tkt_fecfin:string='';
   
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
      /* order: [[3, 'desc'],[2, 'asc']], */
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
        { targets: 0, width : '40%'},
        { targets: 1, width : '7%'},
        { targets: 2, width : '5%'},
        { targets: 3, width : '6%'},
        { targets: 4, width : '5%'},
        { targets: 5, width : '6%'},
        { targets: 6, width : '6%'},
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
      this.SetMesIniFin();
      this.getObjetoMenu();
      this.ObtenerObjId();
      console.log(this.ObjetoMenu[0]);
      //this.loadDataProceso();
    }
  
    ngOnDestroy(): void {
      this.dtTrigger.unsubscribe();
    }
  
    descargaExcel() {
      let btnExcel = document.querySelector('#tablaDataProceso .dt-buttons .dt-button.buttons-excel.buttons-html5') as HTMLButtonElement;
      btnExcel.click();
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

    SetMesIniFin(){
      const today = new Date();

      const yyyy = today.getFullYear();
      const mm = (today.getMonth() + 1).toString().padStart(2, '0');
      const dd = today.getDate().toString().padStart(2, '0');

      this.tkt_fecini = `${yyyy}-${mm}-01`;
      this.tkt_fecfin = `${yyyy}-${mm}-${dd}`;
    }
  
    CerrarModalProceso() {
      this.loadDataProceso();
      if (this.modalRef) {
        this.modalRef.hide();
      }
    }
  
    loadDataProceso() {
      this.loading = true;
  
      const data_post = {
        p_tkt_fecini: this.tkt_fecini,
        p_tkt_fecfin: this.tkt_fecfin
      };
  
      this.api.getticketsxtaf(data_post).subscribe({
        next: (data: any[]) => {
          if (Array.isArray(data) && data.length > 0) {
            this.dataTickets = data.map(item => ({
              ...item,
              bot_botons_parsed: this.safeParse(item.bot_botons)
            }));
            this.exportarHabilitado = true;
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              dtInstance.destroy();
              this.dtTrigger.next();
            });
          } else {
            this.dataTickets = [];
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

    safeParse(jsonStr: string): any[] {
      try {
        return JSON.parse(jsonStr || '[]');
      } catch (e) {
        console.error('Error al parsear bot_botons:', e);
        return [];
      }
    }
}
