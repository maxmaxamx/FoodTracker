import { Routes } from '@angular/router';
import { WelcomePage } from './components/welcome-page/welcome-page';
import { Mainpage } from './components/authorized/mainpage/mainpage';

export const routes: Routes = [
    {path: '', component: WelcomePage},
    {path: 'authorized', component: Mainpage}
];
