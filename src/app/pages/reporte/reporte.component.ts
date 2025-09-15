import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as Highcharts from 'highcharts';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AppComponent } from 'src/app/app.component';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css']
})
export class ReporteComponent implements OnInit {
  titulopant : string = "Reporte";
  icono : string = "pe-7s-next-2";
  loading: boolean = false;
  files: File[] = [];

  ObjetoMenu: any[] = [];
  ruta: string = '';
  objid : number = 0 ;
  dataDashboard: any;

  tkt_fecini:string='';
  tkt_fecfin:string='';
  canreg:number=0;
  canena:number=0;
  canres:number=0;
  canobs:number=0;
  canfin:number=0;
  cancer:number=0;

  // HIGHCHARTS
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options;
  Highcharts2: typeof Highcharts = Highcharts;
  chartOptions2: Highcharts.Options;

  constructor(
    private router: Router,
    private modalService: BsModalService,
    private api: ApiService,
    private appComponent: AppComponent
  ) {
    this.appComponent.login = false;
  }

  ngOnInit(): void {
    this.SetMesIniFin();
    this.getObjetoMenu();
    this.ObtenerObjId();
    this.loadDashboard();
  }
  
  SetMesIniFin(){
    const today = new Date();

    const yyyy = today.getFullYear();
    const mm = (today.getMonth() + 1).toString().padStart(2, '0');
    const dd = today.getDate().toString().padStart(2, '0');

    this.tkt_fecini = `${yyyy}-${mm}-01`;
    this.tkt_fecfin = `${yyyy}-${mm}-${dd}`;
  }

  loadDashboard() {
    const data_post = {
      p_tkt_fecini: this.tkt_fecini,
      p_tkt_fecfin: this.tkt_fecfin
    };

    this.api.getticketdsh(data_post).subscribe((data: any) => {
      this.dataDashboard = data[0];
      this.canreg = parseInt(this.dataDashboard.canreg);
      this.canena = parseInt(this.dataDashboard.canena);
      this.canres = parseInt(this.dataDashboard.canres);
      this.canobs = parseInt(this.dataDashboard.canobs);
      this.canfin = parseInt(this.dataDashboard.canfin);
      this.cancer = parseInt(this.dataDashboard.cancer);

      if (this.dataDashboard && this.dataDashboard.jsnfec) {
        const parsedData = JSON.parse(this.dataDashboard.jsnfec);

        const categories = parsedData.map((item: any) => item.tkt_fectkt);
        const dataSeries = parsedData.map((item: any) => item.tkt_canreg);

        this.chartOptions = {
          chart: {
            type: 'column',
            options3d: {
              enabled: true,
              alpha: 15,
              beta: 15,
              depth: 50,
              viewDistance: 25
            }
          },
          title: {
            text: 'Tickets por Fecha'
          },
          xAxis: {
            categories: categories
          },
          yAxis: {
            title: {
              text: 'Cantidad de Tickets'
            },
            allowDecimals: false
          },
          plotOptions: {
            column: {
              depth: 25,
              dataLabels: {
                enabled: true,
                inside: false,
                format: '{point.y} tickets',
                style: {
                  fontSize: '12px',
                  fontWeight: 'bold'
                }
              }
            }
          },
          series: [{
            name: 'Tickets',
            type: 'column',
            data: dataSeries
          }]
        };
      }

      if (this.dataDashboard.jsnges) {
        const gesData = JSON.parse(this.dataDashboard.jsnges);

        const categoriesGes = gesData.map((i: any) => i.tkt_fectkt);
        const pendientes    = gesData.map((i: any) => Number(i.tkt_canpen) || 0);
        const resueltos     = gesData.map((i: any) => Number(i.tkt_canres) || 0);
        const observados    = gesData.map((i: any) => Number(i.tkt_canobs) || 0);
        const finalizados   = gesData.map((i: any) => Number(i.tkt_canfin) || 0);

        const COLOR_AZUL    = '#438eff'; // RESUELTOS
        const COLOR_VERDE   = '#2dcb73'; // FINALIZADOS
        const COLOR_NARANJA = '#f6b749'; // OBSERVADOS
        const COLOR_ROJO    = '#F54927'; // PENDIENTES

        this.chartOptions2 = {
          chart: { type: 'column' },
          title: { text: 'Distribución de estados por día' },
          xAxis: { categories: categoriesGes, crosshair: true },
          yAxis: { min: 0, title: { text: 'Cantidad' }, allowDecimals: false },
          tooltip: {
            shared: true,
            headerFormat: '<b>{point.key}</b><br/>',
            pointFormat: '<span style="color:{series.color}">● {series.name}</span>: <b>{point.y}</b><br/>'
          },
          plotOptions: {
            column: {
              stacking: 'normal',
              dataLabels: {
                enabled: true,
                inside: true,
                formatter: function () { return (this.y && this.y > 0) ? String(this.y) : ''; },
                allowOverlap: true,
                crop: false,
                style: {
                  color: '#FFFFFF',
                  textOutline: 'none',
                  fontWeight: 'bold'
                }
              },
              borderWidth: 0,
              pointPadding: 0.05,
              groupPadding: 0.08
            }
          },
          legend: {
            enabled: true,
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
            symbolRadius: 6,
            itemStyle: { fontWeight: 'bold' }
          },
          series: [
            { name: 'Pendientes',  type: 'column', data: pendientes,  color: COLOR_ROJO },
            { name: 'Resueltos',   type: 'column', data: resueltos,   color: COLOR_AZUL },
            { name: 'Observados',  type: 'column', data: observados,  color: COLOR_NARANJA },
            { name: 'Finalizados', type: 'column', data: finalizados, color: COLOR_VERDE }
          ]
        };
      }
      
      setTimeout(() => {
        const counters = document.querySelectorAll('.counter-value');

        counters.forEach(counter => {
          const el = counter as HTMLElement;
          const target = parseInt(el.getAttribute('data-target') || '0');
          let count = 0;

          const step = Math.ceil(target / 20); // ajuste la velocidad

          const interval = setInterval(() => {
            count += step;
            if (count >= target) {
              el.innerText = target.toString();
              clearInterval(interval);
            } else {
              el.innerText = count.toString();
            }
          }, 30);
        });
      }, 100);
      
    });
  }

  ObtenerObjId(){
    this.ruta = this.router.url.replace(/^\/+/, '');
    const match = this.ObjetoMenu.find(item => item.obj_enlace === this.ruta);
    if (match) {
      this.objid = match.obj_id;
    }
  }

  getObjetoMenu() {
    const ObjetoMenu = localStorage.getItem('objetosMenu');
    this.ObjetoMenu = ObjetoMenu ? JSON.parse(ObjetoMenu) : [];
  }
}
