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

  objectKeys = Object.keys;
  public queryCtrl: FormControl;
  public currentConfig: QueryBuilderConfig;
  public allowRuleset: boolean = true;
  public allowCollapse: boolean = true;
  isexitcode = false;
  isAddFields = false;

  public query = {
    condition: 'and',
    rules: [
      { subtype: "statusdependency", field: "none", operator: "success", value: "sample_oprA", fields: [] }
    ]
  };

  queryArray = Object.keys(this.query).map(q => this.query[q]);

  public config: QueryBuilderConfig = {
    fields: {
      none: {
        name: 'None',
        type: 'category',
        operators: ['success', 'failure', 'exitcode', 'notrunning', 'terminated'],
        options: [
          { name: 'sample_oprA', value: 'sample_oprA' },
          { name: 'sample_oprB', value: 'sample_oprB' }
        ]
      },
      lookback: {
        name: 'Lookback',
        type: 'category',
        operators: ['success', 'failure', 'exitcode', 'notrunning', 'terminated'],
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
    this.logicalexpression = JSON.stringify(this.query);
  }

  onConfirm() {
    this.onClose.next(this.query);
    this._bsModalRef.hide();
  }

  onCancel() {
    this.onClose.next(false);
    this._bsModalRef.hide();
  }

  onQueryChanged(e: any, rule: any) {
    console.log(e, rule);
    this.isexitcode = rule.operator === 'exitcode' ? !this.isexitcode : false;
    if (rule.field == 'lookback' && rule.operator == 'failure') {
      this.isAddFields = true;
      rule.fields = [
        {
          name: 'Look back',
          field: 'lookback',
          type: 'number',
          value: '01'
        },
        {
          name: '',
          field: 'lookbackmm',
          type: 'number',
          value: '00'
        }
      ] 
    }
    if (rule.field == 'lookback' && rule.operator == 'exitcode') {
      this.isAddFields = true;
      rule.fields = [
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
          value: '4'
        },
        {
          name: 'Look back',
          field: 'lookback',
          type: 'number',
          value: '20'
        },
        {
          name: '',
          field: 'lookbackmm',
          type: 'number',
          value: '01'
        }
      ] 
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

}
