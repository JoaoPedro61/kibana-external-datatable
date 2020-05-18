import { DataPublicPlugin, VisualizationsSetup, ExpressionsPublicPlugin } from './imports';


export interface RenderValue<C, V = VisParams> {
  visType: 'metric';
  visData: C;
  visConfig: V;
  params: any;
}

export interface VisParamTblColumn {
	key: string;
	target: string;
	label: string;
}

export interface VisParams {
  columns: VisParamTblColumn[];
  uriTarget: string;
  showHeader: boolean;
  usePagination: boolean;
  allowSortAndOrder: boolean;

  page: number;
  pageSize: number;
  defaultFilters: Partial<any>;
}

export interface TblVisPluginSetupDependencies {
  data: ReturnType<DataPublicPlugin['setup']>;
  visualizations: VisualizationsSetup;
  expressions: ReturnType<ExpressionsPublicPlugin['setup']>;
}
