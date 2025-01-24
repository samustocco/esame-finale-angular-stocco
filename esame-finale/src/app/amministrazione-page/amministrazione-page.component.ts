import { Component } from '@angular/core';
import { PrenotazioniComponent } from './prenotazioni/prenotazioni.component';
import { GestioneCorsiComponent } from './gestione-corsi/gestione-corsi.component';

@Component({
  selector: 'app-amministrazione-page',
  standalone: true,
  imports: [PrenotazioniComponent, GestioneCorsiComponent],
  templateUrl: './amministrazione-page.component.html',
  styleUrl: './amministrazione-page.component.css'
})
export class AmministrazionePageComponent {

}
