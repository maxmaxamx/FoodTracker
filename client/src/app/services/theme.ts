import { Injectable, inject, signal, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Theme {
  currentTheme = signal<'light' | 'dark'>('dark');

  constructor(){
    this.initTheme();
  }

  private initTheme() {
    const saved: 'light' | 'dark' | null = localStorage.getItem('data-theme') as 'light' | 'dark' | null;

    if (saved) {
      this.applyTheme(saved);
    }
  }

  public toggleTheme(): void {
    if (this.currentTheme() === "light") {
      this.applyTheme('dark');
    } else {
      this.applyTheme('light');
    }
  }

  private applyTheme(theme: 'light' | 'dark') {
    this.currentTheme.set(theme);
    localStorage.setItem('data-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }
}
