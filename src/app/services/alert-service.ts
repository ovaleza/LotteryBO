import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  /**ALERTAS**/

  soloAlert(message: string = '!!!!!NADA!!!') {
    return Swal.fire({
      icon: 'info',
      title: message,
    });
  }

  successAlertFunction(message: string = 'Exitoso') {
    return Swal.fire({
      icon: 'success',
      title: message,
      showConfirmButton: false,
      timer: 1000,
    });
  }

  errorAlertFunction(message: string) {
    return Swal.fire({
      icon: 'error',
      title: message,
      showConfirmButton: true,
      //timer: 1500,
    });
  }

  validationAlertFunction(
    message?: string,
    buttonTitle?: string,
    title?: string
  ) {
    return Swal.fire({
      title: title,
      text: message,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: buttonTitle,
    });
  }

  login() {
    return Swal.showLoading();
  }

  loadingAlertOpen() {
    Swal.fire({
      title: '¡Cargando permisos!',
      html: 'Validando credenciales...',
      timerProgressBar: true,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }

  loadingAlertHide() {
    Swal.fire({
      title: '¡Cargando permisos!',
      html: 'Validando credenciales...',
      timerProgressBar: true,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.hideLoading();
      },
    });
  }
}
