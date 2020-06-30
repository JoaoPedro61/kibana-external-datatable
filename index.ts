import { resolve } from 'path';



const kbnBstTblPluginInitializer = ({ Plugin }) => new Plugin({
  require: ['kibana', 'elasticsearch'],
  name: 'kbn-bst-tbl',
  publicDir: resolve(__dirname, 'public'),
  uiExports: {
    visTypes: [
      'plugins/kbn-bst-tbl/legacy'
    ],
    hacks: [
      resolve(__dirname, 'public/legacy')
    ],
    injectDefaultVars: server => {
      return {};
    }
  },

  config(Joi) {
    return Joi.object({
      enabled: Joi.boolean().default(true),
    }).default();
  },

  // eslint-disable-next-line no-unused-vars
  init(server, options) {
    // Add server routes and initialize the plugin here
  },
});

export default kbnBstTblPluginInitializer;
