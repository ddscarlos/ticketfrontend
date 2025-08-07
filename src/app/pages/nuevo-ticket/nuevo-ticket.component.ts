import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AppComponent } from 'src/app/app.component';
import { ApiService } from 'src/app/services/api.service';
import swal from "sweetalert2";

@Component({
  selector: 'app-nuevo-ticket',
  templateUrl: './nuevo-ticket.component.html',
  styleUrls: ['./nuevo-ticket.component.css']
})
export class NuevoTicketComponent implements OnInit {
  titulopant : string = "Registro | Edición de Ticket";
  icono : string = "pe-7s-next-2";
  loading: boolean = false;
  files: File[] = [];

  dataTemaAyuda:any;
  dataOrigen:any;

  tkt_id : string = '0';
  tea_id : string = '0';
  usu_id : string = '0';
  ori_id : string = '0';
  tkp_numero : string = '';
  tkt_asunto : string = '';
  tkt_observ : string = '';
  tkt_numcel : string = '';

  constructor(
      private router: Router,
      private modalService: BsModalService,
      private api: ApiService,
      private appComponent: AppComponent
    ) {
    }

  ngOnInit() {
    this.loadTemadeAyuda();
    this.loadOrigen();
  }

  loadTemadeAyuda() {
    const data_post = {
      p_tea_id: 0,
      p_tea_idpadr: 0,
      p_tea_activo: 1
    };

    this.api.gettemaayudasel(data_post).subscribe((data: any) => {
      this.dataTemaAyuda = data;
    });
  }
  
  loadOrigen() {
    const data_post = {
      p_ori_id: 0,
      p_ori_activo: 1
    };

    this.api.getDataOrigensel(data_post).subscribe((data: any) => {
      this.dataOrigen = data;
    });
  }

  onSelect(event: any) {
    this.files.push(...event.addedFiles);
  }

  onRemove(file: File) {
    this.files = this.files.filter(f => f !== file);
  }

  procesaRegistro() {
  const formData = new FormData();
  formData.append("p_tkt_id", "0"); // Nuevo ticket
  formData.append("p_tea_id", String(this.tea_id));
  formData.append("p_usu_id", String(localStorage.getItem("usuario")));
  formData.append("p_ori_id", String(this.ori_id));
  formData.append("p_tkp_numero", "");
  formData.append("p_tkt_asunto", this.tkt_asunto);
  formData.append("p_tkt_observ", this.tkt_observ.toUpperCase());
  formData.append("p_tkt_numcel", this.tkt_numcel || "");

  // Agregar archivos seleccionados
  this.files.forEach((file) => {
    formData.append("files[]", file);
  });

  swal
    .fire({
      title: "Mensaje",
      html: "¿Seguro de registrar el ticket?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ACEPTAR",
      cancelButtonText: "CANCELAR",
    })
    .then((result) => {
      if (result.isConfirmed) {
        this.api.getticketsgra(formData).subscribe({
          next: (data: any) => {
            if (data[0].error == 0) {
              swal
                .fire({
                  title: "Éxito",
                  html: data[0].mensa.trim(),
                  icon: "success",
                  confirmButtonColor: "#3085d6",
                  confirmButtonText: "Aceptar",
                })
                .then(() => {
                  this.router.navigate(["/ticket"]);
                });
            } else {
              swal.fire({
                title: "Error",
                text: data[0].mensa.trim(),
                icon: "error",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Aceptar",
              });
            }
          },
          error: (err) => {
            swal.fire("Error", "No se pudo registrar el ticket", "error");
            console.error(err);
          },
        });
      }
    });
}


}
