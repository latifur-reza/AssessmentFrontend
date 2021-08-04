import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReadingService {

  url: string;
  constructor(public http: HttpClient) {
    this.url = environment.urls.api_url + "api/Reading";
  }

  getReadings(data : any): Observable<any> {
    return this.http.post<Array<any>>(this.url, data);
  }

}
