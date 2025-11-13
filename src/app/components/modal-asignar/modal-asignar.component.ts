import { Component, Input, Output, EventEmitter,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AppComponent } from 'src/app/app.component';
import { ApiService } from 'src/app/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-asignar',
  templateUrl: './modal-asignar.component.html',
  styleUrls: ['./modal-asignar.component.css']
})
export class ModalAsignarComponent implements OnInit {
  titulopant : string = "ASIGNAR TICKET ";
  tkt_id : string = '0';
  equ_id : string = '0';
  tkt_fectkt : string = '';
  tkt_hortkt : string = '';
  tkt_numero : string = '';
  tkt_obsasg : string = '';
  age_id : string = '0';

  age_idtick : string = '0';

  dataAgente:any;
  
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
    this.age_idtick=this.ticket.age_id;
    this.equ_id=this.ticket.equ_id;

    //console.log(this.age_idtick);
    this.loadAgente();
  }

  cancelar() {
    this.cancelClicked.emit();
  }

  loadAgente() {
    const data_post = {
      p_equ_id: parseInt(this.equ_id)
    };

    this.api.getagentetkt(data_post).subscribe((data: any) => {
      //const currentAgeId = Number(localStorage.getItem("age_id"));
      this.dataAgente = data.filter((agente: any) => agente.age_id !== parseInt(this.age_idtick) && (parseInt(this.age_idtick) > 0 || this.age_idtick !== ''));
      
      // Obtener el ID del agente del usuario autenticado
      const currentUserAgeId = Number(localStorage.getItem("age_id"));
      
      // Si el usuario actual es un agente y está disponible en la lista, seleccionarlo automáticamente
      if (currentUserAgeId && currentUserAgeId > 0) {
        const agentAvailable = this.dataAgente.find((agente: any) => agente.age_id === currentUserAgeId);
        if (agentAvailable) {
          // Asignar numéricamente para coincidir con [value]="item.age_id"
          this.age_id = agentAvailable.age_id;
        } else {
          // Si ya tiene asignado un agente, seleccionarlo en el combo
          const agenteAsignado = this.dataAgente.find((agente: any) => agente.age_id === parseInt(this.age_idtick));
          if (agenteAsignado) {
            this.age_id = agenteAsignado.age_id;
          }
        }
      }
    });
  }

  ProcesarRegistro() {
    const dataPost = {
      p_tkt_id:(this.tkt_id == null || this.tkt_id === '') ? 0 : parseInt(this.tkt_id),
      p_age_id:(this.age_id == null || this.age_id === '') ? 0 : parseInt(this.age_id),
      p_tkt_observ:this.tkt_obsasg,
      p_asg_usureg:parseInt(localStorage.getItem("usuario"))
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
        this.api.getticketsasg(dataPost).subscribe((data: any) => {
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
