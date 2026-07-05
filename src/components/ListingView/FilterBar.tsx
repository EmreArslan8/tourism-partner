import SearchBox, { type Suggestion } from "./SearchBox";
import FilterSelects from "./FilterSelects";
import type { Business } from "@/lib/types";
import styles from "./styles";

const FilterBar = ({
  businesses,
  country,
  city,
  district,
  q,
  minRating,
  countries,
  cities,
  districts,
  onCountry,
  onCity,
  onDistrict,
  onQ,
  onPick,
  onMinRating,
}: {
  businesses: Business[];
  country: string;
  city: string;
  district: string;
  q: string;
  minRating: number;
  countries: string[];
  cities: string[];
  districts: string[];
  onCountry: (v: string) => void;
  onCity: (v: string) => void;
  onDistrict: (v: string) => void;
  onQ: (v: string) => void;
  onPick: (s: Suggestion) => void;
  onMinRating: (v: number) => void;
}) => {
  return (
    <div className={styles.bar}>
      <div className={styles.barSearch}>
        <SearchBox businesses={businesses} value={q} onChange={onQ} onPick={onPick} />
      </div>
      <FilterSelects
        country={country}
        city={city}
        district={district}
        minRating={minRating}
        countries={countries}
        cities={cities}
        districts={districts}
        onCountry={onCountry}
        onCity={onCity}
        onDistrict={onDistrict}
        onMinRating={onMinRating}
      />
    </div>
  );
};

export default FilterBar;
