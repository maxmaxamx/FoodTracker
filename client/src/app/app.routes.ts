import { Routes } from '@angular/router';
import { WelcomePage } from './components/welcome-page/welcome-page';
import { Mainpage } from './components/authorized/mainpage/mainpage';
import { Login } from './components/login/login';
import { Signup } from './components/signup/signup';
import { TwoFA } from './components/two-fa/two-fa';
import { AddFood } from './components/authorized/add-food/add-food';

export const routes: Routes = [
    {path: '', component: WelcomePage},
    {path: 'authorized', component: Mainpage},
    {path: 'login', component: Login},
    {path: 'signup', component: Signup},
    {path: 'twofa', component: TwoFA},
    {path: 'add', component: AddFood}
];
