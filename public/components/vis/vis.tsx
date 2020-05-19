import React, { Fragment, useState, useEffect } from 'react';
import {
	EuiBasicTable,
	EuiLoadingSpinner,
	EuiFlexGroup,
	EuiFlexItem,
	EuiSpacer
} from '@elastic/eui';
import { VisParamTblColumn } from './../../type';
import { merge } from './../../deep-merge';
import { get } from '../../api';
import { take } from 'rxjs/operators';



export function VisComponent({ visData, visParams, config, vis, updateStatus }) {

	console.log(updateStatus);

	let oldDiffs: string[] = [];

	const [firstTime, setFirstTime] = useState(true);

	const [shouldReload, setShouldReload] = useState(false);

	const [pageIndex, setPageIndex] = useState(0);

	const [pageSize, setPageSize] = useState(visParams.pageSize);

	const [pageSizes, setPageSizes] = useState(visParams.pageSizes);

	const [usePagination, setUsePagination] = useState(visParams.usePagination);

	const [allowSortAndOrder, setAllowSortAndOrder] = useState(visParams.allowSortAndOrder);

	const [columns, setColumns] = useState(visParams.columns);

	const [uriTarget, setURITarget] = useState(visParams.uriTarget);

	const [defaultFilters, setDefaultFilters] = useState(visParams.defaultFilters);

	const [sendKeySortDirection, setSendKeySortDirection] = useState(visParams.sendKeySortDirection);

	const [sendKeySortField, setSendKeySortField] = useState(visParams.sendKeySortField);

	const [sendKeyOffset, setSendKeyOffset] = useState(visParams.sendKeyOffset);

	const [sendKeyPageSize, setSendKeyPageSize] = useState(visParams.sendKeyPageSize);

	const [sortField, setSortField] = useState(visParams.sortField);

	const [sortDirection, setSortDirection] = useState(visParams.sortDirection);

	const [itemsTotal, setItemsTotal] = useState(0);

	const [pageOfItems, setPageOfItems] = useState([]);

	const [loading, setLoading] = useState(true);

	function _loadDatatable(ignoreFirstTime: boolean = false): void {
		if (ignoreFirstTime ? false : firstTime) {
			setFirstTime(false);
		} else {
			if (!loading) {
				setLoading(true);
			}
			let queryString: Partial<any> = {
				...(allowSortAndOrder ? {
					[sendKeySortDirection]: sortDirection,
					[sendKeySortField]: sortField
				} : {}),
				...(usePagination ? {
					[sendKeyOffset]: pageIndex * pageSize,
					[sendKeyPageSize]: pageSize,
				} : {}),
			};

			queryString = merge({...defaultFilters}, {...queryString});

			get(uriTarget, queryString)
				.pipe(take(1))
				.subscribe((response: any) => {
					setLoading(false);
					if (!Array.isArray(response) && response.hasOwnProperty('data')) {
						setPageOfItems(response.data);
						if (response.hasOwnProperty('total')) {
							setItemsTotal(response.total);
						} else {
							setItemsTotal(response.data.length);
						}
					} else if (Array.isArray(response)) {
						setPageOfItems(response as any);
						setItemsTotal(response.length);
					}
				}, () => {
					setPageOfItems([]);
					setItemsTotal(0);
					setLoading(false);
				});
		}
	}

	function onTableChange({ page = { }, sort = {} }): void {
		const { index, size } = page as any;
		const { field, direction } = sort as any;

		setPageIndex(index || 0);
		setPageSize(size || pageSizes[0]);

		setSortField(field);
		setSortDirection(direction);

		setShouldReload(!shouldReload);
	}

	useEffect(() => {
		let didCancel = false;

		!didCancel && _loadDatatable();

		return () => {
			didCancel = true;
		};
	}, [shouldReload])

	useEffect((...args: any) => {
		let didCancel = false;
		let execLoad = false;
		oldDiffs = [];
		if (!didCancel) {
			if (updateStatus.params) {
				if (pageSize !== visParams.pageSize) {
					oldDiffs.push('pageSize');
					setPageSize(visParams.pageSize);
					execLoad = true;
				}
				if (usePagination !== visParams.usePagination) {
					oldDiffs.push('usePagination');
					setUsePagination(visParams.usePagination);
					execLoad = true;
				}
				if (allowSortAndOrder !== visParams.allowSortAndOrder) {
					oldDiffs.push('allowSortAndOrder');
					setAllowSortAndOrder(visParams.allowSortAndOrder);
				}
				if (uriTarget !== visParams.uriTarget) {
					oldDiffs.push('uriTarget');
					setURITarget(visParams.uriTarget);
					execLoad = true;
				}
				if (sortDirection !== visParams.sortDirection) {
					oldDiffs.push('sortDirection');
					setSortDirection(visParams.sortDirection);
					execLoad = true;
				}
				if (sortField !== visParams.sortField) {
					oldDiffs.push('sortField');
					setSortField(visParams.sortField);
					execLoad = true;
				}
				if (sendKeySortDirection !== visParams.sendKeySortDirection) {
					oldDiffs.push('sendKeySortDirection');
					setSendKeySortDirection(visParams.sendKeySortDirection);
					execLoad = true;
				}
				if (sendKeySortField !== visParams.sendKeySortField) {
					oldDiffs.push('sendKeySortField');
					setSendKeySortField(visParams.sendKeySortField);
					execLoad = true;
				}
				if (sendKeyOffset !== visParams.sendKeyOffset) {
					oldDiffs.push('sendKeyOffset');
					setSendKeyOffset(visParams.sendKeyOffset);
					execLoad = true;
				}
				if (sendKeyPageSize !== visParams.sendKeyPageSize) {
					oldDiffs.push('sendKeyPageSize');
					setSendKeyPageSize(visParams.sendKeyPageSize);
					execLoad = true;
				}
				if (execLoad) {
					_loadDatatable();
				}
			}
		}
		return () => {
			didCancel = true;
		};
	}, [visParams]);

	useEffect(() => {
		let didCancel = false;
		if (!didCancel) {
			if (!oldDiffs.length || oldDiffs.indexOf('defaultFilters') === -1) {
				oldDiffs.push('defaultFilters');
			}
			setDefaultFilters(visParams.defaultFilters);
			_loadDatatable();
		}
		return () => {
			didCancel = true;
		};
	}, [visParams.defaultFilters]);

	useEffect(() => {
		let didCancel = false;
		if (!didCancel) {
			if (!oldDiffs.length || oldDiffs.indexOf('pageSizes') === -1) {
				oldDiffs.push('pageSizes');
			}
			setPageSizes(visParams.pageSizes);

		}
		return () => {
			didCancel = true;
		};
	}, [visParams.pageSizes]);

	useEffect(() => {
		let didCancel = false;
		if (!didCancel) {
			if (!oldDiffs.length || oldDiffs.indexOf('columns') === -1) {
				oldDiffs.push('columns');
			}
			setColumns(visParams.columns);
		}
		return () => {
			didCancel = true;
		};
	}, [visParams.columns]);

	useEffect(() => {
		_loadDatatable(true);
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

	useEffect(() => {
		let didCancel = false;
		if (!didCancel) {
			if (updateStatus.aggs || updateStatus.uiState) {
				setShouldReload(!shouldReload);
			}
		}
		return () => {
			didCancel = true;
		};
	}, [updateStatus]);

	return (
		<Fragment>
			{
				loading ? (
					<>
						<EuiFlexGroup alignItems="center" justifyContent="center" gutterSize="none">
							<EuiFlexItem grow={false}>
								<EuiSpacer size="xxl" />
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
