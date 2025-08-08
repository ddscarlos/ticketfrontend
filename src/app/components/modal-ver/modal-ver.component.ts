import { Component, Input, Output, EventEmitter,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AppComponent } from 'src/app/app.component';
import { ApiService } from 'src/app/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-ver',
  templateUrl: './modal-ver.component.html',
  styleUrls: ['./modal-ver.component.css']
})
export class ModalVerComponent implements OnInit {
  titulopant : string = "VISUALIZAR TICKET";
  tkt_id : string = '0';
  dataArchivos:any;

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
    console.log(this.ticket.tkt_id);
    this.tkt_id = this.ticket.tkt_id;
    this.loadArchivos();
  }
  
  loadArchivos() {
    const data_post = {
      p_arc_id: 0,
      p_tkt_id: (this.tkt_id == null || this.tkt_id === '') ? 0 : parseInt(this.tkt_id),
      p_rut_id: 0,
      p_arc_activo: 1
    };

    this.api.getarchivossel(data_post).subscribe((data: any) => {
      this.dataArchivos = data;
    });
  }

  cancelar() {
    this.cancelClicked.emit();
  }

}
