import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, catchError, of } from 'rxjs';

/**
 * @description The service is responsible for fetching the pseudocode of the algorithm from the assets folder.
 */
@Injectable({
  providedIn: 'root'
})
export class PseudocodeParserService {

  /**
   * @description The file suffix is used to append at the end algorithm name to fetch the pseudocode from the assets folder.
   */
  public readonly FileSuffix = "-pseudocode.txt"

  /**
   * @description The assets path is used to fetch the pseudocode from the assets folder.
   */
  public readonly AssetsPath = "../../../assets/"

  /**
   * @description The response type is used to convert pseudocode to json from a text file when fetched.
   */
  public readonly ResponseType = "text" as "json"


  /**
   * @param http The HttpClient service is used to fetch the pseudocode from the assets folder.
   */
  constructor(private readonly http : HttpClient) {}

  /**
   * @description This function is used to fetch the pseudocode of the algorithm from the assets folder.
   * @param algorithmName The name of the algorithm to fetch the pseudocode for. Used in the filename.
   * @returns Observable<string> A future string containing the pseudocode of the algorithm.
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