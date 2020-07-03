import { DeepTypeCheckerTypes, deepTypechecker } from './deep-type-checker';

export const merge=(t: Partial<any>, s: Partial<any>)=>{const o=Object,a=o.assign;for(const k of o.keys(s))s[k]instanceof o&&a(s[k],merge(t[k],s[k]));return a(t||{},s),t}

export const mergeWithExcludes = (target: Partial<any>, source: Partial<any>, skipIfTypeAre: DeepTypeCheckerTypes[] = [], exludeKeys: string[] = []): any => {
  let _source_with_out_keys = {};
  if (exludeKeys.length) {
    for (const key of Object.keys(source)) {
      if (exludeKeys.indexOf(key) === -1) {
        _source_with_out_keys[key] = source[key];
      }
    }
  } else {
    _source_with_out_keys = source;
  }
  let _source = {};
  if (skipIfTypeAre.length) {
    for (const key of Object.keys(_source_with_out_keys)) {
      if (skipIfTypeAre.indexOf(deepTypechecker(_source_with_out_keys[key])) === -1) {
        _source[key] = _source_with_out_keys[key];
      }
    }
  } else {
    _source = _source_with_out_keys;
  }
  for (const key of Object.keys(_source)) {
    if (_source[key] instanceof Object) {
      debugger
      Object.assign(_source[key], mergeWithExcludes(target[key], _source[key], skipIfTypeAre, exludeKeys));
    }
  }
  Object.assign(target || {}, _source);
  return (target as unknown) as any;
};
