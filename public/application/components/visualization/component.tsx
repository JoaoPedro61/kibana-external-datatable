/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

//  import './styles.less';

import React, { Fragment, useState, useEffect } from 'react';
import {
	EuiBasicTable,
	EuiLoadingSpinner,
	EuiFlexGroup,
	EuiFlexItem,
	EuiText,
	EuiEmptyPrompt,
	EuiTitle,
	EuiInMemoryTable
} from '@elastic/eui';
import { take } from 'rxjs/operators';

import { getDataService } from '../../../services';


import {
	requestErrors,
	get as letItGo,
	equals,
	isValid,
	addQueryParams,
	merge,
	mergeWithExcludes
} from '../../../../common';



export function Component({ visData, visParams }: any) {

	const [currentVisData, set_currentVisData] = useState(visData);

	const [timer, set_timer] = useState(null);

	const [shouldIgnoreFirst, set_shouldIgnoreFirst] = useState(true);

	const [isLoading, set_isLoading] = useState(isValid(visParams.uriTarget));

	const [validURI, set_validURI] = useState(isValid(visParams.uriTarget));

	const [data_error, set_data_error] = useState(`noErros`);

	const [shouldReload, set_shouldReload] = useState(false);

	const [pageIndex, set_pageIndex] = useState(visParams.pageIndex);

	const [pageSize, set_pageSize] = useState(visParams.pageSize);

	const [pageSizes, set_pageSizes] = useState(visParams.pageSizes);

	const [uriTarget, set_uriTarget] = useState(visParams.uriTarget);

	const [usePagination, set_usePagination] = useState(visParams.usePagination);

	const [staticPagination, set_staticPagination] = useState(visParams.staticPagination);

	const [useColorize, set_useColorize] = useState(visParams.useColorize);

	const [allowSortAndOrder, set_allowSortAndOrder] = useState(visParams.allowSortAndOrder);

	const [columns, set_columns] = useState(visParams.columns);

	const [sendKeySortDirection, set_sendKeySortDirection] = useState(visParams.sendKeySortDirection);

	const [sendKeySortField, set_sendKeySortField] = useState(visParams.sendKeySortField);

	const [sendKeyOffset, set_sendKeyOffset] = useState(visParams.sendKeyOffset);

	const [sendKeyPageSize, set_sendKeyPageSize] = useState(visParams.sendKeyPageSize);

	const [sortField, set_sortField] = useState(visParams.sortField);

	const [sortDirection, set_sortDirection] = useState(visParams.sortDirection);

	const [itemsTotal, set_itemsTotal] = useState(0);

	const [pageOfItems, set_pageOfItems] = useState([]);

	const [unpaginatedItems, set_unpaginatedItems] = useState([]);

	function _fetchMetadata(force: boolean = false) {
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
					if (force || (!pageOfItems || !pageOfItems.length)) {
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
						const superData = getDataService();
						queryString = merge({}, { ...queryString });
						const uri = addQueryParams(visParams.uriTarget, {
							...queryString,
							...visData,
							timeRange: superData.query.timefilter.timefilter.getTime(),
							filters: JSON.parse(JSON.stringify([...(superData.query.filterManager.getFilters() || [])])) }, [ ]);
						letItGo(uri)
							.pipe(take(1))
							.subscribe((response) => {
								if (!Array.isArray(response) && response.hasOwnProperty('data')) {
									set_data_error(`noErros`);
									set_unpaginatedItems(response.data);
									if (staticPagination) {
										set_itemsTotal(response.data.length);
										const items: any[] = [];
										let offset: number = pageIndex * pageSize;
										let lim: number = offset + pageSize;
										for (; offset < lim; offset++) {
											if (response.data[offset]) {
												items.push(response.data[offset]);
											}
										}
										set_pageOfItems(items);
									} else {
										if (response.hasOwnProperty('total')) {
											set_itemsTotal(response.total);
										} else {
											set_itemsTotal(response.data.length);
										}
										set_pageOfItems(response.data);
									}
								} else if (Array.isArray(response)) {
									set_data_error(`noErros`);
									set_unpaginatedItems(response as any);
									if (staticPagination) {
										set_itemsTotal(response.length);
										const items: any[] = [];
										let offset: number = pageIndex * pageSize;
										let lim: number = offset + pageSize;
										for (; offset < lim; offset++) {
											if (response[offset]) {
												items.push(response[offset]);
											}
										}
										set_pageOfItems(items);
									} else {
										set_pageOfItems(response as any);
										set_itemsTotal(response.length);
									}
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
					} else {
						if (staticPagination) {
							set_itemsTotal(unpaginatedItems.length);
							const items: any[] = [];
							let offset: number = pageIndex * pageSize;
							let lim: number = offset + pageSize;
							for (; offset < lim; offset++) {
								if (unpaginatedItems[offset]) {
									items.push(unpaginatedItems[offset]);
								}
							}
							set_pageOfItems(items);
						}
						set_isLoading(false);
					}
				}
				set_timer(null);
			}, 300);
			set_timer(_timer);
		}
	}

	function onTableChange({ page = {}, sort = {} }): void {
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
				_fetchMetadata(false);
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
					_fetchMetadata(true);
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

			if (!equals(visParams.pageSizes, pageSizes)) {
				set_pageSizes(visParams.pageSizes);
			}

			if (!equals(visParams.staticPagination, staticPagination)) {
				_go = true;
				set_staticPagination(visParams.staticPagination);
			}

			if (!equals(visParams.useColorize, useColorize)) {
				set_useColorize(visParams.useColorize);
			}

			if (_go) {
				set_shouldReload(!shouldReload);
			}

		}

	}, [visParams]);

	useEffect(() => {
		if (validURI) {
			_fetchMetadata(false);
		}
		set_shouldIgnoreFirst(false);
	}, []);

	let dataFragment = (<></>);

	if (data_error === `noErros`) {
		if (staticPagination) {
			dataFragment = (
				<EuiInMemoryTable
					items={unpaginatedItems}
					columns={(columns || []).map((item: any) => {
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
					} : undefined}
					pagination={usePagination ? {
						initialPageIndex: pageIndex,
						initialPageSize: pageSize,
						pageSizeOptions: pageSizes,
						hidePerPageOptions: false,
					} : undefined}
					onChange={onTableChange}
				/>
			);
		} else {
			dataFragment = (
				<EuiBasicTable
					noItemsMessage="Não há dados"
					items={pageOfItems}
					columns={(columns || []).map((item: any) => {
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
		}
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
