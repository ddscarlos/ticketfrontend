import { Component, Input, Output, EventEmitter,OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { ApiService } from 'src/app/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-atencion',
  templateUrl: './modal-atencion.component.html',
  styleUrls: ['./modal-atencion.component.css']
})
export class ModalAtencionComponent implements OnInit {
  titulopant : string = "ATENDER TICKET ";
  tkt_id : string = '0';
  tkt_fectkt : string = '';
  tkt_hortkt : string = '';
  tkt_numero : string = '';

  tkt_obsanu : string = '';
  
  @Input() ticket: any;

  @Output() cancelClicked = new EventEmitter<void>(); 
  
  constructor(
    private api: ApiService,
    private appComponent: AppComponent
  ) {
    this.appComponent.login = false;
  }

  ngOnInit() {
    console.log(this.ticket);
    this.tkt_id=this.ticket.tkt_id;
    this.tkt_numero=this.ticket.tkt_numero;
    this.tkt_fectkt=this.ticket.tkt_fectkt;
    this.tkt_hortkt=this.ticket.tkt_hortkt;
  }

  cancelar() {
    this.cancelClicked.emit();
  }

  ProcesarRegistro() {
    const dataPost = {
      p_tkt_id:(this.tkt_id == null || this.tkt_id === '') ? 0 : parseInt(this.tkt_id),
      p_tkt_observ:this.tkt_obsanu,
      p_ate_usureg:parseInt(localStorage.getItem("usuario"))
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
        this.api.getticketsate(dataPost).subscribe((data: any) => {
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
