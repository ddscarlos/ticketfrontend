import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  constructor(private httpClient: HttpClient, private router: Router) { }

  urlApi: string = "http://10.250.55.118/ticketbackend/public/api/";
  urlApiAuth: string = "http://10.250.55.118/ticketbackend/public/api/";
  /* urlApi: string = "http://localhost/ticketbackend/public/api/";
  urlApiAuth: string = "http://localhost/ticketbackend/public/api/"; */
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
  getusuariocambiocontrasena(data: object) {
    return this.postQuery("seguridad/cambiarclave", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getDataTipodocidesel(data: object) {
    return this.postQuery("maestro/tipodocidesel", data).pipe(
      map((data) => {
        return data;
        })
      );
    }
  
  getDataOrigensel(data: object) {
    return this.postQuery("maestro/origensel", data).pipe(
      map((data) => {
        return data;
        })
      );
    }
  
  getDataUsuariotkt(data: object) {
    return this.postQuery("maestro/usuariotkt", data).pipe(
      map((data) => {
        return data;
        })
      );
    }
  
  getSeguridadperfilusuarioobjetosel(data: object) {
    return this.postQuery("seguridad/perfilusuarioobjetosel", data).pipe(
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
  
  gettipodocidesel(data: object) {
    return this.postQuery("maestro/tipodocidesel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getagentegra(data: object) {
    return this.postQuery("ticket/agentegra", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getagentesel(data: object) {
      return this.postQuery("ticket/agentesel", data).pipe(
        map((data) => {
          return data;
        })
      );
    }
  
  getagentetkt(data: object) {
      return this.postQuery("ticket/agentetkt", data).pipe(
        map((data) => {
          return data;
        })
      );
    }
  getagenteman(data: object) {
      return this.postQuery("ticket/agenteman", data).pipe(
        map((data) => {
          return data;
        })
      );
    }
  getagenteanu(data: object) {
      return this.postQuery("ticket/agenteanu", data).pipe(
        map((data) => {
          return data;
        })
      );
    }
  getarchivossel(data: object) {
    return this.postQuery("ticket/archivossel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getareausuarioanu(data: object) {
    return this.postQuery("ticket/areausuarioanu", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getareausuariogra(data: object) {
    return this.postQuery("ticket/areausuariogra", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getareausuariosel(data: object) {
    return this.postQuery("ticket/areausuariosel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getequipogra(data: object) {
    return this.postQuery("ticket/equipogra", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getequiposel(data: object) {
    return this.postQuery("ticket/equiposel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getequipoagentereg(data: object) {
    return this.postQuery("ticket/equipoagentereg", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getestadossel(data: object) {
    return this.postQuery("ticket/estadossel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getestadosrespuestasel(data: object) {
    return this.postQuery("ticket/estadosrespuestasel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getprioridadsel(data: object) {
    return this.postQuery("ticket/prioridadsel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getrutassel(data: object) {
    return this.postQuery("ticket/rutassel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getserviciossel(data: object) {
    return this.postQuery("ticket/serviciossel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getsedeanu(data: object) {
    return this.postQuery("ticket/sedeanu", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getsedegra(data: object) {
    return this.postQuery("ticket/sedegra", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getsedessel(data: object) {
    return this.postQuery("ticket/sedessel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getsedeusuarioanu(data: object) {
    return this.postQuery("ticket/sedeusuarioanu", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getsedeusuariogra(data: object) {
    return this.postQuery("ticket/sedeusuariogra", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getsedeusuariosel(data: object) {
    return this.postQuery("ticket/sedeusuariosel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  gettemaayudaanu(data: object) {
    return this.postQuery("ticket/temaayudaanu", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  gettemaayudahij(data: object) {
    return this.postQuery("ticket/temaayudahij", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  gettemaayudahlp(data: object) {
    return this.postQuery("ticket/temaayudahlp", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  gettemaayudapad(data: object) {
    return this.postQuery("ticket/temaayudapad", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  gettemaayudareg(data: object) {
    return this.postQuery("ticket/temaayudareg", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getequipoagenteanu(data: object) {
    return this.postQuery("ticket/equipoagenteanu", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  gettemaayudarut(data: object) {
    return this.postQuery("ticket/temaayudarut", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  gettemaayudasel(data: object) {
    return this.postQuery("ticket/temaayudasel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getticketsanu(data: object) {
    return this.postQuery("ticket/ticketsanu", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getticketsasg(data: object) {
    return this.postQuery("ticket/ticketsasg", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getticketsate(data: object) {
    return this.postQuery("ticket/ticketsate", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getticketscer(data: object) {
    return this.postQuery("ticket/ticketscer", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getticketsgra(data: object) {
    return this.postQuery("ticket/ticketsgra", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getticketsrea(data: object) {
    return this.postQuery("ticket/ticketsrea", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getticketsres(data: object) {
    return this.postQuery("ticket/ticketsres", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getticketsrus(data: object) {
    return this.postQuery("ticket/ticketsrus", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getticketsxagesel(data: object) {
    return this.postQuery("ticket/ticketsxagesel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getticketsxainsel(data: object) {
    return this.postQuery("ticket/ticketsxainsel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getticketsxapesel(data: object) {
    return this.postQuery("ticket/ticketsxapesel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getticketsxestsel(data: object) {
    return this.postQuery("ticket/ticketsxestsel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getticketsxfecsel(data: object) {
    return this.postQuery("ticket/ticketsxfecsel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getticketsxsarsel(data: object) {
    return this.postQuery("ticket/ticketsxsarsel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getticketsxususel(data: object) {
    return this.postQuery("ticket/ticketsxususel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  gettrazabilidadreg(data: object) {
    return this.postQuery("ticket/trazabilidadreg", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  gettrazabilidadsel(data: object) {
    return this.postQuery("ticket/trazabilidadsel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getticketsel(data: object) {
    return this.postQuery("ticket/ticketssel", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getticketsder(data: object) {
    return this.postQuery("ticket/ticketsder", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getticketlis(data: object) {
    return this.postQuery("ticket/ticketslis", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getticketver(data: object) {
    return this.postQuery("ticket/ticketsver", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  getticketdsh(data: object) {
    return this.postQuery("ticket/ticketsdsh", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  
  getticketsxfxa(data: object) {
    return this.postQuery("ticket/ticketsxfxa", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  
  getticketsxfae(data: object) {
    return this.postQuery("ticket/ticketsxfae", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  
  getticketsxtaf(data: object) {
    return this.postQuery("ticket/ticketsxtaf", data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getarchivosanu(data: object) {
    return this.postQuery("ticket/archivosanu", data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  
  getFileBase64ByPath(data: object) {
    return this.postQuery('files/base64-from-path', data).pipe(
      map((data) => {
        return data;
      })
    );
  }
}
