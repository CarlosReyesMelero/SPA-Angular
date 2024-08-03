import { Component, OnInit } from '@angular/core';
import { CountriesService } from '../../services/countries.service';
import { Country } from '../../interfaces/country';
import { Region } from '../../interfaces/region.type';


@Component({
  selector: 'app-by-region-page',
  templateUrl: './by-region-page.component.html',
  styles: ``
})
export class ByRegionPageComponent implements OnInit{

  public countries: Country[] = [];
  public regions: Region[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
  public selectedRegion?: Region;

  constructor( private countriesSevice:  CountriesService ) {}

  ngOnInit(): void {
    this.countries = this.countriesSevice.cacheStore.byRegion.countries;
    this.selectedRegion = this.countriesSevice.cacheStore.byRegion.term;
  }

  searchByRegion ( region: Region ): void {

    this.selectedRegion = region;

    this.countriesSevice.searchRegion( region )
      .subscribe( countries => {
        this.countries = countries;
      })
  }

}
