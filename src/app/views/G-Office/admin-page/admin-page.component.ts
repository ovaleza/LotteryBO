import { Component, OnInit } from '@angular/core';
import { freeSet } from '@coreui/icons';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss'],
})
export class AdminPageComponent implements OnInit {
  public options: any = [];
  public icons = freeSet;

  constructor() {}

  ngOnInit(): void {
    this.options = [
      {
        name: 'Administrar Usuario',
        url: '',
      },
    ];
  }
}
