import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FatsecretService {
  private http = inject(HttpClient);
  private api = '/api/fatsecret';

  searchFoods(query: string) {  
    return this.http
      .get<any>(`${this.api}/search`, {
        params: { q: query }
      })
      .pipe(
        map(res => {      
          const foods = res?.foods?.food;
          if (!foods) return [];
          return Array.isArray(foods) ? foods : [foods];
        })
      );
  }


}  