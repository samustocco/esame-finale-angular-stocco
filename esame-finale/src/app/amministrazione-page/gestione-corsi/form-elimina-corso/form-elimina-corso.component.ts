import { Component, signal, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CorsiService } from '../../../corsi-page/corsi.service'; 
import { Corso } from '../../../corsi-page/corso/corso.model';

@Component({
  selector: 'app-form-elimina-corso',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form-elimina-corso.component.html',
  styleUrl: './form-elimina-corso.component.css'
})
export class FormEliminaCorsoComponent {

  isEliminato = signal<boolean>(false);
  isValid = signal<boolean>(true);

  nomeCorsi: {id: string, name: string}[] = [];

  corsiService = inject(CorsiService);

  ngOnInit() {
    this.getDatiCorsi();
  }

  getDatiCorsi() {
    this.corsiService.getCorsi()
      .subscribe((corsi) => {
        this.nomeCorsi = corsi.map(corso => ({ id: corso.id, name: corso.name }));
      });
  }

  formDeleteCorso = new FormGroup({
    id: new FormControl('', [Validators.required])
  });

  // get isIdValid() {
  //   return this.formDeleteCorso.controls.id.touched && this.formDeleteCorso.controls.id.invalid;
  // }

  onSubmit(event: Event) {
    event.preventDefault();
    console.log(this.formDeleteCorso.value);
    if (this.formDeleteCorso.valid) {
      this.eliminaCorso(this.formDeleteCorso.controls.id.value!);
      this.isEliminato.set(true);
      this.isValid.set(true);
    } else {
      console.log('Not Submitted');
      this.isValid.set(false);
    }
  }

  eliminaCorso(id: string) {
    // const id = this.formDeleteCorso.controls.id.value;
    this.corsiService.removeCorso(id)
      .subscribe({
        complete: () => {
          this.isEliminato.set(true);
        },
        error: (err) => {
          console.log('Error', err);
          this.isValid.set(false);
        }
      });
  }

}
