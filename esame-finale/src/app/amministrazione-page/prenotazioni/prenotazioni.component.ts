import { Component, inject, signal } from '@angular/core';
import { PrenotazioniService } from './prenotazioni.service';
import { type Prenotazione } from './prenotazione/prenotazione.model';
import { PrenotazioneComponent } from './prenotazione/prenotazione.component';

@Component({
  selector: 'app-prenotazioni',
  standalone: true,
  imports: [PrenotazioneComponent],
  templateUrl: './prenotazioni.component.html',
  styleUrl: './prenotazioni.component.css'
})
export class PrenotazioniComponent {

  prenotazioni: Prenotazione[] = [];
  // prenotazioneSelezionata = signal<Prenotazione | null>(null);
  isFetching = signal(true);

  private prenotazioniService = inject(PrenotazioniService);

  ngOnInit() {
    this.updatePrenotazioni();
  }
 
  updatePrenotazioni() {
    const subscription = this.prenotazioniService.getPrenotazioni()
    .subscribe({
      next: (response) => {
        // console.log(response);
        this.prenotazioni = response;
        // console.log(this.prenotazioni);
      },
      complete: () => {
        this.isFetching.set(false);
      }
    });
  }

  // onSelectedPrenotazione(prenotazione: Prenotazione) {
  //   this.prenotazioneSelezionata.set(prenotazione);
  // }

  onDeletePrenotazione(prenotazione: Prenotazione) {
    this.prenotazioniService.removePrenotazione(prenotazione.id).subscribe({
      next: () => {
        this.updatePrenotazioni();
        // this.prenotazioni = this.prenotazioni.filter((p) => p.id !== prenotazione.id);
        // this.prenotazioneSelezionata.set(null);
      }
    });
  }

}
