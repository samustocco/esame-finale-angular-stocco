import { Component, computed, inject, input, output, EventEmitter, OnInit } from '@angular/core';
import { type Prenotazione } from './prenotazione.model';
import { CorsiService } from '../../../corsi-page/corsi.service';

@Component({
  selector: 'app-prenotazione',
  standalone: true,
  imports: [],
  templateUrl: './prenotazione.component.html',
  styleUrl: './prenotazione.component.css'
})
export class PrenotazioneComponent implements OnInit {
  prenotazione = input.required<Prenotazione>();
  deletePrenotazione = output<Prenotazione>();
  // @output() deletePrenotazione = new EventEmitter<Prenotazione>();
  
  corsiService = inject(CorsiService);
  nomeCorso: string = '';

  date = computed(() => {
    return new Date(this.prenotazione().dataOra);
  });

  ngOnInit() {
    this.getNomeCorso(this.prenotazione().idCorso);
  }

  getNomeCorso(idCorso: string) {
    this.corsiService.getCorsoById(idCorso).subscribe({
      next: (response) => {
        this.nomeCorso = response.name;
      }
    });
  }

  formatDate(date: Date) {
    return date.toLocaleDateString() + ' - ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  onDeletePrenotazione() {
    this.deletePrenotazione.emit(this.prenotazione());
  }

}
