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
    this.logicalexpression = JSON.stringify(this.query);
  }

  checkValid() {
    this.queryCtrl.updateValueAndValidity();
  }

  onConfirm() {
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
    if ((field == 'subtype' || field == 'status') && (rule.operator == 'Done' || rule.operator == 'Not running' || rule.operator == 'Success' || rule.operator == 'Terminated') ) {
      if (rule.fields) {
        rule.fields.length = 0;
      }
    }
    if (field == 'subtype' && rule.operator == 'Failure' ) {
      if (rule.fields) {
        rule.fields.length = 0;
      }
    }    
    if (rule.field == 'lookback' && (field == 'subtype' || field == 'status') ) {
      rule.isAddFields = true;

      if (rule.isAddFields && (rule.operator == '' || rule.operator == 'Failure')) {
        rule.fields = [
          {
            name: 'Look back',
            field: 'lookback',
            type: 'number',
            value: ''
          },
          {
            name: '',
            field: 'lookbackmm',
            type: 'number',
            value: ''
          }
        ];
      }      
      
      if (rule.isAddFields && rule.operator == 'Exit code') {
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
            value: ''
          }
        );        
      }
    } else {
      rule.isAddFields = false;
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

  addNewRule(query: any) {
    console.log(this.config);    
    query.rules.push(
      { subtype: 'statusdependency', field: 'none', operator: 'Success', value: 'sample_oprA', fields: [] }
    );
  }

  removeRuleSet() {

  }

}
