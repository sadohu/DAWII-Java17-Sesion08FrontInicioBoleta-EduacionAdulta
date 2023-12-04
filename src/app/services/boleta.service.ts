import { Injectable } from '@angular/core';
import { Boleta } from '../models/boleta.model';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from '../app.settings';
import { Observable } from 'rxjs';

const baseUrl = AppSettings.API_ENDPOINT + "/boleta";

@Injectable({
  providedIn: 'root'
})
export class BoletaService {

  constructor(private http: HttpClient) { }

  inserta(obj: Boleta): Observable<any> {
    return this.http.post(baseUrl + "/boleta", obj);
  }
}
