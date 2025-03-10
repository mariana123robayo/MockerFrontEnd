import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';

import {
  BehaviorSubject,
  map,
  Observable,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import * as YAML from 'yaml';

import { environment } from '../../../environments/environment';
import { SchemaShort } from '../interfaces/schema-short.interface';
import { __read } from 'tslib';

@Injectable({
  providedIn: 'root',
})
export class SchemaService {
  private URL = environment.URL;
  public copySchemas: SchemaShort[] = [];
  private _refresh = new BehaviorSubject<void>(undefined);

  constructor(private http: HttpClient) {}

  get refresh() {
    return this._refresh.asObservable();
  }

  private convertFile(file: File) {
    const allowedExtensions = ['.yaml', '.yml'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (!(fileExtension && allowedExtensions.includes(`.${fileExtension}`))) {
      return throwError(() => new Error('Formato de archivo no permitido'));
    }

    return new Observable<string>((observer) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = YAML.parse(e.target?.result as string);
          observer.next(data);
          observer.complete();
        } catch (error) {
          observer.error(new Error('Error al leer el archivo.'));
        }
      };
      reader.readAsText(file);
    });
  }

  createSchema(file: File) {
    return this.convertFile(file).pipe(
      switchMap((data) => this.http.post(`${this.URL}/schema`, data)),
      tap(() => this._refresh.next())
    );
  }

  getSchemas() {
    return this._refresh.pipe(
      switchMap(() => this.http.get<SchemaShort[]>(`${this.URL}/schema/short`)),
      map((schemas) =>
        schemas.map((schema) => ({
          ...schema,
          name: schema.name.toLowerCase(),
        }))
      ),
      tap((schemas) => (this.copySchemas = [...schemas]))
    );
  }

  private convertTemplate(file: File) {
    const allowedExtensions = ['.txt'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (!(fileExtension && allowedExtensions.includes(`.${fileExtension}`))) {
      return throwError(() => new Error('Formato de archivo no permitido'));
    }

    return new Observable<string>((observer) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result as string;
          observer.next(data);
          observer.complete();
        } catch (error) {
          observer.error(new Error('Error al leer el archivo.'));
        }
      };
      reader.readAsText(file);
    });
  }

  createTemplate(file: File, id: string) {
    return this.convertTemplate(file).pipe(
      switchMap((body) => {
        return this.http.put(`${this.URL}/schema/template/${id}`, body);
      })
    );
  }

  startSchema(id: string) {
    return this.http
      .get(`${this.URL}/simulation/start/${id}`)
      .pipe(tap(() => this._refresh.next()));
  }

  // getSchemasStream() {
  //   return new Observable<SchemaShort[]>((observer) => {
  //     const params = new HttpParams().set('interval', 2);
  //     const eventSource = new EventSource(
  //       `${this.URL}/schema/short/stream?${params.toString()}`
  //     );

  //     eventSource.onmessage = (event) => {
  //       this.ngZone.run(() => {
  //         observer.next(JSON.parse(event.data));
  //         this.copySchemas = JSON.parse(event.data) ;
  //       });
  //     };

  //     eventSource.onerror = (error) => {
  //       this.ngZone.run(() => {
  //         observer.error(error);
  //       });
  //     };

  //     return () => {
  //       eventSource.close();
  //     };
  //   });
  // }

  deleteSchema(id: string) {
    return this.http
      .delete(`${this.URL}/schema/${id}`)
      .pipe(tap(() => this._refresh.next()));
  }
}
