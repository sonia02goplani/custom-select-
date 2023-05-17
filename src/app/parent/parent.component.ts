import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-parent',
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.css'],
})
export class ParentComponent implements OnInit {
  total = 4000;
  data = Array.from({ length: this.total }).map((_, i) =>
    Object.assign({ id: i, name: `Option ${i}` })
  );

  constructor() {}

  ngOnInit() {
    console.log(this.data);
  }
}
