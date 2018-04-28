import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {

  heroes: Hero[];

  constructor(private heroService: HeroService) { }

  ngOnInit() {
    this.getHeroes();
  }

  getHeroes() {
    // this.heroes = this.heroService.getHeroes();
    this.heroService.getHeroes()
      .subscribe(heroes => this.heroes = heroes);
  }

  addHero(heroName: string) {
    heroName = heroName.trim();
    if (!heroName) return false;

    this.heroService.addHero({ name: heroName } as Hero)
      .subscribe(hero => this.heroes.push(hero));
  }

  deleteHero(hero: Hero) {
    this.heroes = this.heroes.filter(_hero => _hero !== hero);
    // If you neglect to subscribe(), the service will not send
    // the delete request to the server! As a rule, an Observable does nothing until something subscribes!
    this.heroService.deleteHero(hero).subscribe();
  }

}
