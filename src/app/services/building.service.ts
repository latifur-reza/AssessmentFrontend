import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BuildingService {

  url: string;
  constructor(public http: HttpClient) {
    this.url = environment.urls.api_url + "api/Building";
  }

  getBuildings(): Observable<any> {
    return this.http.get<Array<any>>(this.url, this.getHeaders());
  }

  private getHeaders(): any {
    const httpOption = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    return httpOption;
  }
  
}
