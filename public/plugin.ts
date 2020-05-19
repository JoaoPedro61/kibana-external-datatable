import { Plugin, PluginInitializerContext, CoreSetup, CoreStart } from './imports';
import { TblVisPluginSetupDependencies } from './type';
import { createVisFn } from './vis_fn';
import { createTypeDefinition } from './vis_type';



export class TblVisPlugin implements Plugin<void, void> {
  initializerContext: PluginInitializerContext;

  constructor(initializerContext: PluginInitializerContext) {
    this.initializerContext = initializerContext;
  }

  public setup(
    core: CoreSetup,
    { data, visualizations, expressions }: TblVisPluginSetupDependencies
  ) {
    expressions.registerFunction(createVisFn);
    visualizations.createReactVisualization(createTypeDefinition(arguments));
  }

  public start(core: CoreStart) {
    // nothing to do here yet
  }
}
