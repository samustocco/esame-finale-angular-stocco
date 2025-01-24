import { Component, inject, input, signal, Input, output, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrenotazioniService } from '../../amministrazione-page/prenotazioni/prenotazioni.service';
import { OnChanges, SimpleChanges } from '@angular/core';

function validateName(control: AbstractControl) {
  const test = /^[a-zA-Z\s]*$/.test(control.value);
  return test ? null : { invalidName: true };    
}

function validateDateTime(control: AbstractControl) {
  
  
  const test = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.test(control.value);
  const validDate = new Date(convertToDateTime(control.value)).getTime() > Date.now();
  
  
  return test && validDate ? null : { invalidDateTime: true };    
}

function convertToDateTime(localDateTime: string): Date {
  const dateTimeString = localDateTime.replace('T', ' ');
  return new Date(dateTimeString);
}

@Component({
  selector: 'app-form-prenotazione',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './form-prenotazione.component.html',
  styleUrl: './form-prenotazione.component.css'
})
export class FormPrenotazioneComponent implements OnChanges {
  
  idCorso = input.required<string | undefined>();

  prenotazioniService = inject(PrenotazioniService);

  formPrenotazione = new FormGroup({
    nome: new FormControl('', [Validators.required, validateName]),
    cognome: new FormControl('', [Validators.required, validateName]),
    dataOra: new FormControl('', [Validators.required, validateDateTime]),
  });

  isPrenotata = signal<boolean>(false);
  isError = signal<boolean>(false);

  @Input() closeModalEvent: boolean = false;
  @Output() formSubmitted = new EventEmitter<boolean>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['closeModalEvent'] && changes['closeModalEvent'].currentValue) {
      this.isPrenotata.set(false);
    }
  }

  get isNameValid() {
    return this.formPrenotazione.controls.nome.touched && this.formPrenotazione.controls.nome.invalid;
  }

  get isSurnameValid() {
    return this.formPrenotazione.controls.cognome.touched && this.formPrenotazione.controls.cognome.invalid;
  }

  get isDateTimeValid() {
    return (this.formPrenotazione.controls.dataOra.touched || this.formPrenotazione.controls.dataOra.dirty) && this.formPrenotazione.controls.dataOra.invalid;
  }

  onSubmit(event: Event) {
    event.preventDefault();
    console.log(this.formPrenotazione.value);
    if (this.formPrenotazione.valid) {

      this.addPrenotazione({
        idCorso: this.idCorso()!,
        dataOra: new Date(convertToDateTime(this.formPrenotazione.controls.dataOra.value || '')),
        nome: this.formPrenotazione.controls.nome.value!,
        cognome: this.formPrenotazione.controls.cognome.value!,
      });
    } else {
      console.log('Not submitted');
    }
  }

  addPrenotazione(data: {idCorso: string, dataOra: Date, nome: string, cognome: string}) {
    this.prenotazioniService.addPrenotazione(data)
    .subscribe({
      complete: () => {
        this.isPrenotata.set(true);
        this.formSubmitted.emit(true);
      },
      error: (err) => {
        console.log('Error', err);
        this.isError.set(true);
      }
    })
  }

}
