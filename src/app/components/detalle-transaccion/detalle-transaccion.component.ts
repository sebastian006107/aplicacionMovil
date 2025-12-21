import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Transaction, CATEGORIAS } from '../../models/transaction.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-detalle-transaccion',
  templateUrl: './detalle-transaccion.component.html',
  styleUrls: ['./detalle-transaccion.component.scss'],
  standalone: false
})
export class DetalleTransaccionComponent {

  @Input() transaccion!: Transaction;
  fotoSegura: SafeResourceUrl | null = null;

  constructor(
    private modalController: ModalController,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    if (this.transaccion.foto_comprobante) {
      this.fotoSegura = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.transaccion.foto_comprobante
      );
    }
  }

  cerrar() {
    this.modalController.dismiss();
  }

  formatearMoneda(monto: number): string {
    return `$${monto.toLocaleString('es-CL')}`;
  }

  formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    const hoy = new Date();
    const ayer = new Date(hoy);
    ayer.setDate(ayer.getDate() - 1);
    
    if (date.toDateString() === hoy.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === ayer.toDateString()) {
      return 'Ayer';
    } else {
      return date.toLocaleDateString('es-CL', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
      });
    }
  }

  obtenerIcono(categoria: string): string {
    const cat = CATEGORIAS.find(c => c.nombre === categoria);
    return cat?.icono || 'ellipsis-horizontal';
  }

  obtenerColor(categoria: string): string {
    const cat = CATEGORIAS.find(c => c.nombre === categoria);
    return cat?.color || '#B2BEC3';
  }

}