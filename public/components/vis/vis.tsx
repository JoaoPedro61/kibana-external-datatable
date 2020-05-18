import React, { Fragment, useState, useEffect } from 'react';
import {
	EuiBasicTable,
	EuiLoadingSpinner,
	EuiFlexGroup,
	EuiFlexItem,
	EuiSpacer
} from '@elastic/eui';
import { VisParamTblColumn } from './../../type';




export function VisComponent({ visData, visParams, config, vis, updateStatus }) {

	console.log(updateStatus);

	const [ itemsTotal, setItemsTotal ] = useState(0);

	const [ pageIndex, setPageIndex ] = useState(0);

	const [ pageSize, setPageSize ] = useState(visParams.pageSize);

	const [ pageSizes, setPageSizes ] = useState(visParams.pageSizes);

	const [ usePagination, setUsePagination ] = useState(visParams.usePagination);

	const [ allowSortAndOrder, setAllowSortAndOrder ] = useState(visParams.allowSortAndOrder);

	const [ columns, setColumns ] = useState(visParams.columns);

	const [ uriTarget, setURITarget ] = useState(visParams.uriTarget);

	const [ defaultFilters, setDefaultFilters ] = useState(visParams.defaultFilters);

	const [ sendKeySortDirection, setSendKeySortDirection ] = useState(visParams.sendKeySortDirection);

	const [ sendKeySortField, setSendKeySortField ] = useState(visParams.sendKeySortField);

	const [ sendKeyOffset, setSendKeyOffset ] = useState(visParams.sendKeyOffset);

	const [ sendKeyPageSize, setSendKeyPageSize ] = useState(visParams.sendKeyPageSize);

	const [ sortField, setSortField ] = useState(visParams.sortField);

  const [ sortDirection, setSortDirection ] = useState(visParams.sortDirection);

  const [ pageOfItems, setPageOfItems ] = useState([]);

  const [ loading, setLoading ] = useState(true);

  console.log(config);

  function _loadDatatable(): void {
  	const get = config.api.http.get;
  	if (!loading) {
  		setLoading(true);
  	}
  	get(uriTarget)
  		.then((response: any) => {
  			console.log(response);
  			setLoading(false);
  			setPageOfItems(response);
  		}).catch((error: any) => {
  			console.log(error);
  			setLoading(false);
  		});
  }

	function onTableChange({ page = {}, sort = {} }): void {
    const { index: pageIndex, size: pageSize } = page;
    const { field: sortField, direction: sortDirection } = sort;
		setPageIndex(pageIndex);
    setPageSize(pageSize);
    setSortField(sortField);
    setSortDirection(sortDirection);

		console.log(arguments);
	}

	useEffect(() => {
		let didCancel = false;
		if (!didCancel) {
			if (updateStatus.params) {
				setPageSize(visParams.pageSize);
				setUsePagination(visParams.usePagination);
				setAllowSortAndOrder(visParams.allowSortAndOrder);
				setColumns(visParams.columns);
				setURITarget(visParams.uriTarget);
				setDefaultFilters(visParams.defaultFilters);
				setPageSizes(visParams.pageSizes);
				setSortDirection(visParams.sortDirection);
				setSortField(visParams.sortField);
				setSendKeySortDirection(visParams.sendKeySortDirection);
				setSendKeySortField(visParams.sendKeySortField);
				setSendKeyOffset(visParams.sendKeyOffset);
				setSendKeyPageSize(visParams.sendKeyPageSize);
			}
		}
		return () => {
			didCancel = true;
		};
	}, [visParams]);

	useEffect(() => {
		_loadDatatable();
	}, []);

  const _columns: any[] = columns.map((item: VisParamTblColumn) => {
  	return {
  		field: item.target,
  		name: item.label,
  		align: item.alignment || 'left',
    	truncateText: !!item.truncateText,
  		...(allowSortAndOrder ? {
  			sortable: item.hasOwnProperty('sortable') ? !!(item as any).sortable : true,
  		} : {}),
  		hideForMobile: !!item.hideOnMobile,
  		mobileOptions: {
  			show: !item.hideOnMobile
  		},
  	};
  });

  let _pagination = undefined;

  if (usePagination) {
  	_pagination = {
	    pageIndex,
	    pageSize,
	    totalItemCount: itemsTotal,
	    pageSizeOptions: pageSizes,
	    hidePerPageOptions: false,
	  };
  }

  let _sorting = undefined;

  if (allowSortAndOrder) {
  	_sorting = {
	    sort: {
	      field: sortField,
	      direction: sortDirection,
	    },
	    allowNeutralSort: true
	  };
  }

	return (
		<Fragment>
			{
				loading ? (
					<>
						<EuiFlexGroup alignItems="center" justifyContent="center" gutterSize="none">
							<EuiFlexItem grow={false}>
								<EuiSpacer size="xxl"/>
	              <EuiLoadingSpinner size="xl" />
							</EuiFlexItem>
						</EuiFlexGroup>
					</>
				)
				: (
					<>
						<EuiBasicTable
							noItemsMessage="Não há dados"
			        items={pageOfItems}
			        columns={_columns}
			        sorting={_sorting}
			        pagination={_pagination}
			        onChange={onTableChange}
			      />
					</>
	      )
			}
		</Fragment>
	);
}
