import { Region } from './../interfaces/region.type';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, delay, map, Observable, of, tap } from 'rxjs';
import { Country } from '../interfaces/country';
import { CacheStore } from '../interfaces/cache-store.interface'; // Asegúrate de que la ruta sea correcta

@Injectable({providedIn: 'root'})
export class CountriesService {

  private apiURL: string = 'https://restcountries.com/v3.1';

  public cacheStore: CacheStore = {
    byCapital:    {term: '', countries: []},
    byCountries:  {term: '', countries: []},
    byRegion:     {term: '', countries: []},
  }

  constructor(private http: HttpClient) {
    this.loadFromLocalStorage();
  }

  private saveToLocalStorage(){
    localStorage.setItem('cacheStroe', JSON.stringify(this.cacheStore));
  }

  private loadFromLocalStorage(){
    if (!localStorage.getItem('cacheStore')) return;

    this.cacheStore = JSON.parse(localStorage.getItem('cacheStore')!);
  }

  private getCountriesRequest(url:string): Observable<Country []> {
    return this.http.get<Country[]>(url)
      .pipe(
        catchError ( () => of([]) ),
        // delay(2000),
      );
  }

  searchCountrybyAlphaCode ( code: string ): Observable<Country | null> {

    const url = `${this.apiURL}/alpha/${code}`;
    return this.http.get<Country[]>( url )
      .pipe(
        map( countries => countries.length > 0 ? countries[0]: null ),
        catchError ( () => of(null) )
      );
  }

  searchCapital ( term: string): Observable<Country[]> {

    const url = `${this.apiURL}/capital/${term}`;
    return this.getCountriesRequest(url)
      .pipe(
        tap( countries => this.cacheStore.byCapital = { term, countries}),
        tap (() => this.saveToLocalStorage()),
      );
  }

  searchCountry ( term: string): Observable<Country[]> {

    const url = `${this.apiURL}/name/${term}`;
    return this.getCountriesRequest(url)
      .pipe(
        tap( countries => this.cacheStore.byCountries = { term, countries}),
        tap (() => this.saveToLocalStorage()),
      );

  }

  searchRegion ( region: Region): Observable<Country[]> {

    const url = `${this.apiURL}/region/${region}`;
    return this.getCountriesRequest(url)
      .pipe(
        tap( countries => this.cacheStore.byRegion = { term: region, countries}),
        tap (() => this.saveToLocalStorage()),
      );
  }

}
