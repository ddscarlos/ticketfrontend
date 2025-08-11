import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-modal-preview',
  template: `
  <div class="modal-header">
    <h5 class="modal-title">{{ name || 'Vista previa' }}</h5>
    <button type="button" class="btn-close" aria-label="Close" (click)="close()"></button>
  </div>
  <div class="modal-body">
    <ng-container *ngIf="isPdf; else imgTpl">
      <iframe [src]="safeSrc" style="width:100%;height:70vh;border:0;"></iframe>
    </ng-container>
    <ng-template #imgTpl>
      <img [src]="safeSrc" style="max-width:100%;height:auto;display:block;margin:0 auto;" />
    </ng-template>
  </div>
  <div class="modal-footer">
    <button class="btn btn-secondary btn-sm" (click)="close()">Cerrar</button>
  </div>
  `
})
export class ModalPreviewComponent implements OnInit {
  @Input() dataUri: string;   // viene del backend
  @Input() mime?: string;     // opcional
  @Input() name?: string;

  safeSrc: SafeResourceUrl | null = null;
  isPdf = false;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    // Obtener MIME desde dataUri si no lo envían
    var mimeFromDataUri = '';
    if (this.dataUri && this.dataUri.indexOf(';base64,') > -1) {
      mimeFromDataUri = this.dataUri.split(';base64,')[0].replace('data:', '');
    }

    var mime = this.mime ? this.mime : mimeFromDataUri;

    if (mime && mime.indexOf('pdf') !== -1) {
      this.isPdf = true;
    }

    this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.dataUri);
  }

  close() {
    /* (window as any).bootstrap?.Modal?.getInstance?.(document.body)?.hide?.(); */
  }
}
