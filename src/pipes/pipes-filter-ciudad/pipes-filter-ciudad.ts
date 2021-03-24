import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the PipesFilterEventoPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'pipesFilterCiudad',
})
export class PipesFilterCiudadPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: any[], arg: any): any {
    // tslint:disable-next-line:curly
    if (!arg) return value;
      const resultPosts = [];
      for (const evento of value) {
        if (evento.ciudad.indexOf(arg) > -1 ) {
          resultPosts.push(evento);
      }
      }
      return resultPosts;
    }
}
