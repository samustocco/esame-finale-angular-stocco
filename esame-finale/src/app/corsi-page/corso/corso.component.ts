import { Component, computed, input, output, inject } from '@angular/core';
// import { CorsiService } from '../corsi.service';
import { RouterLink } from '@angular/router';
import { type Corso } from './corso.model';

@Component({
  selector: 'app-corso',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './corso.component.html',
  styleUrl: './corso.component.css'
})
export class CorsoComponent {
  corso = input.required<Corso>();
  postiDisponibili = input.required<number>();
  selectedCorso = output<Corso>();
  prenotabile = input.required<boolean>();

  // corsiService = inject(CorsiService);

  image = computed(() => {
    return 'courses/' + this.corso().img;
  })

  postiDisponibiliComputed = computed(() => {
    return this.postiDisponibili() > 0 ? (this.corso().maxCapacity - this.postiDisponibili()) : this.corso().maxCapacity;
  })

  onSelectCorso(corso: Corso) {
    this.selectedCorso.emit(corso);
  }
}
