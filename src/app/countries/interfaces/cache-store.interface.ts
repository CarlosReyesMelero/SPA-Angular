import { Country } from "./country"
import { Region } from "./region.type";

export interface CacheStore {
  byCapital:    TermCountries;
  byCountries:  TermCountries;
  byRegion:     RegionsCountries;
}

export interface TermCountries {
  term: string,
  countries: Country[];
}

export interface RegionsCountries {
  term:       Region,
  countries:  Country[];
}
