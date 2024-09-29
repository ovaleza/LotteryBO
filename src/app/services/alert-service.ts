import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  /**ALERTAS**/

  soloAlert(message: string = '!!!!!NADA!!!', time: number=0) {
    return Swal.fire({
      icon: 'info',
      title: message,
      timer: time
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

  errorAlertFunction(message: string, time:number=0) {
    return Swal.fire({
      icon: 'error',
      title: message,
      showConfirmButton: true,
      timer: time,
    });
  }

  validationAlertFunction(
    message?: string,
    buttonTitle?: string,
    title?: string,
    time?: number
  ) {
    return Swal.fire({
      title: title,
      text: message,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: buttonTitle,
      timer: time,
    });
  }

  login() {
    return Swal.showLoading();
  }

  loadingAlertOpen() {
    Swal.fire({
      title: '¡Procesando!',
      html: 'Favor esperar, Gestionando datos...',
      timerProgressBar: true,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }

  loadingAlertHide() {
    Swal.fire({
      title: '¡Procesando!',
      html: 'Favor esperar, Gestionando los datos...',
      timerProgressBar: true,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.hideLoading();
      },
    });
  }
}
