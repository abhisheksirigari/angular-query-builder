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

  public query = {
    condition: 'and',
    rules: [
      { field: "statusdependency", subtype: "none", operator: "success", value: "sample_oprA" },
      { field: "statusdependency", subtype: "none", operator: "failure", value: "sample_oprB" }
    ]
  };

  queryArray = Object.keys(this.query).map(q => this.query[q]);

  public config: QueryBuilderConfig = {
    fields: {
      statusdependency: {
        name: 'Status dependency',
        type: 'category',
        operators: ['success', 'failure', 'exitcode'],
        options: [
          {name: 'sample_oprA', value: 'sample_oprA'},
          {name: 'sample_oprB', value: 'sample_oprB'}
        ]
      },
      exitcodedependency: {
        name: 'Exit code dependency',
        type: 'category',
        operators: ['success', 'failure', 'exitcode'],
        options: [
          {name: 'sample_oprA', value: 'sample_oprA'},
          {name: 'sample_oprB', value: 'sample_oprB'}
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

  onQueryChanged(e: any, rule: any): void {
    console.log(e, rule);
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
