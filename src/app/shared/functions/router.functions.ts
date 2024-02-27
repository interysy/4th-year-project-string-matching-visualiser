import { Router } from "@angular/router";


/**
 * @description A class containing shared functions for the router. Utilised by components to change the page.
 */
export class SharedRouterFunctions {

    /**
        * @description Asynchronous function to change the page
        * @param path A string representing the path to the page
        * @returns Promise<void>
    */
    public static async changePage(path : string , router : Router) : Promise<void> {
        if (path === router.url) return;
        router.navigateByUrl(path);
    }
}
