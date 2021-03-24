import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the PipesCategoriaPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'pipesCategoria',
  // pure: false
})
export class PipesCategoriaPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
//   transform(items: any[], filter: Object): any {
//     if (!items || !filter) {
//         return items;
//     }
//     // filter items array, items which match and return true will be
//     // kept, false will be filtered out
//     return items.filter(item => item.title.indexOf(filter.title) !== -1);
// }
transform(value: any[], arg: any): any {
  // tslint:disable-next-line:curly
  if (!arg) return value;
    const resultPosts = [];
    for (const sucursal of value) {
      if (sucursal.tipo.indexOf(arg) > -1 ) {
        resultPosts.push(sucursal);
    }
    }
    return resultPosts;
  }
// transform(sucursales: any[], filter: Object): any {
//   // tslint:disable-next-line:curly
//   if (!sucursales || !filter ) {
//     return sucursales;
//   }
//   return sucursales.filter(sucursal => sucursal.tipo.indexOf(sucursal.tipo) !== -1)
// }
    // const resultPosts = [];
    // for (const sucursal of value) {
    //   if (sucursal.tipo > -1 ) {
    //     resultPosts.push(sucursal);
    // }
    // }
    // return resultPosts;
  // }
  // transform(value: any, arg: any): any {
  //       const resultPosts = [];
  //     for (const sucursal of value) {
  //       if (sucursal.tipo.indexOf(arg) > -1 ) {
  //         resultPosts.push(sucursal);
  //     }
  //     }
  //     return resultPosts;
  //   }
}
