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
import { Observable } from 'rxjs';

type ExistingFile = {
  arc_id: number;
  name: string;
  type: string;
  path: string;
  size?: number;      // ✅ tamaño en bytes (opcional)
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
  ShowColmUsuario : boolean = true;

  dataTemaAyuda:any;
  dataUsuarios:any;
  dataOrigen:any;
  pendingDeletes: ExistingFile[] = [];

  tkt_id : string = '0';
  tea_id : string = '0';
  usu_id : string = '0';
  ori_id: number = 0;
  tkt_usutkt: number = 0;
  tkp_numero : string = '';
  tkt_asunto : string = '';
  tkt_observ : string = '';
  tkt_numcel : string = '';
  blockinpt : boolean = false;
  disususoli : boolean = false;

  private _pendingLoads = 0;
  get loading(): boolean { return this._pendingLoads > 0; }
  private startLoading() { this._pendingLoads++; }
  private stopLoading() { if (this._pendingLoads > 0) this._pendingLoads--; }

  constructor(
    private router: Router,
    private api: ApiService,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.loadDataUsuariotkt();
    const isEdit = !!this.route.snapshot.paramMap.get('id');
    if (isEdit) {
      this.tkt_id = String(this.route.snapshot.paramMap.get('id'));
      this.txtbtn = "Actualizar Ticket";
      this.blockinpt = true;
      this.loadData();
    } else {
      this.tkt_numcel = localStorage.getItem("usu_numcel");
      this.ori_id = 1;
      this.tkt_id = '0';
      this.files = [];
      this.existingFiles = [];
      this.txtbtn = "Generar Ticket";
      this.blockinpt = false;
    }

    /* if (Number(localStorage.getItem('prf_id')) != 4 && Number(localStorage.getItem('prf_id')) != 5 ) {
      this.ShowColmUsuario = true;
    } else {
      this.ShowColmUsuario = false;
    } */

    this.loadOrigen();
    this.loadTemadeAyuda();
  }

  private withLoading<T>(obs$: Observable<T>) {
    this.startLoading();
    return obs$.pipe(finalize(() => this.stopLoading()));
  }

  get totalFiles(): number {
    return (this.existingFiles.length || 0) + (this.files.length || 0);
  }

  loadData() {
    const data_post = { p_tkt_id: parseInt(this.tkt_id) };
    this.withLoading(this.api.getticketver(data_post))
      .subscribe((data: any) => {
        const row = (data && data.length > 0) ? data[0] : {};
        this.tkt_asunto = row.tkt_asunto;
        this.tea_id     = row.tea_id;
        this.ori_id     = row.ori_id;
        this.tkt_usutkt = row.usu_id;
        this.tkt_numcel = row.tkt_numcel;
        this.tkt_observ = row.tkt_observ;
        
        try {
          const arr = JSON.parse(row.jsn_archiv || '[]');
          this.existingFiles = arr.map((a: any) => ({
            arc_id: a.arc_id,
            name  : a.arc_nombre,
            type  : this.mimeFromExt(a.arc_nombre),
            path  : (a.rut_archiv || ''),
            size  : a.arc_tamfil || 0,
            isRemote: true as boolean,
          }));
        } catch { this.existingFiles = []; }

        this.files = [];
      });
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
    const data_post = { /* p_tea_id: 0, p_tea_idpadr: 0, p_tea_activo: 1  */};
    this.withLoading(this.api.gettemaayudahlp(data_post))
      .subscribe((data: any) => this.dataTemaAyuda = data);
  }
  
  loadDataUsuariotkt() {
    const data_post = {
      p_usu_id: Number(localStorage.getItem("usuario")),
      p_usu_apepat: '',
      p_usu_apemat: '',
      p_usu_nombre: ''
    };

    this.withLoading(this.api.getDataUsuariotkt(data_post))
      .subscribe({
        next: (data: any) => {
          this.dataUsuarios = data;
          if (this.dataUsuarios.length === 1) {
            this.tkt_usutkt = data[0].usu_id;
            this.disususoli = true;
          }else{
            this.tkt_usutkt = Number(localStorage.getItem('usuario'));
            this.disususoli = false;
          }
        },
        error: (err) => console.error('Error cargando usuarios', err)
      });
  }
  
  loadOrigen() {
    const data_post = { p_ori_id: 0, p_ori_activo: 1 };
    this.withLoading(this.api.getDataOrigensel(data_post)).subscribe((data: any) => this.dataOrigen = data);
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
        rechazados.push(`${file.name} (máx. 5MB)`);
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
    // No eliminamos del servidor todavía, solo marcamos
    const isConfirmed = await swal.fire({
      title: '¿Quitar archivo?',
      text: `${f.name} (Se eliminará al guardar los cambios)`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, quitar',
      cancelButtonText: 'Cancelar'
    }).then(r => r.isConfirmed);

    if (!isConfirmed) return;

    // Lo quitamos visualmente de la lista
    this.existingFiles = this.existingFiles.filter(x => x.arc_id !== f.arc_id);

    // Lo agregamos al array de pendientes
    this.pendingDeletes.push(f);

    swal.fire('Marcado para eliminar', `${f.name} será eliminado al guardar.`, 'info');
  }

  getFileSize(file: File | { size?: number }): string {
    const size = file.size || 0;
    if (size === 0) return '';
    const units = ['B', 'KB', 'MB', 'GB'];
    let i = 0;
    let val = size;
    while (val >= 1024 && i < units.length - 1) {
      val /= 1024;
      i++;
    }
    return `${val.toFixed(1)} ${units[i]}`;
  }

  private async eliminarPendientes() {
    if (!this.pendingDeletes.length) return;

    for (const f of this.pendingDeletes) {
      const payload = {
        p_arc_id: f.arc_id,
        p_arc_usumov: Number(localStorage.getItem('usuario') || 0)
      };

      try {
        const res: any = await this.api.getarchivosanu(payload).toPromise();
        const result = Array.isArray(res) ? res[0] : res;
        if (result && result.error === 0) {
          console.log(`✅ Archivo eliminado: ${f.name}`);
        } else {
          console.warn(`⚠️ No se pudo eliminar ${f.name}`, (result && result.mensa) ? result.mensa : '');
        }
      } catch (err) {
        console.error(`❌ Error al eliminar ${f.name}`, err);
      }
    }

    // Limpia la lista de pendientes
    this.pendingDeletes = [];
  }

  procesaRegistro() {
    if (this.loading) return;
    let numCel = (this.tkt_numcel || '').replace(/\D/g, '');
    
    if (numCel.length < 7 || numCel.length > 11) {
      swal.fire('Número inválido', 'Ingrese un número de celular válido (7 a 11 dígitos).', 'warning');
      return;
    }

    const formData = new FormData();
    formData.append("p_tkt_id", this.tkt_id === '0' ? "0" : this.tkt_id);
    formData.append("p_tea_id", String(this.tea_id));
    formData.append("p_usu_id", String(this.tkt_usutkt));
    formData.append("p_usu_correo", String(localStorage.getItem("usu_correo")));
    formData.append("p_ori_id", String(this.ori_id));
    formData.append("p_tkp_numero", "");
    formData.append("p_tkt_asunto", this.tkt_asunto);
    formData.append("p_tkt_observ", (this.tkt_observ || '').toUpperCase());
    formData.append("p_tkt_numcel", numCel);
    formData.append("p_tkt_usutkt", String(localStorage.getItem("usuario")));
    this.files.forEach(f => formData.append("files[]", f));

    swal.fire({
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
        let timerInterval: any;
        swal.fire({
          title: 'Subiendo archivos cargados',
          html: 'Por favor espere... <b></b>',
          allowOutsideClick: false,
          allowEscapeKey: false,
          onBeforeOpen: () => {
            swal.showLoading();
          },
          onClose: () => {
            clearInterval(timerInterval);
          }
        });
        this.api.getticketsgra(formData).subscribe({
          next: (data: any) => {
            swal.close();
            if (data[0].error == 0) {
              this.eliminarPendientes();
              swal.fire({
                title: 'Éxito',
                html: data[0].mensa.trim(),
                icon: 'success',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar',
              }).then(() => this.router.navigate(['/ticket']));
            } else {
              swal.fire({
                title: 'Error',
                text: (data[0].mensa || 'Ocurrió un problema').trim(),
                icon: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar',
              });
            }
          },
          error: (err) => {
            swal.close();
            swal.fire('Error', 'No se pudo registrar el ticket', 'error');
            console.error(err);
          }
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
  
  onInputCelular(event: any) {
    let value = event.target.value.replace(/\D/g, ''); // solo números
    if (value.length > 3 && value.length <= 6) {
      value = value.replace(/(\d{3})(\d+)/, '$1-$2');
    } else if (value.length > 6) {
      value = value.replace(/(\d{3})(\d{3})(\d+)/, '$1-$2-$3');
    }
    event.target.value = value;
    this.tkt_numcel = value;
  }
}
