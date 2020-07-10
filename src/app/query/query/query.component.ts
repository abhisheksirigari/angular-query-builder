import { Component, OnInit, Input, Injectable } from '@angular/core';

export interface Query {
  condition: string;
  rules: ({} | Query)[];
}

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.scss']
})
export class QueryComponent implements OnInit {
  @Input() query: Query;
  objectKeys = Object.keys;

  constructor() { }

  ngOnInit() {
  }

}
