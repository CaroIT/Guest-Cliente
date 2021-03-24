import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the PipesFilterEventoPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'pipesFilterCiudad2',
})
export class PipesFilterCiudad2Pipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: any[], arg: any): any {
    // tslint:disable-next-line:curly
    if (!arg) return value;
      const resultPosts = [];
      for (const sucursal of value) {
        if (sucursal.ciudad.indexOf(arg) > -1 ) {
          resultPosts.push(sucursal);
      }
      }
      return resultPosts;
    }
}
