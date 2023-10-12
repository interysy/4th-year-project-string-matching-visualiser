import { CanActivateFn } from '@angular/router';

export const implementedAlgorithmsGuard: CanActivateFn = (route, state) => {

  console.log(route);
  console.log(state);
  return true;
};
