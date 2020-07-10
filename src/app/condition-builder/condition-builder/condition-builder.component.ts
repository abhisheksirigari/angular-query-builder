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
      { field: 'age', subtype: 'age',  operator: '<=', entity: 'physical' },
      { field: 'birthday', operator: '=', value: '', entity: 'nonphysical' }      
    ]
  };

  queryArray = Object.keys(this.query).map(q => this.query[q]);

  public config: QueryBuilderConfig = {
    fields: {
      age: {name: 'Age', type: 'number'},
      gender: {
        name: 'Gender',
        type: 'category',
        options: [
          {name: 'Male', value: 'm'},
          {name: 'Female', value: 'f'}
        ]
      },
      name: {name: 'Name', type: 'string'},
      notes: {name: 'Notes', type: 'textarea', operators: ['=', '!=']},
      educated: {name: 'College Degree?', type: 'boolean'},
      birthday: {name: 'Birthday', type: 'date', operators: ['=', '<=', '>']        
      },
      school: {name: 'School', type: 'string', nullable: true},
      occupation: {
        name: 'Occupation',
        type: 'category',
        options: [
          {name: 'Student', value: 'student'},
          {name: 'Teacher', value: 'teacher'},
          {name: 'Unemployed', value: 'unemployed'},
          {name: 'Scientist', value: 'scientist'}
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
