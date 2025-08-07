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
  }

  cancelar() {
    this.cancelClicked.emit();
  }

}
