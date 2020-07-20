import { Component, OnInit } from '@angular/core';
import { QueryBuilderConfig, QueryBuilderClassNames } from 'angular2-query-builder';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-condition-builder',
  templateUrl: './condition-builder.component.html',
  styleUrls: ['./condition-builder.component.scss']
})
export class ConditionBuilderComponent implements OnInit {
  public onClose: Subject<any>;
  logicalexpression: any;
  public query = {};
  modalData: any;

  objectKeys = Object.keys;
  public queryCtrl: FormControl;
  public currentConfig: QueryBuilderConfig;
  public allowRuleset: boolean = true;
  public allowCollapse: boolean = true;
  isexitcode = false;
  errorMsg = '';

  queryArray = Object.keys(this.query).map(q => this.query[q]);

  public config: QueryBuilderConfig = {
    fields: {
      none: {
        name: 'None',
        type: 'category',
        operators: ['', 'Done', 'Exit code', 'Failure', 'Not running', 'Success', 'Terminated'],
        options: [
          { name: 'sample_oprA', value: 'sample_oprA' },
          { name: 'sample_oprB', value: 'sample_oprB' }
        ]
      },
      lookback: {
        name: 'Look-back',
        type: 'category',
        operators: ['', 'Done', 'Exit code', 'Failure', 'Not running', 'Success', 'Terminated'],
        options: [
          { name: 'sample_oprA', value: 'sample_oprA' },
          { name: 'sample_oprB', value: 'sample_oprB' }
        ]
      }
    }
  };

  constructor(
    private formBuilder: FormBuilder,
    private _bsModalRef: BsModalRef
  ) {
    this.queryCtrl = this.formBuilder.control(this.query);
  }

  ngOnInit() {
    this.onClose = new Subject();
    this.query = this.modalData;
    this.query['output'] = '';
    this.logicalexpression = JSON.stringify(this.query);
  }

  checkValid() {
    this.queryCtrl.updateValueAndValidity();
  }

  onConfirm() {
    let root = document.getElementById('logicalexp');
    let iter = document.createNodeIterator(root, NodeFilter.SHOW_TEXT);
    let textnode: any;

    // print all text nodes
    while (textnode = iter.nextNode()) {
      console.log(textnode.textContent);
      this.query['output'] += textnode.textContent;
    }

    this.onClose.next(this.query);
    this._bsModalRef.hide();
  }

  onCancel() {
    this.onClose.next(false);
    this._bsModalRef.hide();
  }

  onItemChange(query: any) {
    query.isCollapsed = !query.isCollapsed;
    console.log(query);
  }

  onQueryChanged(e: any, rule: any, field: any) {
    console.log(e, rule);
    rule.isexitcode = (rule.operator === 'Exit code') ? true : false;
    if ((field == 'subtype' || field == 'status') && (rule.operator == 'Done' || rule.operator == 'Not running' || rule.operator == 'Success' || rule.operator == 'Terminated')) {
      if (rule.fields) {
        rule.fields.length = 0;
      }
    }
    if (field == 'subtype' && rule.operator == 'Failure') {
      if (rule.fields) {
        rule.fields.length = 0;
      }
    }
    if (field == 'subtype' && rule.field == 'none') {
      if (rule.fields) {
        rule.fields.length = 0;
      }
    }
    if (rule.field == 'lookback' && (field == 'subtype' || field == 'status')) {
      rule.isfields = true;

      if (rule.isfields && (rule.operator == '' || rule.operator == 'Failure' || rule.operator == 'Exit code') ) {
        rule.fields = [
          {
            name: 'Look back',
            field: 'lookback',
            type: 'number',
            value: '',
            min: 0,
            max: 9999,
            error: 'Look back hhhh not in range. should be 0-9999',
            validator: (rule: any) => {
              const isNumber = /^[0-9]*$/.test(rule.value);
              if (!isNumber) {
                return {
                  number: {
                    rule: rule,
                    message: 'Look back hhhh must be a number!'
                  }
                }
              } else {
                const hhhh = +rule.value;
                if (hhhh < 1) {
                  return {
                    min: {
                      rule: rule,
                      message: 'Look back hhhh must be > 0'
                    }
                  }
                } else if (hhhh > 9999) {
                  return {
                    max: {
                      rule: rule,
                      message: 'Look back hhhh must be < 9999'
                    }
                  }
                }
              }
              return null;
            }
          },
          {
            name: '',
            field: 'lookbackmm',
            type: 'number',
            value: '',
            min: 0,
            max: 59,
            error: 'Look back mm not in range. should be 0-59',
            validator: (rule) => {
              const isNumber = /^[0-9]*$/.test(rule.value);
              if (!isNumber) {
                return {
                  number: {
                    rule: rule,
                    message: 'Look back mm must be a number!'
                  }
                }
              } else {
                const mm = +rule.value;
                if (mm < 0) {
                  return {
                    min: {
                      rule: rule,
                      message: 'Look back mm must be > 0'
                    }
                  }
                } else if (mm > 59) {
                  return {
                    max: {
                      rule: rule,
                      message: 'Look back mm must be < 59'
                    }
                  }
                }
              }
              return null;
            }
          }
        ];
      }

      if (rule.isfields && rule.operator == 'Exit code' && rule.operator != 'Failure') {
        if (rule.fields.length == 0 || rule.fields.length < 3 ) {
          rule.fields.unshift(
            {
              name: 'Operator',
              field: 'operator',
              type: 'category',
              operators: ['=', '<=', '>', '>='],
              value: ''
            },
            {
              name: 'Value',
              field: 'value',
              type: 'string',
              value: '',
              min: 0,
              max: 6,
              validator: (rule) => {
                const isNumber = /^[0-9]*$/.test(rule.value);
                if (!isNumber) {
                  return {
                    number: {
                      rule: rule,
                      message: 'Look back value must be a number!'
                    }
                  }
                } else {
                  const age = +rule.value;
                  if (age < 1) {
                    return {
                      min: {
                        rule: rule,
                        message: 'Look back value must be > 1'
                      }
                    }
                  } else if (age > 9999) {
                    return {
                      max: {
                        rule: rule,
                        message: 'Look back value must be < 100'
                      }
                    }
                  }
                }
                return null;
              }
            }
          );
        }
      }
    } else {
      rule.isfields = false;
    }


    // const control = this.parentFormGroup.controls['triggerQuery'];
    // if (rule.field && rule.operator && rule.value) {
    //   control.setErrors(null);
    // }
    // // else make for invalid with required flag
    // else {
    //   control.setErrors({ 'required': true });
    // }
  }

  validateRule(event: any, rule: any) {
    if (rule.value < rule.min || rule.value > rule.max) {
      this.errorMsg = rule.error;
    } else {
      this.errorMsg = '';
    }
  }

  addNewRule(query: any) {
    console.log(this.config);
    query.rules.push(
      { subtype: '', field: '', operator: '', value: '', fields: [] }
    );
  }

  removeRuleSet() {

  }

}
