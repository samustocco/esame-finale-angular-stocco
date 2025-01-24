import { Component, inject, signal } from '@angular/core';
import { CorsiService } from './corsi.service';
// import { CorsoModalComponent } from './corso-modal/corso-modal.component';
import { CorsoComponent } from './corso/corso.component';
import { type Corso } from './corso/corso.model';
import { FormPrenotazioneComponent } from './form-prenotazione/form-prenotazione.component';


@Component({
  selector: 'app-corsi-page',
  standalone: true,
  imports: [CorsoComponent, FormPrenotazioneComponent],
  templateUrl: './corsi-page.component.html',
  styleUrl: './corsi-page.component.css'
})
export class CorsiPageComponent {
  
  corsi: Corso[] = [];
  prenotazioniCorsi: { [corsoId: string]: number } = {};
  corsoSelezionato = signal<Corso | null>(null);
  isFetching = signal(true);

  private corsiService = inject(CorsiService);
  
  ngOnInit() {
    this.corsiService.getCorsi()
    .subscribe({
      next: (response) => {
        this.corsi = response;
      },
      complete: () => {
        this.isFetching.set(false);
      }
    })

    this.updatePrenotazioni();
  }

  updatePrenotazioni() {
    this.corsiService.getAllCountPrenotazioniByCourse()
    .subscribe({
      next: (response) => {
        this.prenotazioniCorsi = response;
      }
    })
  }

  isModalOpen = signal(false);

  openModal() {
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  onSelectedCorso(corso: Corso) {
    this.corsoSelezionato.set(corso);
    this.openModal();
  }
}
