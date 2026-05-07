import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Artificial {
  private http = inject(HttpClient);
  private api = "/api/foodBot";

  sendFood(file: File){
    const formData = new FormData();
    formData.append('photo', file, file.name);

    return this.http.post<string>(`${this.api}/recognize`, formData)
  }
  
}
