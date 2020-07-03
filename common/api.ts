import { Observable } from 'rxjs';

export function get<T = any>(url: string, queryString: Partial<any> = {}, options: Partial<any> = {}): Observable<T> {
  return new Observable((subscriber) => {

    let _qr = '';
    const _qrks = Object.keys(queryString);
    if (_qrks.length) {
      _qr += '?';
      for (let key of _qrks) {
         _qr += `${encodeURIComponent(key)}=${encodeURIComponent(queryString[key])}&`;
      }
      _qr = _qr.substring(0, _qr.length - 1);
    }

    var _headers = new Headers();
    _headers.set(`Content-Type`, `json`);

    const _options: RequestInit = {
      method: `GET`,
      headers: _headers,
      cache: 'default',

      credentials: 'same-origin',
      mode: 'cors',
    };

    function _c(response: any) {
      let statusName;
      if (response.status === 401) {
        statusName = 'unauthorized';
      } if (response.status === 404) {
        statusName = 'notFound';
      } else {
        statusName = 'unknown';
      }
      return {
        statusName,
        status: response.status
      };
    }

    if ((window as any).fetch) {
      fetch(`${url}${_qr}`, _options)
        .then((response) => {
          if (!response.ok) {
            subscriber.error(_c(response));
          } else {
            response.json().then((v: any) => {
              subscriber.next(v as T);
            }).catch(() => {
              subscriber.error({
                statusName: 'responseFormatInvalid',
                status: 0
              });
            });
          }
        })
        .catch((e) => {
          subscriber.error(_c(e));
        });
    }
  });
}
