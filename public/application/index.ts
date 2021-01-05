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


import { VisComponent } from './components/visualization';
import { OptionsComponent } from './components/options';

import { Schemas } from '../../../../src/plugins/vis_default_editor/public';
import { ExpressionsStart } from '../../../../src/plugins/expressions/public';
import { VisualizationsSetup } from '../../../../src/plugins/visualizations/public';
import { DataPublicPluginStart, AggGroupNames } from '../../../../src/plugins/data/public';




export interface KbnBstTblPluginVisualizationDeps {
  [x: string]: any;
  expressions: ExpressionsStart;
  data: DataPublicPluginStart;
  visualizations: VisualizationsSetup;
}

export const DEFAULT_VIS_CONFIG = {
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

  useColorize: false,
  usePagination: false,
  staticPagination: false,

  allowSortAndOrder: false,

  pageSizes: [10, 15, 20, 30, 50, 100],
  
  sortDirection: 'asc',
  sortField: 'id',
  pageSize: 30,
  pageIndex: 0,

  sendKeySortDirection: 'sort',
  sendKeySortField: 'order',
  sendKeyOffset: 'offset',
  sendKeyPageSize: 'limit',
  hierarchicalData: true,
};


export function renderVis(id: string, name: string, deps: KbnBstTblPluginVisualizationDeps): void {
  const _fac = () => ({
    name,
    type: 'render',
    inputTypes: ['kibana_datatable'],
    help: "Brisanet Datatable",
    args: {
      visData: { },
      visConfig: {
        types: [],
        help: "",
        default: `${JSON.stringify(DEFAULT_VIS_CONFIG)}`,
      },
    },
    fn(context: any, args: any) {
      const visConfig = args.visConfig && JSON.parse(args.visConfig);
      return {
        type: 'render',
        as: 'visualization',
        value: {
          visData: context,
          visType: name,
          visConfig,
          params: {
            listenOnChange: true,
          },
        },
      };
    },
  });

  const _def = () => ({
    id,
    name,
    type: 'render',
    title: 'Brisanet Data Table',
    icon: 'visTable',
    description: 'Provides a basic API to assemble a table, consuming data from the Brisanet database.',
    visConfig: {
      defaults: { ...DEFAULT_VIS_CONFIG },
      component: VisComponent
    },
    editorConfig: {
      optionsTemplate: OptionsComponent,
      schemas: new Schemas([
        {
          group: AggGroupNames.Metrics,
          name: 'metric',
          title: 'Metric',
          aggFilter: ['!geo_centroid', '!geo_bounds'],
          aggSettings: {
            top_hits: {
              allowStrings: true,
            },
          },
          min: 1,
          defaults: [{ type: 'count', schema: 'metric' }],
        },
      ]),
    },
  });

  try {
    (deps.expressions as any).registerFunction(_fac);
  } catch (_) {
    console.log('_', _);
  }

  deps.visualizations.createReactVisualization(_def());
}
