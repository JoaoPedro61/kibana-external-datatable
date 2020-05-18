import { VisParams } from './type';



export const DEFAULT_VIS_CONFIG: VisParams = {
	columns: [
    {
      target: 'id',
      label: 'Code',
      key: '_A001'
    },
    {
      target: 'title',
      label: 'Title',
      key: '_A002'
    }
  ],
  uriTarget: 'https://jsonplaceholder.typicode.com/todos',
  showHeader: true,
  usePagination: false,
  allowSortAndOrder: false,
  page: 1,
  pageSize: 15,
  defaultFilters: {},
};
