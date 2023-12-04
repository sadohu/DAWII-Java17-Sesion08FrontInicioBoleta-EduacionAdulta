import { Injectable } from '@angular/core';
import { AppSettings } from '../app.settings';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../models/producto.model';

const baseUrl = AppSettings.API_ENDPOINT + "/boleta";

@Injectable({
  providedIn: 'root'
})
export class ProductoService {


  constructor(private http: HttpClient) { }

  consultaFiltro(filtro: string, page: number, size: number): Observable<Producto[]> {
    return this.http.get<Producto[]>(baseUrl + '/productos/' + filtro + '?page=' + page + '&size=' + size);
  }
}
