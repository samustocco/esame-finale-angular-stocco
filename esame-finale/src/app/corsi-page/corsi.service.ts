import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { type Corso } from './corso/corso.model';
import { catchError, max, throwError, map, forkJoin } from 'rxjs';
import { PrenotazioniService } from '../amministrazione-page/prenotazioni/prenotazioni.service';

@Injectable({
    providedIn: 'root',
})
export class CorsiService {
    private httpClient = inject(HttpClient);

    private API_URL = 'http://localhost:3000/courses';

    MAX_ID = signal<number>(0);
    
    prenotazioniService = inject(PrenotazioniService);

    // Fa il fetch di un array di corsi
    private fetchCorsi(url: string, errorMsg: string) {
        return this.httpClient.get<Corso[]>(url).pipe(
            catchError((err) => {
                console.log('Error', err);
                return throwError(() => {
                    new Error(errorMsg);
                });
            }),
        );
    }

    // Fa il fetch di un singolo corso
    private fetchCorso(url: string, errorMsg: string) {
        return this.httpClient.get<Corso>(url).pipe(
            catchError((err) => {
                console.log('Error', err);
                return throwError(() => {
                    new Error(errorMsg);
                });
            }),
        );
    }

    // Fa il posto di un corso
    private postCorso(url: string, corso: Corso, errorMsg: string) {
        return this.httpClient.post<Corso>(url, corso).pipe(
            catchError((err) => {
                console.log('Error', err);
                return throwError(() => {
                    new Error(errorMsg);
                });
            }),
        );
    }

    // Elimina un corso
    private deleteCorso(url: string, errorMsg: string) {
        return this.httpClient.delete(url).pipe(
            catchError((err) => {
                console.log('Error', err);
                return throwError(() => {
                    new Error(errorMsg);
                });
            }),
        );
    }

    // Calcola il massimo id dei corsi (id più alto)
    private setMaxIdCorso() {
        let maxId = 0;
        this.getCorsi().subscribe((corsi) => {
            corsi.forEach((corso) => {
                if (Number(corso.id) > maxId) {
                    maxId = Number(corso.id);
                }
            });
            this.MAX_ID.set(maxId);
            // console.log(this.MAX_ID());
        });
    }

    // Restituisce un oggetto con il conteggio delle prenotazioni per ogni corso (identificato da idCorso)
    private getPrenotazioniCountByCourse() {
        return this.prenotazioniService.getPrenotazioni().pipe(
            map((prenotazioni) => {
                const countByCourse: { [corsoId: string]: number } = {};
                prenotazioni.forEach((prenotazione) => {
                    if (countByCourse[prenotazione.idCorso]) {
                        countByCourse[prenotazione.idCorso]++;
                    } else {
                        countByCourse[prenotazione.idCorso] = 1;
                    }
                });
                return countByCourse;
            })
        );
    }

    // Restituisce il conteggio delle prenotazioni per un corso specifico, in base all'id
    private getPrenotazioniCountByCourseId(corsoId: string) {
        return this.prenotazioniService.getPrenotazioni().pipe(
            map((prenotazioni) => {
                let count = 0;
                prenotazioni.forEach((prenotazione) => {
                    if (prenotazione.idCorso === corsoId) {
                        count++;
                    }
                });
                return count;
            })
        );
    }

    // Inizializza il massimo id dei corsi
    public initializeMaxCorsoId() {
        this.setMaxIdCorso();
    }

    // Restituisce un array con tutti i corsi
    public getCorsi() {
        return this.fetchCorsi(
            this.API_URL,
            'Errore durante il caricamento dei corsi',
        );
    }

    // Restituisce un corso in base all'id
    public getCorsoById(id: string) {
        return this.fetchCorso(
            `${this.API_URL}/${id}`,
            'Errore durante il caricamento del corso',
        );
    }

    // Aggiunge un corso passato come parametro, e gli aggiunge l'id
    public addCorso({
        name,
        description,
        instructor,
        duration,
        maxCapacity,
        img
    }: {
        name: string;
        description: string;
        instructor: string;
        duration: number;
        maxCapacity: number;
        img: string;
    }) {

        const id = (this.MAX_ID() + 1).toString();

        const corso = { id, name, description, instructor, duration, maxCapacity, img };

        return this.postCorso(
            this.API_URL,
            corso,
            "Errore durante l'aggiunta del corso",
        );
    }

    // Rimuove un corso in base all'id
    public removeCorso(id: string) {
        return this.deleteCorso(
            `${this.API_URL}/${id}`,
            'Errore durante la rimozione del corso',
        );
    }

    // Restituisce i primi quattro corsi nell'array
    public getFirstFourCorsi() {
        const url = `${this.API_URL}?_limit=4`;
        return this.fetchCorsi(
            url,
            'Errore durante il caricamento dei primi quattro corsi',
        );
    }


    // Restituisce il conteggio delle prenotazioni per un corso specifico, in base all'id
    public getCountPrenotazioniByCourse(corsoId: string) {
        return this.getPrenotazioniCountByCourseId(corsoId);
    }

    // Restituisce il conteggio delle prenotazioni per tutti i corsi (restituisce un oggetto)
    public getAllCountPrenotazioniByCourse() {
        return this.getPrenotazioniCountByCourse();
    }

}
