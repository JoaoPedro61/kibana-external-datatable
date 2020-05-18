import {
  visualizationsSetup,
  npStart,
  npSetup,
  PluginInitializerContext
} from './imports';

import { TblVisPluginSetupDependencies } from './type';

import { plugin } from '.';



const plugins: Readonly<TblVisPluginSetupDependencies> = {
  expressions: npSetup.plugins.expressions,
  visualizations: visualizationsSetup,
  data: npSetup.plugins.data,
};

const pluginInstance = plugin({} as PluginInitializerContext);

export const setup = pluginInstance.setup(npSetup.core, plugins);
export const start = pluginInstance.start(npStart.core);
