import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-modal-equipo-agente',
  templateUrl: './modal-equipo-agente.component.html',
  styleUrls: ['./modal-equipo-agente.component.css']
})
export class ModalEquipoAgenteComponent implements OnInit {

  @Input() agente: any;
  @Output() cancelClicked = new EventEmitter<void>();
  @Output() saved = new EventEmitter<any>();

  titulopant: string = 'ASIGNAR EQUIPO';
  form: FormGroup;
  loading: boolean = false;
  guardando: boolean = false;

  dataEquipo: Array<{ equ_id: number; equ_descri: string }> = [];
  equiposAgente: any[] = [];

  constructor(
    private fb: FormBuilder,
    private api: ApiService
  ) {
    this.form = this.fb.group({
      equ_id: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadEquipo();
    if (this.agente && this.agente.equ_id) {
      this.form.patchValue({ equ_id: Number(this.agente.equ_id) });
    }
    this.equiposAgente = this.parseEquipos(this.agente && this.agente.equ_descri);
  }

  ngOnChanges() {
    this.equiposAgente = this.parseEquipos(this.agente && this.agente.equ_descri);
  }

  private parseEquipos(equ_descri: any): any[] {
    try {
      var arr = typeof equ_descri === 'string' ? JSON.parse(equ_descri) : equ_descri;
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return [];
    }
  }

  get formDisabled(): boolean {
    return this.loading || this.guardando;
  }

  cancelar(): void {
    this.cancelClicked.emit();
  }

  loadEquipo(): void {
    this.loading = true;
    const data_post = { 
      p_equ_id: 0,
      p_equ_activo: 1
    };
    this.api.getequiposel(data_post).subscribe({
      next: (data: any[]) => {
        var arr = Array.isArray(data) ? data : [];
        this.dataEquipo = arr.map(function (x: any) {
          var id  = (x && x.equ_id != null) ? x.equ_id : ((x && x.id != null) ? x.id : 0);
          var nom = (x && x.equ_descri != null) ? x.equ_descri : ((x && x.nombre != null) ? x.nombre : '');
          return { equ_id: Number(id), equ_descri: String(nom) };
        });
      },
      error: () => {
        swal.fire('Error', 'No se pudo cargar la lista de equipos.', 'error');
      },
      complete: () => { this.loading = false; }
    });
  }

  guardar(): void {
    if (this.form.invalid || !(this.agente && this.agente.age_id)) {
      this.form.markAllAsTouched();
      return;
    }
    this.guardando = true;

    const equ_id = Number(this.form.value.equ_id);
    const payload = {
      p_equ_id: equ_id,
      p_age_id: Number(this.agente.age_id),
      p_eag_usureg: Number(localStorage.getItem('usuario'))
    };

    this.api.getequipoagentereg(payload).subscribe({
      next: (resp: any) => {
        var r = Array.isArray(resp) ? resp[0] : resp;
        if (r && r.error === 0) {
          var mensajeOk = (r && r.mensa) ? String(r.mensa).trim() : 'Equipo asignado correctamente.';
          swal.fire('Éxito', mensajeOk, 'success').then(() => {
            this.saved.emit({ age_id: this.agente.age_id, equ_id: equ_id });
            this.cancelClicked.emit();
          });
        } else {
          var mensajeWarn = (r && r.mensa) ? String(r.mensa).trim() : 'No se pudo asignar el equipo.';
          swal.fire('Atención', mensajeWarn, 'warning');
        }
      },
      error: () => {
        swal.fire('Error', 'Ocurrió un error al asignar el equipo.', 'error');
      },
      complete: () => { this.guardando = false; }
    });
  }

   AnularEquipoAgente(eag_id: number){
      const dataPost = {
        p_eag_id:eag_id
      };
  
      swal.fire({
        title: 'Mensaje',
        html: "¿Seguro de Anular?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ACEPTAR',
        cancelButtonText: 'CANCELAR'
      }).then((result) => {
        if (result.isConfirmed) {
          this.api.getequipoagenteanu(dataPost).subscribe((data: any) => {
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
                    this.ngOnInit();
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
