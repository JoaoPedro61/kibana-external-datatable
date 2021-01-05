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
  EuiCodeEditor,
  EuiSelect
} from '@elastic/eui';

import { requestErrors } from '../../requests-error';
import { get } from './../../api';
import { take } from 'rxjs/operators';
import { equals } from '../../equals';
import { isValid } from '../../valid-url';



export function OptionsComponent({ setValue, setValidity, stateParams }) {

  const {
    columns,
    uriTarget,
    allowSortAndOrder,
    usePagination,
    defaultFilters,
    sendKeySortDirection,
    sendKeySortField,
    sendKeyOffset,
    sendKeyPageSize,
  } = stateParams;

  let _localUnparsed = JSON.stringify(defaultFilters, null, 2);

  const [ isUriTargetValid, setValidityUriTarget ] = useState<boolean>(isValid(stateParams.uriTarget));

  const [ isSendKeySortDirValid, setValiditySendKeySortDir ] = useState<boolean>(true);

  const [ isSendKeySortFieldValid, setValiditySendKeySortField ] = useState<boolean>(true);

  const [ isSendKeyOffsetValid, setValiditySendKeyOffset ] = useState<boolean>(true);

  const [ isSendKeyPageSizeValid, setValiditySendKeyPageSize ] = useState<boolean>(true);

  const [ isVisibleResponse, setVisibleResponse ] = useState<boolean>(false);

  const [ isLoadingResponse, setLoadingResponse ] = useState<boolean>(true);

  const [ responsePreview, setResponsePreview ] = useState<any>({});

  const [ responsePreviewError, setResponsePreviewError ] = useState<string>('noErros');

  if (!stateParams.hasOwnProperty(`counter`)) {
    stateParams.counter = 1;
    setValue(`counter`, 1);
  } else {
    if (stateParams.counter > 1000) {
      setValue(`counter`, 1);
    }
  }

  function _setValue(target: string, value: any): void {
    setValue(target, value);
    setValue(`counter`, stateParams.counter++);
  }

  function _checkValidity(target: string, value: any, invalidStateChanger?: (value: any) => void): boolean {
    let valid = true;
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
      } else {
        valid = false;
      }
    } else if (target === 'columns') {
      if (!Array.isArray(value)) {
        valid = false;
      } else if (!value.length) {
        valid = false;
      }
    } else if (target === 'sendKeySortDirection') {
      if (value && (`string` === typeof value && value.length)) {
        value = value.trim();
      } else {
        valid = false;
      }
    } else if (target === 'sendKeySortField') {
      if (value && (`string` === typeof value && value.length)) {
        value = value.trim();
      } else {
        valid = false;
      }
    } else if (target === 'sendKeyOffset') {
      if (value && (`string` === typeof value && value.length)) {
        value = value.trim();
      } else {
        valid = false;
      }
    } else if (target === 'sendKeyPageSize') {
      if (value && (`string` === typeof value && value.length)) {
        value = value.trim();
      } else {
        valid = false;
      }
    } else {
      setVisibleResponse(false);
    }
    if (invalidStateChanger) {
      invalidStateChanger(valid);
    }
    _setValue(target, value);
    if (target === 'uriTarget') { 
      if (valid) {
        if (isVisibleResponse) {
          _loadResponse();
        }
      } else {
        if (isVisibleResponse) {
          setVisibleResponse(false);
        }
      }
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
      target: 'change_me',
      label: 'Change Me',
      key: '_' + Math.random().toString(36).substr(2, 9),
      validColumnTarget: true,
      validColumnLabel: true,
      sortable: true,
      hideOnMobile: false,
      truncateText: true,
      alignment: 'left',
    });
    _checkValidity('columns', _columns);
  }

  function _removeColumn(item: any, index: number): void {
    const _columns = [...columns];
    if (_columns.length) {
      if (_columns[index]) {
        _columns.splice(index, 1);
        _checkValidity('columns', _columns);
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
          _checkValidity('columns', [...columns]);
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
          <EuiPanel paddingSize="s">
            <EuiFlexGroup alignItems="flexEnd" justifyContent="spaceBetween" gutterSize="s">
              <EuiFlexItem>
                <EuiSpacer size="s" />
                <EuiFormLabel>Key / Label</EuiFormLabel>
                <EuiFormControlLayoutDelimited
                  compressed={true}
                  fullWidth
                  startControl={
                    <input
                      type="text"
                      className="euiFieldText"
                      name="target"
                      defaultValue={item.target}
                      placeholder="your_prop"
                      onBlur={e => _updateColumn(item, index, 'target', e.target.value)}
                    />
                  }
                  endControl={
                    <input
                      type="text"
                      className="euiFieldText"
                      name="label"
                      defaultValue={item.label}
                      placeholder="Header label"
                      onBlur={e => _updateColumn(item, index, 'label', e.target.value)}
                    />
                  }
                />
              </EuiFlexItem>
              {buttonFrag}
            </EuiFlexGroup>
            <EuiSpacer size="s" />
            <EuiAccordion id={`mode_options_${index}`} buttonContent={(
                <>
                  <EuiText size="xs">
                    More options
                  </EuiText>
                </>
              )}>
              <EuiSpacer size="s" />
              <EuiFormRow
                fullWidth={true}
                display="rowCompressed">
                <EuiSwitch
                  label="Sortable"
                  checked={!!item.sortable}
                  name="item.sortable"
                  compressed={true}
                  onChange={e => _updateColumn(item, index, 'sortable', e.target.checked)}
                />
              </EuiFormRow>
              <EuiSpacer size="s" />
              <EuiFormRow
                fullWidth={true}
                display="rowCompressed">
                <EuiSwitch
                  label="Ellipsis text"
                  checked={!!item.truncateText}
                  name="item.truncateText"
                  compressed={true}
                  onChange={e => _updateColumn(item, index, 'truncateText', e.target.checked)}
                />
              </EuiFormRow>
              <EuiSpacer size="s" />
              <EuiFormRow
                fullWidth={true}
                display="rowCompressed">
                <EuiSwitch
                  label="Hide on mobile"
                  checked={!!item.hideOnMobile}
                  name="item.hideOnMobile"
                  compressed={true}
                  onChange={e => _updateColumn(item, index, 'hideOnMobile', e.target.checked)}
                />
              </EuiFormRow>
              <EuiSpacer size="s" />
              <EuiFormLabel>Alignment</EuiFormLabel>
              <EuiFormRow
                fullWidth={true}
                display="rowCompressed">
                <EuiSelect
                  fullWidth
                  options={[
                    {
                      value: 'left',
                      text: 'Left',
                    },
                    {
                      value: 'center',
                      text: 'Center',
                    },
                    {
                      value: 'right',
                      text: 'Right',
                    }
                  ]}
                  value={item.alignment}
                  compressed={true}
                  onChange={(e) => _updateColumn(item, index, 'alignment', e.target.value)}
                />
              </EuiFormRow>
            </EuiAccordion>
          </EuiPanel>
          <EuiSpacer size="s" />
        </Fragment>
      );

      return designed;
    });
    let layout = (
      <EuiForm>
        <EuiSpacer size="m" />
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
        if (!equals(parsed, defaultFilters)) {
          _setValue('defaultFilters', parsed);
        }
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
              defaultValue={uriTarget}
              placeholder="https://example.com"
              onBlur={e => _checkValidity('uriTarget', e.target.value, setValidityUriTarget)}
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
          <EuiSpacer size="s" />
          <EuiAccordion id="advanced" buttonContent="Advanced">
            <EuiForm>
              <EuiSpacer size="s" />
              <EuiFormRow
                label="Sort direction"
                helpText={`Ex.: ${uriTarget}?${sendKeySortDirection}=asc`}
                fullWidth={true}
                isInvalid={!isSendKeySortDirValid}
                display="rowCompressed">
                
                <EuiFieldText
                  name="sendKeySortDirection"
                  isInvalid={!isSendKeySortDirValid}
                  compressed={true}
                  defaultValue={sendKeySortDirection}
                  placeholder="_sort"
                  onBlur={e => _checkValidity('sendKeySortDirection', e.target.value, setValiditySendKeySortDir)}
                />
              </EuiFormRow>
              <EuiSpacer size="s" />
              <EuiFormRow
                label="Sort field"
                helpText={`Ex.: ${uriTarget}?${sendKeySortField}=id`}
                fullWidth={true}
                isInvalid={!isSendKeySortFieldValid}
                display="rowCompressed">
                
                <EuiFieldText
                  name="sendKeySortField"
                  isInvalid={!isSendKeySortFieldValid}
                  compressed={true}
                  defaultValue={sendKeySortField}
                  placeholder="_order"
                  onBlur={e => _checkValidity('sendKeySortField', e.target.value, setValiditySendKeySortField)}
                />
              </EuiFormRow>
              <EuiSpacer size="s" />
              <EuiFormRow
                label="Page size (limit)"
                helpText={`Ex.: ${uriTarget}?${sendKeyPageSize}=15`}
                fullWidth={true}
                isInvalid={!isSendKeyPageSizeValid}
                display="rowCompressed">
                
                <EuiFieldText
                  name="sendKeyPageSize"
                  isInvalid={!isSendKeyPageSizeValid}
                  compressed={true}
                  defaultValue={sendKeyPageSize}
                  placeholder="_limit"
                  onBlur={e => _checkValidity('sendKeyPageSize', e.target.value, setValiditySendKeyPageSize)}
                />
              </EuiFormRow>
              <EuiSpacer size="s" />
              <EuiFormRow
                label="Offset"
                helpText={`Ex.: ${uriTarget}?${sendKeyOffset}=15`}
                fullWidth={true}
                isInvalid={!isSendKeyOffsetValid}
                display="rowCompressed">
                
                <EuiFieldText
                  name="sendKeyOffset"
                  isInvalid={!isSendKeyOffsetValid}
                  compressed={true}
                  defaultValue={sendKeyOffset}
                  placeholder="_offset"
                  onBlur={e => _checkValidity('sendKeyOffset', e.target.value, setValiditySendKeyOffset)}
                />
              </EuiFormRow>
            </EuiForm>
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
