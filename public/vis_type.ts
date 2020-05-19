import { VisComponent, OptionsComponent } from './components';
import { DEFAULT_VIS_CONFIG } from './defaults';


export const createTypeDefinition = (dependencies?: any) => {
  return {
    name: 'bst_tbl',
    title: 'Brisanet datatable',
    icon: 'tableDensityNormal',
    description: 'Provides a basic API to assemble a table, consuming data from the Brisanet database.',
    requiresUpdateStatus: ['params'],
    requiresPartialRows: true,
    visConfig: {
      component: VisComponent,
      defaults: {
        ...DEFAULT_VIS_CONFIG
      }
    },
    editorConfig: {
      optionsTemplate: OptionsComponent
    },
    responseHandler: 'none',
    requestHandler: 'none',
  };
};
