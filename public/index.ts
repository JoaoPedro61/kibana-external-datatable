import { PluginInitializerContext } from './imports';
import { TblVisPlugin as Plugin } from './plugin';



export function plugin(initializerContext: PluginInitializerContext) {
  return new Plugin(initializerContext);
}

