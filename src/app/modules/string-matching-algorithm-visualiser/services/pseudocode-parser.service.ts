import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, catchError, of } from 'rxjs';

/**
 * @description The service is responsible for fetching the pseudocode of the algorithm from the assets folder.
 */
@Injectable({
  providedIn: 'root'
})
export class PseudocodeParserService {

  public readonly FileSuffix = "-pseudocode.txt"
  public readonly AssetsPath = "../../../assets/"
  public readonly ResponseType = "text" as "json"


  /**
   * @param http The HttpClient service is used to fetch the pseudocode from the assets folder.
   */
  constructor(private readonly http : HttpClient) {}

  /**
   * @param algorithmName The name of the algorithm to fetch the pseudocode for. Used in the filename.
   * @returns A future string containing the pseudocode of the algorithm.
   */
  getAlgorithmPseudocode(algorithmName : string) : Observable<string> {

    return this.http.get<string>(this.AssetsPath + algorithmName + this.FileSuffix , {responseType : this.ResponseType})
    .pipe(
      catchError(error => {
        return of("ERROR  - Cannot fetch pseudocode for algorithm: " + algorithmName + ".");
      })
    );
  }
}