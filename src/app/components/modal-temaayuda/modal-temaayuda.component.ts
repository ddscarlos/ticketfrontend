import { Component, Input, Output, EventEmitter,OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AppComponent } from 'src/app/app.component';
import { ApiService } from 'src/app/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-temaayuda',
  templateUrl: './modal-temaayuda.component.html',
  styleUrls: ['./modal-temaayuda.component.css']
})
export class ModaltemaayudaComponent implements OnInit {

  titulopant: string = "TEMA DE AYUDA";
  tea_id: string = '0';

  @ViewChild('previewTpl', { static: false }) previewTpl!: TemplateRef<any>;
  modalRefPreview?: BsModalRef;

  dataTemaAyudaPadre:any;
  dataEquipo:any;
  dataAgente:any;
  dataPrioridad:any;
  
  loading: boolean = false;

  private loaded = {
    padre: false,
    equipo: false,
    agente: false,
    prioridad: false
  };

  tea_descri:string='';
  tea_abrevi:string='';

  tea_idpadr:string='0';
  equ_id:string='0';
  age_id:string='0';
  pri_id:string='0';

  @Input() temaayuda: any;                 // null en create
  @Input() readOnly: boolean = false;
  @Input() mode: 'create' | 'edit' = 'create';    // <-- NUEVO

  @Output() cancelClicked = new EventEmitter<void>();

  constructor(
    private router: Router,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private api: ApiService,
    private appComponent: AppComponent
  ) {
    this.appComponent.login = false;
  }

  ngOnInit() {
    this.loadTemadeAyudaPadre();
    this.loadEquipo();
    this.loadAgente();
    this.loadPrioridad();
    this.loading = (this.mode === 'edit');
    if (this.mode === 'edit' && this.temaayuda) {
      this.titulopant = "EDITAR TEMA DE AYUDA";
      this.tea_id     = String(this.temaayuda.tea_id);
      this.tea_descri = this.temaayuda.tea_descri;
      this.tea_abrevi = this.temaayuda.tea_abrevi;
      this.tea_idpadr = this.temaayuda.tea_idpadr;
      this.pri_id     = this.temaayuda.pri_id;
      this.equ_id     = this.temaayuda.equ_id;
      this.age_id     = this.temaayuda.age_id;
    } else {
      this.titulopant = "NUEVO TEMA DE AYUDA";
      this.tea_id = '0';
    }
  }

  cancelar() {
    this.cancelClicked.emit();
  }

  get formDisabled(): boolean {
    return this.loading || this.readOnly || this.mode === 'edit';
  }

  get formDisabledPriAge(): boolean {
    return this.loading || this.readOnly;
  }

  private finishLoadingIfReady(): void {
    if (this.mode === 'edit') {
      if (this.loaded.padre && this.loaded.equipo && this.loaded.agente && this.loaded.prioridad) {
        this.loading = false;   // ya llegaron todos, muestro el formulario
      }
    }
  }

  loadTemadeAyudaPadre() {
    const data_post = { p_tea_id: 0, p_tea_idpadr: 0, p_tea_activo: 1 };
    this.api.gettemaayudasel(data_post).subscribe((data: any) => {
      this.dataTemaAyudaPadre = data;
      this.loaded.padre = true;
      this.finishLoadingIfReady();
    });
  }

  loadEquipo() {
    const data_post = { p_equ_id: 0, p_equ_activo: 1 };
    this.api.getequiposel(data_post).subscribe((data: any) => {
      this.dataEquipo = data;
      this.loaded.equipo = true;
      this.finishLoadingIfReady();
    });
  }

  loadAgente() {
    const data_post = { p_age_id: 0, p_usu_id: 0, p_age_activo: 1 };
    this.api.getagentesel(data_post).subscribe((data: any) => {
      this.dataAgente = data;
      this.loaded.agente = true;
      this.finishLoadingIfReady();
    });
  }

  loadPrioridad() {
    const data_post = { p_pri_id: 0, p_pri_activo: 1 };
    this.api.getprioridadsel(data_post).subscribe((data: any) => {
      this.dataPrioridad = data;
      this.loaded.prioridad = true;
      this.finishLoadingIfReady();
    });
  }

  ProcesarRegistro() {
      const dataPost = {
        p_tea_id: (this.tea_id == null || this.tea_id === '') ? 0 : parseInt(this.tea_id),
        p_tea_descri:this.tea_descri,
        p_tea_abrevi:this.tea_abrevi,
        p_tea_idpadr:(this.tea_idpadr == null || this.tea_idpadr === '') ? 0 : parseInt(this.tea_idpadr),
        p_pri_id:(this.pri_id == null || this.pri_id === '') ? 0 : parseInt(this.pri_id),
        p_equ_id:(this.equ_id == null || this.equ_id === '') ? 0 : parseInt(this.equ_id),
        p_age_id:(this.age_id == null || this.age_id === '') ? 0 : parseInt(this.age_id),
        p_dep_id:1,
        p_tea_usureg:parseInt(localStorage.getItem("usuario"))
      };
  
      Swal.fire({
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
          this.api.gettemaayudareg(dataPost).subscribe((data: any) => {
            if(data[0].error == 0){
              Swal.fire({
                title: 'Exito',
                html: data[0].mensa.trim(),
                icon: 'success',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar',
              }).then((result) => {
                if (result.value) {
                  setTimeout(() => {
                    this.cancelClicked.emit();
                  }, 300);
                }
              });
            }else{
              Swal.fire({
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
