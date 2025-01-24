import { Component, inject } from '@angular/core';
import { CorsiService } from '../corsi-page/corsi.service';
import { type Corso } from '../corsi-page/corso/corso.model';
import { CorsoComponent } from '../corsi-page/corso/corso.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CorsoComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  
  primiCorsi: Corso[] = [];
  prenotazioniCorsi: { [corsoId: string]: number } = {};

  corsiService = inject(CorsiService);

  ngOnInit() {
    const subscription = this.corsiService.getFirstFourCorsi()
    .subscribe({
      next: (response) => {
        this.primiCorsi = response;
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

}
