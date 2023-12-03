import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Cliente } from 'src/app/models/cliente.model';
import { ClienteService } from 'src/app/services/cliente.service';

const OPCIONES_CLIENTE = 'Opciones';

@Component({
  selector: 'app-model-cliente',
  templateUrl: './model-cliente.component.html',
  styleUrls: ['./model-cliente.component.css']
})
export class ModelClienteComponent {

  //Filtro de Grila
  filtro: string = "";

  //Grilla
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  displayedColumns = ["idCliente", "nombre", "apellido", 'actions'];
  pageIndex = 0;
  pageSize = 20;
  pageSizeOptions = [5, 10];
  dataSource: any;

  constructor(private dialog: MatDialog, private clienteService: ClienteService) {
    this.refreshTable("_all");
  }

  seleccioneCliente(objCliente: Cliente) {

  }

  applyFilter() {
    this.refreshTable(this.filtro);
  }

  onPageChange(any: any) {

  }

  private refreshTable(filtro: string) {
    filtro = (filtro.trim() == "") ? "_all" : filtro.trim();
    this.clienteService.consultaFiltro(filtro, this.pageIndex, this.pageSize).subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });
  }

}
