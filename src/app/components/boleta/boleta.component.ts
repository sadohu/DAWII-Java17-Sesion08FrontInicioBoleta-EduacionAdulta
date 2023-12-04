import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModelClienteComponent } from '../model-cliente/model-cliente.component';
import { ModelProductoComponent } from '../model-producto/model-producto.component';
import { Cliente } from 'src/app/models/cliente.model';
import { Producto } from 'src/app/models/producto.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Boleta } from 'src/app/models/boleta.model';
import { BoletaService } from 'src/app/services/boleta.service';
import { Usuario } from 'src/app/models/usuario.model';
import { BoletaHasProducto } from 'src/app/models/boletaHasProducto.model';
import Swal from 'sweetalert2';
import { BoletaHasProductoPK } from 'src/app/models/boletaHasProductoPK.model';
import { TokenService } from 'src/app/security/token.service';

@Component({
  selector: 'app-boleta',
  templateUrl: './boleta.component.html',
  styleUrls: ['./boleta.component.css']
})
export class BoletaComponent {

  objCliente: Cliente = {};
  objProducto: Producto = {};
  dataSource: any;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  displayedColumns = ["idProducto", "nombre", "precio", "cantidad", 'actions'];

  lstProductos: Producto[] = [];
  objUsuario: Usuario = {};

  constructor(private dialogService: MatDialog,
    private boletaService: BoletaService,
    private tokenService: TokenService) {
    this.objUsuario.idUsuario = tokenService.getUserId();
  }


  ngOnInit(): void { }

  buscaCliente() {
    const dialog = this.dialogService.open(ModelClienteComponent);
    dialog.afterClosed().subscribe(() => this.cargaCliente());
  }

  cargaCliente() {
    this.objCliente = JSON.parse(window.sessionStorage.getItem("CLIENTE") || '{}');
  }

  buscaProducto() {
    const dialog = this.dialogService.open(ModelProductoComponent);
    dialog.afterClosed().subscribe(() => this.cargaProducto());
  }

  cargaProducto() {
    this.objProducto = JSON.parse(window.sessionStorage.getItem("PRODUCTO") || '{}');
  }

  agregarProducto() {
    if (this.objProducto.idProducto == null) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Debe seleccionar un producto',
      });
      return;
    }

    if (this.lstProductos.find(p => p.idProducto == this.objProducto.idProducto)) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'El producto ya se encuentra en la lista',
      });
      return;
    }

    if (this.objProducto.stock! <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No hay stock del producto seleccionado',
      });
      return;
    }

    if (this.objProducto.cantidad == null || this.objProducto.cantidad <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Debe ingresar una cantidad',
      });
      return;
    }

    if (this.objProducto.stock! < this.objProducto.cantidad!) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No hay stock suficiente del producto seleccionado',
      });
      return;
    }

    this.lstProductos.push(this.objProducto);
    this.dataSource = new MatTableDataSource(this.lstProductos);
    this.dataSource.paginator = this.paginator;
    this.objProducto = {};
  }

  eliminaProducto(objProducto: Producto) {
    const index = this.lstProductos.findIndex(p => p.idProducto == objProducto.idProducto);
    if (index != -1) {
      this.lstProductos.splice(index, 1);
      this.dataSource = new MatTableDataSource(this.lstProductos);
      this.dataSource.paginator = this.paginator;
    }
  }
  registrarBoleta() {
    let detalle: BoletaHasProducto[] = [];

    this.lstProductos.forEach(item => {

      let objDetalle: BoletaHasProducto = {
        boletaHasProductoPK: {
          idBoleta: 0,
          idProducto: item.idProducto!
        },
        cantidad: item.cantidad!,
        precio: item.precio!,
        producto: item,
      };

      detalle.push(objDetalle);
    });

    let boleta: Boleta = {
      cliente: this.objCliente,
      usuario: this.objUsuario,
      detallesBoleta: detalle,
    };

    this.boletaService.inserta(boleta).subscribe(data => {
      Swal.fire({
        icon: 'success',
        title: 'Boleta registrada',
        text: data.mensaje,
      });
      this.objCliente = {};
      this.objProducto = {};
      this.lstProductos = [];
      this.dataSource = new MatTableDataSource(this.lstProductos);
      this.dataSource.paginator = this.paginator;
    });

  }

}
