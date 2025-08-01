import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css']
})
export class ReporteComponent implements OnInit {

  ObjetoMenu: any[] = [];
  ruta: string = '';
  objid : number = 0 ;
  
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.getObjetoMenu();
    this.ObtenerObjId();
  }

  ObtenerObjId(){
    this.ruta = this.router.url.replace(/^\/+/, '');
    console.log('Ruta actual:', this.ruta);

    const match = this.ObjetoMenu.find(item => item.obj_enlace === this.ruta);
    if (match) {
      this.objid = match.obj_id;
      console.log('obj_id encontrado:', this.objid);
    } else {
      console.log('Ruta no encontrada en objetosMenu');
    }
  }

  getObjetoMenu() {
    const ObjetoMenu = localStorage.getItem('objetosMenu');
    this.ObjetoMenu = ObjetoMenu ? JSON.parse(ObjetoMenu) : [];
  }

}
