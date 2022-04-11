import { HttpBackend, HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../model/ApiResponse';

@Injectable({
  providedIn: 'root'
})
export class ContentLibraryService {

  constructor(private http: HttpClient,
    private handler: HttpBackend) { }



  uploadImages(extension = 'jpg') {
    return this.http.get<ApiResponse>(`${environment.contentManagement}/uploadMedia?ext=${extension}`);
  }

  retrieveImages() {
    return this.http.get<ApiResponse>(`${environment.contentManagement}/retrieveMediaList`);
  }

  uploadActualImage(uri: string, file: File) {
    const headers = new HttpHeaders({ 'Content-Type': file.type });
    return this.http.put<any>(uri, file, {
      reportProgress: true,
      observe: 'events',
      headers: headers
    }).pipe(map((event) => {
      switch (event.type) {
        case HttpEventType.UploadProgress:
          const progress = Math.round(100 * event.loaded / (event.total || 1));
          return { status: 'progress', message: progress };

        case HttpEventType.Response:
          return event.body;
        default:
          return `Unhandled event: ${event.type}`;
      }

    })
    );
  }

  uploadTwitterMedia(bodyObj: any) {
    return this.http.post<any>(`${environment.contentManagement}/uploadTwitterMedia`, bodyObj);
  }

  removeMedia(mediaKey: string) {
    return this.http.get<any>(`${environment.contentManagement}/removeMedia?mediaKey=${mediaKey}`);
  }

}
