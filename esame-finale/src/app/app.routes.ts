import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { CorsiPageComponent } from './corsi-page/corsi-page.component';
import { ChiSiamoPageComponent } from './chi-siamo-page/chi-siamo-page.component';
import { AmministrazionePageComponent } from './amministrazione-page/amministrazione-page.component';

export const routes: Routes = [
    { path: '', component: HomePageComponent },
    { path: 'corsi', component: CorsiPageComponent },
    { path: 'chi-siamo', component: ChiSiamoPageComponent },
    { path: 'amministrazione', component: AmministrazionePageComponent },
    { path: '**', redirectTo: '' }
];


/*
  ROTTE CHILDREN:
 {path: 'corsi', component: CorsiPageComponent, 
        children: [
            {path: 'corso', component: CorsoComponent} //localhost:4200/corsi/corso
        ]
    },

  PARAMETRI DINAMICI
  {path:'amministrazione', component: AmministrazionePageComponent, children: [
       {path: ':userId', component: InfoUtenteComponent}
   ]},
*/
