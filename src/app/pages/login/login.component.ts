import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AppComponent } from "../../app.component";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { ApiService } from "src/app/services/api.service";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { analyzeAndValidateNgModules } from "@angular/compiler";
import swal from "sweetalert2";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  inputUsuario: string = "";
  inputPassword: string = "";
  sessionMsg: string = "";
  ip: string = "";

  loging: string = "";
  passwd: string = "";

  loading: boolean = false;

  constructor(
    private router: Router,
    private api: ApiService,
    private appComponent: AppComponent
  ) {
    this.appComponent.login = true;
  }

  ngOnInit() {
    this.api.validateSession("login");
  }

  IniciarSesion() {
    this.loading = true;

    const data_post = {
      p_loging: this.loging,
      p_passwd: this.passwd
    };

    this.api.getIniciarSesion(data_post).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('usuario', res.user.id);

        const datausuario = {
          p_usu_id: res.user.id,
          p_usu_apepat: '',
          p_usu_apemat: '',
          p_usu_nombre: '',
          p_usu_loging: '',
          p_usu_activo: 9,
        };

        this.api.getDatosUsuario(datausuario).subscribe({
          next: (datos: any) => {
            if (!datos || !datos.length) {
              this.loading = false;
              swal.fire('Error', 'No se encontraron datos del usuario', 'error');
              return;
            }

            localStorage.setItem('usu_apepat', datos[0].usu_apepat);
            localStorage.setItem('usu_apemat', datos[0].usu_apemat);
            localStorage.setItem('usu_nombre', datos[0].usu_nombre);
            localStorage.setItem('usu_nomcom', datos[0].usu_nomcom);
            localStorage.setItem('eqc_id', datos[0].eqc_id);
            localStorage.setItem('eqt_id', datos[0].eqt_id);

            this.loading = false;

            swal.fire({
              title: 'Bienvenido',
              text: `Hola ${datos[0].usu_nombre}!`,
              icon: 'success',
              confirmButtonText: 'Ingresar',
              confirmButtonColor: '#3085d6'
            }).then(() => {
              this.router.navigate(['/dashboard']);
            });
          },
          error: (err) => {
            this.loading = false;
            const mensajeError = (err && err.error && err.error.mensaje) ? err.error.mensaje : 'Error al obtener los datos del usuario';
            swal.fire('Error', mensajeError, 'error');
          }
        });
      },
      error: (err) => {
        this.loading = false;
        const mensajeError = (err && err.error && err.error.mensaje) ? err.error.mensaje : 'Error de autenticación';
        swal.fire('Error', mensajeError, 'error');
      }
    });
  }

}
