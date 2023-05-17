import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-parent',
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.css'],
})
export class ParentComponent implements OnInit {
  usertotal = 4000;
  userData = Array.from({ length: this.usertotal }).map((_, i) =>
    Object.assign({ id: i, name: `User ${i}` })
  );
  genderData = Array.from({ length: 3 }).map((_, i) =>
    Object.assign({ id: i, name: `Gender ${i}` })
  );
  userName = new FormControl();
  gender = new FormControl();

  constructor() {}

  ngOnInit() {}
}
