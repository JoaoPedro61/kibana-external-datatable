import React, { Fragment, useState, useEffect } from 'react';
import {
	EuiBasicTable,
	EuiLoadingSpinner,
	EuiFlexGroup,
	EuiFlexItem,
	EuiText,
	EuiEmptyPrompt,
	EuiTitle
} from '@elastic/eui';
import { VisParamTblColumn } from './../../type';
import { merge } from './../../deep-merge';
import { get as letItGo } from '../../api';
import { take } from 'rxjs/operators';
import { addQueryParams, isValid } from '../../valid-url';
import { equals } from '../../equals';
import { requestErrors } from '../../requests-error';



export function VisComponent({ visData, visParams }) {

	const [currentVisData, set_currentVisData] = useState(visData);

	const [timer, set_timer] = useState(null);

	const [shouldIgnoreFirst, set_shouldIgnoreFirst] = useState(true);

	const [isLoading, set_isLoading] = useState(isValid(visParams.uriTarget));

	const [validURI, set_validURI] = useState(isValid(visParams.uriTarget));
	
	const [data_error, set_data_error] = useState(`noErros`);

	const [shouldReload, set_shouldReload] = useState(false);

	const [pageIndex, set_pageIndex] = useState(0);

	const [pageSize, set_pageSize] = useState(visParams.pageSize);
	
	const [pageSizes, set_pageSizes] = useState(visParams.pageSizes);

	const [uriTarget, set_uriTarget] = useState(visParams.uriTarget);

	const [usePagination, set_usePagination] = useState(visParams.usePagination);

	const [allowSortAndOrder, set_allowSortAndOrder] = useState(visParams.allowSortAndOrder);

	const [columns, set_columns] = useState(visParams.columns);

	const [defaultFilters, set_defaultFilters] = useState(visParams.defaultFilters);

	const [sendKeySortDirection, set_sendKeySortDirection] = useState(visParams.sendKeySortDirection);

	const [sendKeySortField, set_sendKeySortField] = useState(visParams.sendKeySortField);

	const [sendKeyOffset, set_sendKeyOffset] = useState(visParams.sendKeyOffset);

	const [sendKeyPageSize, set_sendKeyPageSize] = useState(visParams.sendKeyPageSize);

	const [sortField, set_sortField] = useState(visParams.sortField);

	const [sortDirection, set_sortDirection] = useState(visParams.sortDirection);

	const [itemsTotal, set_itemsTotal] = useState(0);

	const [pageOfItems, set_pageOfItems] = useState([]);

	function _fetchMetadata(loadFrom?: string) {
		if (!timer) {
			const _timer: any = setTimeout(() => {
				if (!validURI) {
					if (isLoading) {
						set_isLoading(false);
					}
				} else {
					if (!isLoading) {
						set_isLoading(true);
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
					queryString = merge({ ...defaultFilters }, { ...queryString });
					const uri = addQueryParams(visParams.uriTarget, { ...queryString, ...visData }, [
						`type`,
						`timeRange`,
						`query`,
						`filters`,
						sendKeySortDirection,
						sendKeySortField,
						sendKeyOffset,
						sendKeyPageSize,
					]);
					letItGo(uri)
						.pipe(take(1))
						.subscribe((response) => {
							if (!Array.isArray(response) && response.hasOwnProperty('data')) {
								set_pageOfItems(response.data);
								if (response.hasOwnProperty('total')) {
									set_itemsTotal(response.total);
								} else {
									set_itemsTotal(response.data.length);
								}
							} else if (Array.isArray(response)) {
								set_pageOfItems(response as any);
								set_itemsTotal(response.length);
							} else {
								set_data_error(`malformationDataResponse`);
							}
							set_isLoading(false);
						}, (error) => {
							set_data_error(error.statusName);
							set_pageOfItems([]);
							set_itemsTotal(0);
							set_isLoading(false);
						});
				}
				set_timer(null);
			}, 300);
			set_timer(_timer);
		}
	}

	function onTableChange({ page = { }, sort = {} }): void {
		const { index, size } = page as any;
		const { field, direction } = sort as any;

		set_pageIndex(index || 0);
		set_pageSize(size || pageSizes[0]);

		set_sortField(field);
		set_sortDirection(direction);

		set_shouldReload(!shouldReload);
	}

	useEffect(() => {
		let didCancel = false;
		if (!didCancel) {
			if (!shouldIgnoreFirst) {
				_fetchMetadata(`shouldReload useEffect`);
			}
		}
		return () => {
			didCancel = true;
		};
	}, [shouldReload]);

	useEffect(() => {
		let didCancel = false;

		if (!didCancel) {
			if (!shouldIgnoreFirst) {
				if (!equals(currentVisData, visData)) {
					set_validURI(isValid(visParams.uriTarget));
					set_uriTarget(visParams.uriTarget);
					set_currentVisData(visData);
					_fetchMetadata(`visdata useEffect`);
				}
			}
		}

		return () => {
			didCancel = true;
		}
	}, [visData]);

	useEffect(() => {
		let didCancel = false;
		if (!didCancel) {

			let _go = false;

			if (visParams.uriTarget !== uriTarget) {
				_go = true;
				set_validURI(isValid(visParams.uriTarget));
				set_uriTarget(visParams.uriTarget);
			}

			if (visParams.pageSize !== pageSize) {
				_go = true;
				set_pageSize(visParams.pageSize);
			}

			if (visParams.usePagination !== usePagination) {
				_go = true;
				set_usePagination(visParams.usePagination);
			}

			if (visParams.allowSortAndOrder !== allowSortAndOrder) {
				set_allowSortAndOrder(visParams.allowSortAndOrder);
			}

			if (visParams.sendKeySortDirection !== sendKeySortDirection) {
				_go = true;
				set_sendKeySortDirection(visParams.sendKeySortDirection);
			}

			if (visParams.sendKeySortField !== sendKeySortField) {
				_go = true;
				set_sendKeySortField(visParams.sendKeySortField);
			}

			if (visParams.sendKeyOffset !== sendKeyOffset) {
				_go = true;
				set_sendKeyOffset(visParams.sendKeyOffset);
			}

			if (visParams.sendKeyPageSize !== sendKeyPageSize) {
				_go = true;
				set_sendKeyPageSize(visParams.sendKeyPageSize);
			}

			if (visParams.sortField !== sortField) {
				_go = true;
				set_sortField(visParams.sortField);
			}

			if (visParams.sortDirection !== sortDirection) {
				_go = true;
				set_sortDirection(visParams.sortDirection);
			}

			if (!equals(visParams.columns, columns)) {
				set_columns(visParams.columns);
			}

			if (!equals(visParams.defaultFilters, defaultFilters)) {
				_go = true;
				set_defaultFilters(visParams.defaultFilters);
			}

			if (!equals(visParams.pageSizes, pageSizes)) {
				set_pageSizes(visParams.pageSizes);
			}

			if (_go) {
				set_shouldReload(!shouldReload);
			}

		}
		
	}, [visParams]);

	useEffect(() => {
		if (validURI) {
			_fetchMetadata(`Initial load`);
		}
		set_shouldIgnoreFirst(false);
	}, [ ]);

	let dataFragment = (<></>);

	if (data_error === `noErros`) {
		dataFragment = (
			<EuiBasicTable
				noItemsMessage="Não há dados"
				items={pageOfItems}
				columns={(columns || []).map((item: VisParamTblColumn) => {
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
				})}
				sorting={allowSortAndOrder ? {
					sort: {
						field: sortField,
						direction: sortDirection,
					},
					allowNeutralSort: true
				} : undefined}
				pagination={usePagination ? {
					pageIndex,
					pageSize,
					totalItemCount: itemsTotal,
					pageSizeOptions: pageSizes,
					hidePerPageOptions: false,
				} : undefined}
				onChange={onTableChange}
			/>
		);
	} else {
		let error;
		if (requestErrors.hasOwnProperty(data_error)) {
			error = (requestErrors as any)[data_error];
		} else {
			error = {
				title: `Opss...`,
				message: `Desculpe, ocorreu um erro desconhecido.`
			};
		}
		dataFragment = (
			<EuiFlexGroup alignItems="center" justifyContent="center">
				<EuiFlexItem grow={false}>
					<EuiEmptyPrompt
						iconType="dataVisualizer"
						title={
							<EuiTitle size="s">
								<h4>{error.title}</h4>
							</EuiTitle>
						}
						titleSize="xs"
						body={
							<Fragment>
								<p>{error.message}</p>
							</Fragment>
						}
					/>
				</EuiFlexItem>
			</EuiFlexGroup>
		);
	}

	let mainFragment = (<></>);

	if (isLoading) {
		mainFragment = (
			<EuiFlexGroup alignItems="center" justifyContent="center">
				<EuiFlexItem grow={false}>
					<EuiLoadingSpinner
						size="xl"
					/>
				</EuiFlexItem>
			</EuiFlexGroup>
		);
	} else {
		if (validURI) {
			mainFragment = (
				<>{dataFragment}</>
			);
		} else {
			mainFragment = (
				<EuiFlexGroup alignItems="center" justifyContent="center">
					<EuiFlexItem grow={false}>
						<EuiText color="subdued">A URL informada não é uma URL válida!</EuiText>
					</EuiFlexItem>
				</EuiFlexGroup>
			);
		}
	}

	return (
		<Fragment>
			{mainFragment}
		</Fragment>
	);
}
