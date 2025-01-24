import { Component } from '@angular/core';
import { FormAggiungiCorsoComponent } from './form-aggiungi-corso/form-aggiungi-corso.component';
import { FormEliminaCorsoComponent } from './form-elimina-corso/form-elimina-corso.component';
import { CorsiService } from '../../corsi-page/corsi.service';

@Component({
  selector: 'app-gestione-corsi',
  standalone: true,
  imports: [FormAggiungiCorsoComponent, FormEliminaCorsoComponent],
  templateUrl: './gestione-corsi.component.html',
  styleUrl: './gestione-corsi.component.css'
})
export class GestioneCorsiComponent {
  
}
