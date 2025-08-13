import { Component, Input, Output, EventEmitter,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AppComponent } from 'src/app/app.component';
import { ApiService } from 'src/app/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-validar',
  templateUrl: './modal-validar.component.html',
  styleUrls: ['./modal-validar.component.css']
})
export class ModalValidarComponent implements OnInit {
    titulopant : string = "VALIDAR TICKET ";
    tkt_id : string = '0';
    tkt_fectkt : string = '';
    tkt_hortkt : string = '';
    tkt_numero : string = '';
    tkt_obsasg : string = '';  
    esr_id : string = '0';
    dataEstadoRespuesta:any;
    
    @Input() ticket: any;
  
    @Output() cancelClicked = new EventEmitter<void>(); 
    
    constructor(
      private router: Router,
      private modalService: BsModalService,
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
  
      this.loadEstadoRespuesta();
    }
  
    cancelar() {
      this.cancelClicked.emit();
    }
  
    loadEstadoRespuesta() {
      const data_post = {
        p_esr_id: 0,
        p_esr_activo: 1
      };
  
      this.api.getestadosrespuestasel(data_post).subscribe((data: any) => {
        this.dataEstadoRespuesta = data;
      });
    }
  
    ProcesarRegistro() {
      const dataPost = {
        p_tkt_id:(this.tkt_id == null || this.tkt_id === '') ? 0 : parseInt(this.tkt_id),
        p_esr_id:(this.esr_id == null || this.esr_id === '') ? 0 : parseInt(this.esr_id),
        p_rus_observ:this.tkt_obsasg,
        p_rus_usureg:parseInt(localStorage.getItem("usuario"))
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
          this.api.getticketsrus(dataPost).subscribe((data: any) => {
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
