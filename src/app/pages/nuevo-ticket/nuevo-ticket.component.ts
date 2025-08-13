import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { ApiService } from 'src/app/services/api.service';
import swal from "sweetalert2";
import { finalize } from 'rxjs/operators';
import { TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgxDropzoneComponent } from 'ngx-dropzone';

type ExistingFile = {
  arc_id: number;
  name: string;
  type: string;      // mime por extensión
  path: string;      // rut_archiv de tu JSON
  isRemote: true;
};

@Component({
  selector: 'app-nuevo-ticket',
  templateUrl: './nuevo-ticket.component.html',
  styleUrls: ['./nuevo-ticket.component.css']
})
export class NuevoTicketComponent implements OnInit {
  titulopant : string = "Registro | Edición de Ticket";
  txtbtn : string = "";
  icono : string = "pe-7s-next-2";
  loading: boolean = false;
  files: File[] = [];
  existingFiles: ExistingFile[] = [];
  demoMode = true;

  readonly MAX_FILES = 5;

  @ViewChild(NgxDropzoneComponent, { static: false }) dz!: NgxDropzoneComponent;
  
  @ViewChild('previewTpl', { static: false }) previewTpl: TemplateRef<any>;
  modalRefPreview: BsModalRef = null;
  previewSrc: SafeResourceUrl = null;
  previewName = '';
  previewMime = '';
  isPdf = false;

  dataTemaAyuda:any;
  dataOrigen:any;

  tkt_id : string = '0';
  tea_id : string = '0';
  usu_id : string = '0';
  ori_id: number = 1;
  tkp_numero : string = '';
  tkt_asunto : string = '';
  tkt_observ : string = '';
  tkt_numcel : string = '';

  constructor(
    private router: Router,
    private api: ApiService,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.loading = true;
    
    if (this.demoMode) {
      this.preloadDemoFiles();
    }

    this.loadOrigen();
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.tkt_id = id;
        this.loadData();        // EDITAR
        this.txtbtn = "Actualizar Ticket";
      } else {
        this.tkt_id = '0';      // NUEVO
        this.loading = false;
        this.files = [];
        this.existingFiles = [];
        this.txtbtn = "Generar Ticket";
      }
    });
    this.loadTemadeAyuda();
  }

  loadData() {
    this.loading = true;
    const data_post = {
      p_tkt_id:parseInt(this.tkt_id)
    };

    this.api.getticketver(data_post)
    .pipe(finalize(() => this.loading = false))
    .subscribe((data: any) => {
      const row = (data && data.length > 0) ? data[0] : {};
      this.tkt_asunto = row.tkt_asunto;
      this.tea_id     = row.tea_id;
      this.ori_id     = row.ori_id;
      this.tkt_numcel = row.tkt_numcel;
      this.tkt_observ = row.tkt_observ;

      // archivos existentes
      this.existingFiles = [];
      try {
        const arr = JSON.parse(row.jsn_archiv || '[]');
        this.existingFiles = arr.map(function(a: any) {
          return {
            arc_id: a.arc_id,
            name  : a.arc_nombre,
            type  : this.mimeFromExt(a.arc_nombre),
            path  : (a.rut_archiv || ''),
            isRemote: true
          };
        }.bind(this));
      } catch (e) { /* noop */ }

      this.files = [];
    }, _ => {});
  }

  private openPreview(name: string, mime: string, dataUri: string) {
    this.previewName = name || 'archivo';
    this.previewMime = mime || '';
    this.isPdf = (this.previewMime.indexOf('pdf') !== -1);
    this.previewSrc = this.sanitizer.bypassSecurityTrustResourceUrl(dataUri);
    this.modalRefPreview = this.modalService.show(this.previewTpl, {
      class: 'modal-xl modal-dialog-centered'
    });
  }

  cerrarPreview() {
    if (this.modalRefPreview) {
      this.modalRefPreview.hide();
    }
  }

  onLabelClick(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.dz.showFileSelector();
  }

  onAddClick(e: MouseEvent, dz: NgxDropzoneComponent) {
    e.preventDefault();
    e.stopPropagation();
    dz.showFileSelector();
  }

  verArchivoExisting(f: ExistingFile) {
    var ruta = (f.path || '').replace(/\\\\/g, '\\').replace(/\\/g, '/');

    this.api.getFileBase64ByPath({ ruta }).subscribe({
      next: (res: any) => {
        if (!res || !res.dataUri) { console.error('Respuesta inesperada', res); return; }
        var name = res.name || f.name || 'archivo';
        var mime = res.mime || '';
        if (!mime) {
          var byName = name.toLowerCase();
          if (byName.endsWith('.pdf')) mime = 'application/pdf';
          else if (byName.endsWith('.jpg') || byName.endsWith('.jpeg')) mime = 'image/jpeg';
          else if (byName.endsWith('.png')) mime = 'image/png';
        }
        var dataUri = String(res.dataUri);
        if (dataUri.indexOf('data:;base64,') === 0 && mime) {
          dataUri = 'data:' + mime + ';base64,' + dataUri.split(';base64,')[1];
        }
        var isPdf = (mime && mime.indexOf('pdf') !== -1) || name.toLowerCase().endsWith('.pdf');
        this.openPreview(name, mime, dataUri);
        this.isPdf = isPdf;
      },
      error: (err) => console.error('Error base64-from-path:', err)
    });
  }


  verArchivoNew(file: File) {
    var reader = new FileReader();
    reader.onload = () => {
      var dataUri = String(reader.result || '');
      var mime = file.type || (dataUri.indexOf(';base64,') > -1 ? dataUri.split(';base64,')[0].replace('data:', '') : '');
      this.openPreview(file.name, mime, dataUri);
    };
    reader.readAsDataURL(file);
  }

  mimeFromExt(filename: string): string {
    const extParts = (filename || '').split('.');
    const ext = extParts.length > 1 ? extParts.pop().toLowerCase() : '';
    const map: any = {
      jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', pdf: 'application/pdf'
    };
    return map[ext] || 'application/octet-stream';
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
  
  restrictNumeric(e) {
    let input;
    if (e.metaKey || e.ctrlKey) {
      return true;
    }
    if (e.which === 32) {
     return false;
    }
    if (e.which === 0) {
     return true;
    }
    if (e.which < 33) {
      return true;
    }
    input = String.fromCharCode(e.which);
    return !!/[\d\s]/.test(input);
  }

  onSelect(event: any) {
    const allowed = ['image/jpeg','image/jpg','image/png','application/pdf'];
    const maxBytes = 5 * 1024 * 1024;

    const totalActual = this.files.length + this.existingFiles.length;
    const espacioRestante = this.MAX_FILES - totalActual;

    if (espacioRestante <= 0) {
      swal.fire('Límite alcanzado', `Solo se permite un máximo de ${this.MAX_FILES} archivos.`, 'warning');
      return;
    }

    const aAgregar: File[] = (event.addedFiles || []).slice(0, espacioRestante);

    let rechazados: string[] = [];
    for (const file of aAgregar) {
      if (!allowed.includes(file.type)) {
        rechazados.push(`${file.name} (tipo no permitido)`);
        continue;
      }
      if (file.size > maxBytes) {
        rechazados.push(`${file.name} (máx. 2MB)`);
        continue;
      }
      const exists = this.files.some(f => f.name===file.name && f.size===file.size && f.type===file.type);
      if (exists) continue;

      this.files.push(file);
    }

    const sobrantes = (event.addedFiles || []).length - aAgregar.length;
    if (sobrantes > 0) {
      rechazados.push(`${sobrantes} archivo(s) extra por encima del límite (${this.MAX_FILES}).`);
    }

    if (rechazados.length) {
      swal.fire('Algunos archivos no se agregaron', rechazados.join('<br>'), 'info');
    }
  }

  onRemove(file: File) {
    this.files = this.files.filter(f => f !== file);
  }

  async onRemoveExisting(f: ExistingFile) {
    const ok = await swal.fire({
      title: '¿Eliminar archivo?',
      text: f.name,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(r => r.isConfirmed);

    if (!ok) return;

    const payload = {
      p_arc_id: f.arc_id,
      p_arc_usumov: Number(localStorage.getItem('usuario') || 0)
    };

    this.loading = true;
    this.api.getarchivosanu(payload).pipe(finalize(() => this.loading = false)).subscribe({
      next: (res: any) => {
        let err;
        if (Array.isArray(res)) {
          err = res.length > 0 ? res[0].error : undefined;
        }
        if (err === 0 || typeof err === 'undefined') {
          this.existingFiles = this.existingFiles.filter(function(x) { return x.arc_id !== f.arc_id; });
          swal.fire('Eliminado', 'Archivo eliminado', 'success');
        } else {
          swal.fire('Advertencia', 'No se pudo eliminar', 'warning');
        }
      },
      error: _ => swal.fire('Error', 'No se pudo eliminar', 'error')
    });
  }

  procesaRegistro() {
    const formData = new FormData();
    formData.append("p_tkt_id", this.tkt_id === '0' ? "0" : this.tkt_id);
    formData.append("p_tea_id", String(this.tea_id));
    formData.append("p_usu_id", String(localStorage.getItem("usuario")));
    formData.append("p_ori_id", String(this.ori_id));
    formData.append("p_tkp_numero", "");
    formData.append("p_tkt_asunto", this.tkt_asunto);
    formData.append("p_tkt_observ", (this.tkt_observ || '').toUpperCase());
    formData.append("p_tkt_numcel", this.tkt_numcel || "");
    this.files.forEach(f => formData.append("files[]", f));

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

  private async preloadDemoFiles() {

    //await this.pushAssetAsFile('assets/demo.jpg', 'demo.jpg', 'image/jpeg');
    //await this.pushAssetAsFile('assets/demo.pdf', 'demo.pdf', 'application/pdf');
  }

  private async pushAssetAsFile(url: string, filename: string, mime: string) {
    const res = await fetch(url);
    const blob = await res.blob();
    const file = new File([blob], filename, { type: mime, lastModified: Date.now() });

    const allowed = ['image/jpeg','image/jpg','image/png','application/pdf'];
    const max = 2 * 1024 * 1024;
    if (!allowed.includes(file.type)) return;
    if (file.size > max) return;

    const exists = this.files.some(f => f.name === file.name && f.size === file.size && f.type === file.type);
    if (!exists) this.files.push(file);
  }
}
