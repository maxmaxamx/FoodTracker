import { Routes } from '@angular/router';
import { WelcomePage } from './components/welcome-page/welcome-page';
import { Mainpage } from './components/authorized/mainpage/mainpage';
import { Login } from './components/login/login';
import { Signup } from './components/signup/signup';
import { TwoFA } from './components/two-fa/two-fa';
import { AddFood } from './components/authorized/add-food/add-food';
import { AiChat } from './components/ai-chat-components/ai-chat/ai-chat';
import { authGuard, nonAuthGuard } from './utils/authGuard';


export const routes: Routes = [
    { path: '', component: WelcomePage, pathMatch: 'full' },
    { path: 'login', component: Login, canActivate: [nonAuthGuard] },
    { path: 'signup', component: Signup, canActivate: [nonAuthGuard] },
    { path: 'twofa', component: TwoFA },
    { path: 'authorized', component: Mainpage, canActivate: [authGuard] },
    { path: 'add', component: AddFood, canActivate: [authGuard] },
    { path: 'ai', component: AiChat, canActivate: [authGuard] },
    { path: '**', redirectTo: '' }
];
