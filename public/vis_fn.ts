import { Render, KibanaDatatable, ExpressionFunction } from './imports';
import { RenderValue } from './type';
import { DEFAULT_VIS_CONFIG } from './defaults';



type Context = KibanaDatatable;

const name = 'tblVis';

interface Arguments { }

type Return = Render<RenderValue<Context>>;

export const createVisFn = (): ExpressionFunction<
  typeof name,
  Context,
  Arguments,
  Return
> => ({
  name,
  type: 'render',
  context: {
    types: ['kibana_datatable'],
  },
  help: 'Some text to help here!',
  args: {},
  fn(context: Context, _args: Arguments) {
    return {
      type: 'render',
      as: 'visualization',
      value: {
        visData: context,
        visType: 'metric',
        visConfig: {...DEFAULT_VIS_CONFIG},
        params: {
          listenOnChange: true,
        },
      },
    };
  },
});
