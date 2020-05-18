export {
  Plugin as ExpressionsPublicPlugin,
  ExpressionFunction,
  Render,
  KibanaDatatable
} from './../../../src/plugins/expressions/public';

export {
  Plugin as DataPublicPlugin
} from '../../../src/plugins/data/public';

export {
  VisualizationsSetup,
  Status
} from 'plugins/visualizations';

export {
  setup as visualizationsSetup
} from './../../../src/legacy/core_plugins/visualizations/public/np_ready/public/legacy';

export {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Plugin,
  IUiSettingsClient
} from './../../../src/core/public';

export {
  npSetup,
  npStart
} from 'ui/new_platform';
