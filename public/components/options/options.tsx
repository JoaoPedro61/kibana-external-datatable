import React, { Fragment, useState } from 'react';

import {
  EuiPanel,
  EuiButton,
  EuiFormLabel,
  EuiFieldText,
  EuiForm,
  EuiFormRow,
  EuiSpacer,
  EuiSwitch,
  EuiText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiButtonEmpty,
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutHeader,
  EuiTitle,
  EuiCodeBlock,
  EuiLoadingSpinner,
  EuiEmptyPrompt,
  EuiAccordion,
  EuiButtonIcon,
  EuiFormControlLayoutDelimited,
  EuiCodeEditor
} from '@elastic/eui';

import { requestErrors } from '../../requests-error';
import { get } from './../../api';
import { take } from 'rxjs/operators';



export function OptionsComponent({ setValue, setValidity, stateParams }) {


  const { columns, uriTarget, showHeader, allowSortAndOrder, usePagination, defaultFilters } = stateParams;

  let _localUnparsed = JSON.stringify(defaultFilters, null, 2);

  const [ isUriTargetValid, setValidityUriTarget ] = useState<boolean>(true);

  const [ isVisibleResponse, setVisibleResponse] = useState<boolean>(false);

  const [ isLoadingResponse, setLoadingResponse] = useState<boolean>(true);

  const [ responsePreview, setResponsePreview] = useState<any>({});

  const [ responsePreviewError, setResponsePreviewError ] = useState<string>('noErros');

  function _setValue(target: string, value: any): void {
    setValue(target, value);
  }

  function _checkValidity(target: string, value: any, invalidStateChanger?: (value: any) => void): boolean {
    let valid = true;
    _setValue(target, value);
    if (target === 'uriTarget') {
      if (value && (`string` === typeof value && value.length)) {
        value = value.trim();
        if (!/^http\:\/\/|^https\:\/\//gm.test(value)) {
          valid = false;
        } else {
          if (value === `http://` || value === `https://`) {
            valid = false;
          }
        }
      }
      if (valid) {
        if (isVisibleResponse) {
          _loadResponse();
        }
      } else {
        if (isVisibleResponse) {
          setVisibleResponse(false);
        }
      }
    } else if (target === 'columns') {
      if (!Array.isArray(value)) {
        valid = false;
      } else if (!value.length) {
        valid = false;
      }
    } else {
      setVisibleResponse(false);
    }
    if (invalidStateChanger) {
      invalidStateChanger(valid);
    }
    return valid;
  }

  function _seeResponse() {
    if (!isVisibleResponse) {
      setVisibleResponse(true);
    }
  }

  function _loadResponse() {
    setLoadingResponse(true);
    setResponsePreviewError('noErros');
    setResponsePreview({});
    const queryString: Partial<any> = {
      ...defaultFilters
    };
    if (usePagination) {
      queryString.limit = stateParams.pageSize;
      queryString.offset = 0;
    }
    get(stateParams.uriTarget, queryString)
      .pipe(take(1))
      .subscribe((response) => {
        setResponsePreviewError('noErros');
        setResponsePreview(response);
        setLoadingResponse(false);
      }, (e) => {
        setResponsePreviewError(e.statusName);
        setResponsePreview({});
        setLoadingResponse(false);
      });
  }

  function _seeResponseDOM() {
    let layout;
    if (isVisibleResponse) {
      let preview;
      if (isLoadingResponse) {
        preview = (
          <EuiFlexGroup alignItems="center" justifyContent="center" direction="row">
            <EuiFlexItem grow={false}>
              <EuiSpacer size="xxl"/>
              <EuiLoadingSpinner size="xl" />
            </EuiFlexItem>
          </EuiFlexGroup>
        );
      } else {
        if (responsePreviewError === 'noErros') {
          preview = (
            <EuiCodeBlock language="json">{JSON.stringify(responsePreview, null, 2)}</EuiCodeBlock>
          );
        } else {
          let error;
          if (requestErrors.hasOwnProperty(responsePreviewError)) {
            error = (requestErrors as any)[responsePreviewError];
          } else {
            error = {
              title: `Opss...`,
              message: `Sorry, an unknown error occurred.`
            };
          }
          preview = (
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
          );
        }
      }
      layout = (
        <EuiFlyout onClose={() => setVisibleResponse(false)} aria-labelledby="responseTitle">
          <EuiFlyoutHeader>
            <EuiTitle size="s">
              <h3 id="responseTitle">
                Preview response
              </h3>
            </EuiTitle>
          </EuiFlyoutHeader>
          <EuiFlyoutBody>
            <p>A simple preview from: <i>{stateParams.uriTarget}</i></p>
            <EuiSpacer size="m"/>
            {preview}
          </EuiFlyoutBody>
        </EuiFlyout>
      );
    }
    return layout;
  }

  function _addColumn(): void {
    let _columns: any[] = [];
    if (Array.isArray(columns)) {
      _columns = [...columns];
    }
    _columns.push({
      target: 'response_prop',
      label: 'Header Label',
      key: '_' + Math.random().toString(36).substr(2, 9),
      validColumnTarget: true,
      validColumnLabel: true
    });
    _checkValidity('columns', _columns);
  }

  function _removeColumn(item: any, index: number): void {
    let _columns = columns || [];
    if (_columns.length) {
      if (_columns[index]) {
        let _n_columns = columns.splice(index, 1);
        _checkValidity('columns', _n_columns);
      }
    }
  }

  function _updateColumn(item: any, index: number, target: string, value: any): void {
    if (columns) {
      if (item) {
        if (columns[index]) {
          columns[index][target] = value;
          if (target === 'target') {
            if (`string` !== typeof value) {
              columns[index].validColumnTarget = false;
            } else if (!value.length) {
              columns[index].validColumnTarget = false;
            } else {
              columns[index].validColumnTarget = true;
            }
          }
          _checkValidity('columns', columns);
        }
      }
    }
  }

  function _columns() {
    const { columns } = stateParams;
    const length = (columns || []).length;
    let groups: any = [];
    groups = (columns || []).map((item: any, index: number) => {
      let buttonFrag = (<></>);
      if (length > 1) {
        buttonFrag = (
          <EuiFlexItem grow={false}>
            <EuiButtonIcon
              iconType="trash"
              color="danger"
              onClick={() => _removeColumn(item, index)}
              aria-label="Remove this column"
            />
            <div style={{height: '4px'}}></div>
          </EuiFlexItem>
        );
      }

      const designed = (
        <Fragment key={item.key}>
          <EuiFlexGroup alignItems="flexEnd" justifyContent="spaceBetween" gutterSize="s">
            <EuiFlexItem>
              <EuiSpacer size="s" />
              <EuiFormLabel>Key / Label</EuiFormLabel>
              <EuiFormControlLayoutDelimited
                compressed={true}
                startControl={
                  <input
                    type="text"
                    className="euiFieldText"
                    name="target"
                    value={item.target}
                    placeholder="your_prop"
                    onChange={e => _updateColumn(item, index, 'target', e.target.value)}
                  />
                }
                endControl={
                  <input
                    type="text"
                    className="euiFieldText"
                    name="label"
                    value={item.label}
                    placeholder="Header label"
                    onChange={e => _updateColumn(item, index, 'label', e.target.value)}
                  />
                }
              />
            </EuiFlexItem>
            {buttonFrag}
          </EuiFlexGroup>
        </Fragment>
      );

      return designed;
    });
    let layout = (
      <EuiForm>
        {groups}
        <EuiSpacer size="m" />
        <EuiFlexGroup gutterSize="none" alignItems="center" justifyContent="center">
          <EuiFlexItem>
            <EuiButton size="s" fullWidth={true} onClick={() => _addColumn()}>
              <EuiText>Add column</EuiText>
            </EuiButton>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiForm>
    );
    return layout;
  }

  function _updateDefaultFilters(value: string): void {
    _localUnparsed = value;
    setVisibleResponse(false);
  }

  function _tryParseDefaultFilters(): void {
    if (_localUnparsed === '') {
      _setValue('defaultFilters', {});
    } else {
      try {
        const parsed = JSON.parse(_localUnparsed);
      _setValue('defaultFilters', parsed);
      } catch (e) {}
    }
  }

  return (
		<Fragment>
      <EuiPanel paddingSize="s">
        <EuiForm>
          <EuiFormRow
            label="URL Target"
            helpText={`This field must start with "http://" or "https://".`}
            fullWidth={true}
            isInvalid={!isUriTargetValid}
            display="rowCompressed">
            
            <EuiFieldText
              name="uriTarget"
              isInvalid={!isUriTargetValid}
              compressed={true}
              value={uriTarget}
              placeholder="https://example.com"
              onChange={e => _checkValidity('uriTarget', e.target.value, setValidityUriTarget)}
            />
          </EuiFormRow>
          <EuiSpacer size="s" />
          <EuiFlexGroup gutterSize="s" alignItems="center" justifyContent="flexEnd">
            <EuiFlexItem  grow={false}>
              <EuiButtonEmpty onClick={() => { _loadResponse(); _seeResponse() }} size="s">
                See response
              </EuiButtonEmpty>
            </EuiFlexItem>
          </EuiFlexGroup>
          <EuiSpacer size="s" />
          <EuiFormRow
            fullWidth={true}
            display="rowCompressed">
            <EuiSwitch
              label="Show header"
              checked={showHeader}
              name="showHeader"
              compressed={true}
              onChange={e => _checkValidity('showHeader', e.target.checked)}
            />
          </EuiFormRow>
          <EuiSpacer size="m" />
          <EuiFormRow
            fullWidth={true}
            display="rowCompressed">
            <EuiSwitch
              label="Allow sort"
              checked={allowSortAndOrder}
              name="allowSortAndOrder"
              compressed={true}
              onChange={e => _checkValidity('allowSortAndOrder', e.target.checked)}
            />
          </EuiFormRow>
          <EuiSpacer size="m" />
          <EuiFormRow
            fullWidth={true}
            display="rowCompressed">
            <EuiSwitch
              label="Use pagination"
              checked={usePagination}
              name="usePagination"
              compressed={true}
              onChange={e => _checkValidity('usePagination', e.target.checked)}
            />
          </EuiFormRow>
          <EuiSpacer size="m" />
          <EuiAccordion id="columns" buttonContent="Columns">
            {_columns()}
          </EuiAccordion>
          <EuiSpacer size="m" />
          <EuiFormLabel>Default filters</EuiFormLabel>
          <EuiCodeEditor 
            mode="json"
            theme="github"
            width="100%"
            value={JSON.stringify(defaultFilters, null, 2)}
            onChange={_updateDefaultFilters}
            setOptions={{
              fontSize: '14px',
              enableBasicAutocompletion: true,
              enableSnippets: true,
              enableLiveAutocompletion: true,
              tabSize: 2

            }}
            onBlur={(e) => {
              _tryParseDefaultFilters();
            }}
            aria-label="Code Editor"
          />
        </EuiForm>
      </EuiPanel>
      {_seeResponseDOM()}
		</Fragment>
	);
}
