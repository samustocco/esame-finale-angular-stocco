import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { type Prenotazione } from './prenotazione/prenotazione.model';
import { catchError, max, throwError, map } from 'rxjs';

// interface Prenotazione {
//   id: number,
//   idCorso: number,
//   // nomeCorso: string,
//   // istruttore: string,
//   dataOra: object,
//   nome: string,
//   cognome: string
// }

@Injectable({
    providedIn: 'root',
})
export class PrenotazioniService {
    private httpClient = inject(HttpClient);

    private API_URL = 'http://localhost:3000/bookings';

    MAX_ID = signal<number>(0);

    // Fa il fetch di un array di prenotazioni
    private fetchBookings(url: string, errorMsg: string) {
        return this.httpClient.get<Prenotazione[]>(url).pipe(
            catchError((err) => {
                console.log('Error', err);
                return throwError(() => {
                    new Error(errorMsg);
                });
            }),
        );
    }

    // Fa il post di una prenotazione
    private postPrenotazione(
        url: string,
        corso: Prenotazione,
        errorMsg: string,
    ) {
        return this.httpClient.post<Prenotazione>(url, corso).pipe(
            catchError((err) => {
                console.log('Error', err);
                return throwError(() => {
                    new Error(errorMsg);
                });
            }),
        );
    }

    // Elimina una prenotazione
    private deletePrenotazione(url: string, errorMsg: string) {
        return this.httpClient.delete(url).pipe(
            catchError((err) => {
                console.log('Error', err);
                return throwError(() => {
                    new Error(errorMsg);
                });
            }),
        );
    }

    // Calcola il massimo id delle prenotazioni (id più alto)
    private setMaxIdPrenotazioni() {
        let maxId = 0;
        this.getPrenotazioni().subscribe((prenotazioni) => {
            prenotazioni.forEach((prenotazione) => {
                if (Number(prenotazione.id) > maxId) {
                    maxId = Number(prenotazione.id);
                }
            });
            this.MAX_ID.set(maxId);
            // console.log(this.MAX_ID());
        });
    }

    // Inizializza il massimo id delle prenotazioni
    public initializeMaxPrenId() {
        this.setMaxIdPrenotazioni();
    }

    // Restituisce un array con tutte le prenotazioni
    public getPrenotazioni() {
        // console.log('getPrenotazioni');
        return this.fetchBookings(
            this.API_URL,
            'Errore durante il caricamento delle prenotazioni',
        );
    }

    // Restituisce una prenotazione in base all'id
    // public getPrenotazioneById(id: number) {
    //     return this.fetchBookings(
    //         `${this.API_URL}/${id}`,
    //         'Errore durante il caricamento della prenotazione',
    //     );
    // }

    // Aggiunge una prenotazione passata come parametro (e gli aggiunge un id incrementale)
    public addPrenotazione({
        idCorso,
        dataOra,
        nome,
        cognome,
    }: {
        idCorso: string;
        dataOra: Date;
        nome: string;
        cognome: string;
    }) {
        const id = (this.MAX_ID() + 1).toString();

        const prenotazione = { id, idCorso, dataOra, nome, cognome };

        return this.postPrenotazione(
            this.API_URL,
            prenotazione,
            "Errore durante l'aggiunta della prenotazione",
        );
    }

    // Rimuove una prenotazione in base all'id
    public removePrenotazione(id: string) {
        return this.deletePrenotazione(
            `${this.API_URL}/${id}`,
            'Errore durante la rimozione della prenotazione',
        );
    }
}
