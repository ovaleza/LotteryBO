import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert-service';
import { MasterService } from 'src/app/services/master.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  userInformation: any = FormGroup;

  constructor(
    private form: FormBuilder,
    private alert: AlertService,
    private masterService: MasterService,
    private router: Router
  ) {
    this.userInformation = this.form.group({
      user: new FormControl('', [Validators.required]),
      userPassword: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {}

  userLogin() {
    let obj = {
      userName: this.userInformation.get('user').value,
      password: this.userInformation.get('userPassword').value,
    };
    this.masterService.login(obj).subscribe((res) => {
      this.responseUserLogin(res);
    });
    this.alert.loadingAlertOpen();
  }

  responseUserLogin(data: any) {
    this.alert.loadingAlertHide();
    if (data.ResposeDescription == 'OK') {
      localStorage.setItem('sessionToken', data.AuthToken);
      localStorage.setItem('ciaName', data.User.CiaName);
      localStorage.setItem('user', data.User.Us);
      localStorage.setItem(
        'usrName',
        data.User.Name ? data.User.Name : data.User.Us
      );
      localStorage.setItem('sessionStart', 'Done');
      this.alert.successAlertFunction(
        `Bienvenido ${localStorage.getItem('usrName')}`
      );
      this.router.navigate(['/monitor-branches']);
    } else {
      this.alert.errorAlertFunction(data.ResposeDescription);
    }
  }
}