import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const endpoint = 'https://dev.vozilla.pl/api-client-portal/map?objectType=';

@Injectable({
  providedIn: 'root'
})

export class RestService {

  constructor(private http: HttpClient) {  }

  private extractData(res: Response) {
    const body = res;
    return body || { };
  }

  getVehiclesList(): Observable<any> {
      return this.http.get(endpoint + 'VEHICLE').pipe(map(this.extractData));
  }

  getPOIsList(): Observable<any> {
      return this.http.get(endpoint + 'POI') .pipe(map(this.extractData));
  }

  getParkingssList(): Observable<any> {
    return this.http.get(endpoint + 'PARKING') .pipe(map(this.extractData));
  }

}
