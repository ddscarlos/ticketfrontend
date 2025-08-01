import {
  Component,
  TemplateRef,
  OnInit,
  Input,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { AppComponent } from "../../app.component";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { ApiService } from "src/app/services/api.service";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { analyzeAndValidateNgModules } from "@angular/compiler";
import swal from "sweetalert2";

@Component({
  selector: 'app-escenarios',
  templateUrl: './escenarios.component.html',
  styleUrls: ['./escenarios.component.css']
})

export class EscenariosComponent implements OnInit {
  titulopant : string = "Escenarios"
  icono : string = "pe-7s-next-2"

  loading: boolean = false;
  
  //VARIABLES
    //ARRAYS PARA LISTAS
    dataAplicacion:any;
    dataEscenarios:any;
    dataAplicacionModulo:any;
    dataEstadoescenario:any;
    //FIN ARRAY PARA LISTAS
    apl_id:string= '0';
    obj_id:string= '0';
    eep_id:string= '0';
    esp_activo:string= '9';
    
  //FIN VARIABLES

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false;

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
    autoWidth: false,
    searching: true,
    columnDefs: [
      { width: "20px", targets: 0 },
      { width: "160px", targets: 1 },
      { width: "120px", targets: 2 },
      { width: "120px", targets: 3 },
      { width: "65px", targets: 4 },
      { width: "45px", targets: 5 },
      { width: "20px", targets: 6 },
      { width: "20px", targets: 7 },
      { width: "40px", targets: 8 },
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
    private appComponent: AppComponent
  ) {
    this.appComponent.login = false;
  }

  ngOnInit() {
    this.loadDataProceso();
    this.loadAplicacion();
    this.loadEstados();
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

  escenarioIns() {
    this.router.navigate(["/escenario-ins"]);
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
  
  loadEstados() {
    const data_post = {
      p_eep_id: 0,
      p_eep_activo: 1
    };

    this.api.Getestadoescenariopruebasel(data_post).subscribe((data: any) => {
      this.dataEstadoescenario = data;
    });
  }

  loadDataProceso() {
    this.loading = true;
    const data_post = {
      p_esp_id : 0,
      p_apl_id : (this.apl_id == null || this.apl_id === '') ? 0 : parseInt(this.apl_id),
      p_obj_id : (this.obj_id == null || this.obj_id === '') ? 0 : parseInt(this.obj_id),
      p_eep_id : (this.eep_id == null || this.eep_id === '') ? 0 : parseInt(this.eep_id),
      p_esp_codigo : '',
      p_esp_activo : (this.esp_activo == null || this.esp_activo === '') ? 9 : parseInt(this.esp_activo),
    };
  
    this.api.Getescenariopruebasel(data_post).subscribe({
      next: (data: any) => {
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
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        swal.fire('Error', 'Ocurrió un error al cargar los datos', 'error');
      }
    });
  }

  editarEscenario(id:number){
    this.router.navigate(['/escenario-ins',id], { queryParams: { 
      act: 'edit'
    } }); 
  }

  /* AgregarCasoEscenario(id:number){
    this.router.navigate(['/caso-ins'], { queryParams: { 
      esp: id
    } }); 
  } */

  MostrarCasoEscenarioBusqueda(id:number){
    this.router.navigate(['/casos'], { queryParams: { 
      esp: id
    } }); 
  }

  verEscenario(id:number){
    this.router.navigate(['/escenario-ins',id], { queryParams: { 
      act: 'ver'
    } }); 
  }
  
  ChangeEstadoEscenario(id:any,esp_activo:any){
    let activ:number;  
    if (esp_activo == 1) {
      activ = 0;
    }else if(esp_activo == 0){
      activ = 1;
    }

    const dataPost = {
      p_esp_id: parseInt(id),
      p_esp_activo: activ,
    };

    swal.fire({
      title: 'Mensaje',
      html: "¿Seguro de Cambiar estado del Escenario?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ACEPTAR',
      cancelButtonText: 'CANCELAR'
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.Getescenariopruebaact(dataPost).subscribe((data: any) => {
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
                  this.router.navigate(["/escenarios"]);
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
}
