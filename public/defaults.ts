import { VisParams } from './type';



export const DEFAULT_VIS_CONFIG: VisParams = {
	columns: [
    {
      target: 'id',
      label: 'Code',
      key: '_A001',
      sortable: true,
      hideOnMobile: false,
      truncateText: true,
      alignment: 'left',
    },
    {
      target: 'title',
      label: 'Title',
      key: '_A002',
      sortable: true,
      hideOnMobile: false,
      truncateText: true,
      alignment: 'left',
    }
  ],
  uriTarget: 'https://jsonplaceholder.typicode.com/todos',
  usePagination: false,
  allowSortAndOrder: false,
  pageSize: 15,
  defaultFilters: {},
  pageSizes: [10, 15, 20, 50, 100],
  sortDirection: 'asc',
  sortField: 'id',
  sendKeySortDirection: '_sort',
  sendKeySortField: '_order',
  sendKeyOffset: '_offset',
  sendKeyPageSize: '_limit'
};
