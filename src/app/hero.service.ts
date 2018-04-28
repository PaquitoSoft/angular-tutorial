import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class HeroService {

  private heroesUrl: string = 'api/heroes';

  constructor(
    private messageService: MessageService,
    private http: HttpClient
  ) { }

  private log(message: string) {
    this.messageService.addMessage('HeroService: ' + message);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  getHeroes(): Observable<Hero[]> {
    // TODO send the message AFTER heroes are fetched
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(() => this.log('Heroes fetched!')),
        catchError(this.handleError('getHeroes', []))
      );
  }

  getHero(heroId: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${heroId}`;
    return this.http.get<Hero>(url)
      .pipe(
        tap(() => this.log(`fetched hero with id ${heroId}`)),
        catchError(this.handleError<Hero>(`getHero id=${heroId}`))
      );
  }

  updateHero(hero: Hero): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.put(this.heroesUrl, hero, httpOptions)
      .pipe(
        tap(() => this.log(`Hero updated id=${hero.id}`)),
        catchError(this.handleError<any>('updateHero'))
      );
  }

  addHero(hero: Hero): Observable<Hero> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.post<Hero>(this.heroesUrl, hero, httpOptions)
      .pipe(
        tap((hero: Hero) => this.log(`added hero with id=${hero.id}`)),
        catchError(this.handleError<Hero>('addHero'))
      );
  }

  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.delete<Hero>(url, httpOptions)
      .pipe(
        tap(() => this.log(`deleted hero id=${id}`)),
        catchError(this.handleError<Hero>('deleteHero'))
      );
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) return of([]);

    return this.http.get<Hero[]>(`api/heroes/?name=${term}`)
      .pipe(
        tap(() => this.log(`found heroes matching term=${term}`)),
        catchError(this.handleError<Hero[]>('searchHeroes', []))
      )
  }

}
