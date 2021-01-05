export function isValid(target: string): boolean {
  if (`string` !== typeof target) {
    return false;
  } else {
    const value = target.trim();
    if (!value.length) {
      return false;
    } else {
      if (!/^http\:\/\/|^https\:\/\//gm.test(value)) {
        return false;
      } else {
        if (value === `http://` || value === `https://`) {
          return false;
        }
      }
    }
  }
  return true;
}

function formatter(params: Partial<any>): string {
  let querys = [];
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      querys.push(`${encodeURIComponent(key)}=${encodeURIComponent(typeof params[key] === `object` ? JSON.stringify(params[key]) : params[key])}`);
    }
  }
  return querys.join(`&`);
}

export function addQueryParams(url: string, params: Partial<any>, alloweds: string[] = []): string {
  let shouldAddInidicator = true;
  if (/\?/gm.test(url)) {
    shouldAddInidicator = true;
  }
  let justAlloweds: Partial<any> = {};
  if (!alloweds.length) {
    justAlloweds = params;
  } else {
    for (const allowed of alloweds) {
      if (params.hasOwnProperty(allowed)) {
        justAlloweds[allowed] = params[allowed];
      }
    }
  }
  const queryString = formatter(justAlloweds);
  return `${url}${shouldAddInidicator ? `?`: ``}${queryString}`;
}
