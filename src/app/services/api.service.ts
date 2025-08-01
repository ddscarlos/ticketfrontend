import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  constructor(private httpClient: HttpClient, private router: Router) { }

  urlApi: string = "http://localhost/ticketbackend/public/api/";
  urlApiAuth: string = "http://localhost/ticketbackend/public/api/";
  //urlApiAuth: string = "http://127.0.0.1:8000/api/";

  getQuery(query: string) {
    const url = `${this.urlApi + query}`;
    return this.httpClient.get(url);
  }

  postQuery(query: string, params: any) {
    const url = `${this.urlApi + query}`;
    return this.httpClient.post(url, params);
  }

  AuthpostQuery(query: string, params: any) {
    const url = `${this.urlApi + query}`;
    return this.httpClient.post(url, params);
  }

  //END POINTS NUEVOS PARA USAR
  
  getIniciarSesion(data: object) {
    return this.AuthpostQuery("login", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  
  getDatosUsuario(data: object) {
    return this.postQuery("me", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  isLogged() {
    let user_sess = localStorage.getItem("usu_id");
    return user_sess != null ? true : false;
  }

  validateSession(ruta: string) {
    if (this.isLogged()) {
      if (ruta == "login") {
        this.router.navigate(["login"]);
      } else {
        this.router.navigate([ruta]);
      }
    } else {
      this.router.navigate(["login"]);
    }
  }

  //NUEVOS ENDPOINT
  getDataTipodocidesel(data: object) {
    return this.postQuery("maestro/tipodocidesel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  
  getSeguridadpermisoobjetosel(data: object) {
    return this.postQuery("seguridad/permisoobjetosel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  
  getSeguridadperfilusuarioapp(data: object) {
    return this.postQuery("seguridad/perfilusuarioapp", data).pipe(
      map((data) => {
        return data;
      })
    );
  }


}
