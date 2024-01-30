import { Router } from "@angular/router";

export class SharedRouterFunctions {

    /**
        * Asynchronous function to change the page
        * @param path A string representing the path to the page
        * @returns Promise<void>
    */
    public static async changePage(path : string , router : Router) : Promise<void> {
        if (path === router.url) return;
        router.navigateByUrl(path);
    }
}
