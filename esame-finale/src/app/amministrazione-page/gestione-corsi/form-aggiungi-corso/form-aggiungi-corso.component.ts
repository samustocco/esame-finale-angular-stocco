import { Component, signal, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CorsiService } from '../../../corsi-page/corsi.service';

function validateText(control: AbstractControl) {
  const test = /^[a-zA-Z\s]*$/.test(control.value);
  return test ? null : { invalidField: true };    
}

function validateNum(control: AbstractControl) {
  const test = /^[0-9]*$/.test(control.value);
  return test ? null : { invalidField: true }
}

function validateFile(control: AbstractControl) {
  const file = control.value;
  if (file) {
    const allowedExtensions = /^.*(\.jpg|\.jpeg|\.png|\.avif|\.webp)$/;
    if (!allowedExtensions.test(file)) {
      return { invalidFileType: true };
    }
  }
  return null;
}

@Component({
  selector: 'app-form-aggiungi-corso',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form-aggiungi-corso.component.html',
  styleUrl: './form-aggiungi-corso.component.css'
})
export class FormAggiungiCorsoComponent {

  isPrenotato = signal<boolean>(false);
  isError = signal<boolean>(false);

  formAddCorso = new FormGroup({
    nome: new FormControl('', [Validators.required, validateText]),
    descrizione: new FormControl('', [Validators.required]),
    istruttore: new FormControl('', [Validators.required, validateText]),
    durata: new FormControl(0, [Validators.required, validateNum]),
    capacita: new FormControl(0, [Validators.required, validateNum]),
    immagine: new FormControl('', [Validators.required, validateFile])
  });

  corsiService = inject(CorsiService);

  get isNameValid() {
    return this.formAddCorso.controls.nome.touched && this.formAddCorso.controls.nome.invalid;
  }

  get isDescValid() {
    return this.formAddCorso.controls.descrizione.touched && this.formAddCorso.controls.descrizione.invalid;
  }

  get isIstruttoreValid() {
    return this.formAddCorso.controls.istruttore.touched && this.formAddCorso.controls.istruttore.invalid;
  }

  get isDurataValid() {
    return this.formAddCorso.controls.durata.touched && this.formAddCorso.controls.durata.invalid;
  }

  get isCapacitaValid() {
    return this.formAddCorso.controls.capacita.touched && this.formAddCorso.controls.capacita.invalid;
  }

  get isImgValid() {
    return (this.formAddCorso.controls.immagine.touched || this.formAddCorso.controls.immagine.dirty) && this.formAddCorso.controls.immagine.invalid;
  }

  onSubmit(event: Event) {
    event.preventDefault()
    // console.log(this.formAddCorso.value);
    if (this.formAddCorso.valid) {

      this.addCorso({
        name: this.formAddCorso.value.nome!,
        description: this.formAddCorso.value.nome!,
        instructor: this.formAddCorso.value.istruttore!,
        duration: this.formAddCorso.value.durata!,
        maxCapacity: this.formAddCorso.value.capacita!,
        img: this.formAddCorso.value.immagine!
      });
    } else {
      console.log('Not submitted');
    }
  }

  addCorso(data: {
    name: string;
    description: string;
    instructor: string;
    duration: number;
    maxCapacity: number;
    img: string;
  }) {
    this.corsiService.addCorso(data)
    .subscribe({
      complete: () => {
        this.isPrenotato.set(true);
      },
      error: (err) => {
        console.log('Error', err);
        this.isError.set(true);
      }
    });
  }

  resetForm() {
    this.formAddCorso.reset();
    this.isPrenotato.set(false);
  }


}
