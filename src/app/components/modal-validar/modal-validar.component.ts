import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-modal-validar',
  templateUrl: './modal-validar.component.html',
  styleUrls: ['./modal-validar.component.css']
})
export class ModalValidarComponent implements OnInit {
  @Input() ticket: any;
  constructor() { }

  ngOnInit() {
  }

}
