import { DataPublicPlugin, VisualizationsSetup, ExpressionsPublicPlugin } from './imports';


export interface RenderValue<C, V = VisParams> {
  visType: 'metric';
  visData: C;
  visConfig: V;
  params: any;
}

export interface VisParamTblColumn {
  [x: string]: any;
	key: string;
	target: string;
	label: string;
  sortable: boolean;
  hideOnMobile: boolean;
  truncateText: boolean;
  alignment: string;
}

export interface VisParams {
  [x: string]: any;
  columns: VisParamTblColumn[];
  uriTarget: string;
  usePagination: boolean;
  allowSortAndOrder: boolean;
  pageSize: number;
  pageSizes: number[];
  defaultFilters: Partial<any>;
  sortDirection: string;
  sortField: string;
  sendKeySortDirection: string;
  sendKeySortField: string;
  sendKeyOffset: string;
  sendKeyPageSize: string;
}

export interface TblVisPluginSetupDependencies {
  data: ReturnType<DataPublicPlugin['setup']>;
  visualizations: VisualizationsSetup;
  expressions: ReturnType<ExpressionsPublicPlugin['setup']>;
}
