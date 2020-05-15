import { resolve } from 'path';

import exampleRoute from './server/routes/example';



const kbnBstTblPluginInitializer = ({ Plugin }) => new Plugin({
  require: ['kibana', 'elasticsearch', 'visualizations', 'interpreter', 'data'],
  name: 'kbn_bst_tbl',
  publicDir: resolve(__dirname, 'public'),
  uiExports: {
    visTypes: [
      'plugins/kbn_bst_tbl/legacy'
    ],
    hacks: [
      resolve(__dirname, 'public/legacy')
    ],
    injectDefaultVars: server => ({})
  },

  config(Joi) {
    return Joi.object({
      enabled: Joi.boolean().default(true),
    }).default();
  },

  // eslint-disable-next-line no-unused-vars
  init(server, options) {
    // Add server routes and initialize the plugin here
    exampleRoute(server);
  },
});

export default kbnBstTblPluginInitializer;
