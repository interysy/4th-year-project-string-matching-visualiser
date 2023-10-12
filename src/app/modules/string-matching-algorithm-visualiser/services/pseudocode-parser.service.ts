import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PseudocodeParserService {

  constructor(private readonly http : HttpClient) {}

  getAlgorithmPseudocode(algorithmName : string) : Observable<string> {
    return this.http.get<string>("../../../assets/" + algorithmName + "-pseudocode.txt" , {responseType : "text" as "json"});
  }
}
