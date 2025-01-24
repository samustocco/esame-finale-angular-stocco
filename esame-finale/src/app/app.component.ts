import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { PrenotazioniService } from './amministrazione-page/prenotazioni/prenotazioni.service';
import { CorsiService } from './corsi-page/corsi.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'esame-finale';

  prenotazioniService = inject(PrenotazioniService);
  corsiService = inject(CorsiService);

  ngOnInit() {
    this.prenotazioniService.initializeMaxPrenId();
    this.corsiService.initializeMaxCorsoId();
  }
}
