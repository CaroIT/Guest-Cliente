import { NgModule } from '@angular/core';
import { PlaceHolderPipe } from './place-holder/place-holder';
import { PipesCategoriaPipe } from './pipes-categoria/pipes-categoria';
import { PipesFilterEventoPipe } from './pipes-filter-evento/pipes-filter-evento';
import { PipesFilterCiudadPipe } from './pipes-filter-ciudad/pipes-filter-ciudad';
import { PipesFilterCiudad2Pipe } from './pipes-filter-ciudad2/pipes-filter-ciudad2';

@NgModule({
	declarations: [PlaceHolderPipe,
    PipesCategoriaPipe,
    PipesFilterEventoPipe,
	  PipesFilterCiudadPipe,
	  PipesFilterCiudad2Pipe],
	imports: [],
	exports: [PlaceHolderPipe,
    PipesCategoriaPipe,
    PipesFilterEventoPipe,
	  PipesFilterCiudadPipe,
	  PipesFilterCiudad2Pipe]
})
export class PipesModule {}
