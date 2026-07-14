import SearchBox, { type Suggestion } from "./SearchBox";
import FilterSelects from "./FilterSelects";
import type { Business } from "@/lib/types";
import type { CountryOption } from "@/lib/geo";
import styles from "./styles";

const FilterBar = ({
  businesses,
  country,
  city,
  district,
  q,
  countries,
  cities,
  districts,
  onCountry,
  onCity,
  onDistrict,
  onQ,
  onPick,
}: {
  businesses: Pick<Business, "id" | "name" | "city" | "district" | "type">[];
  country: string;
  city: string;
  district: string;
  q: string;
  countries: CountryOption[];
  cities: string[];
  districts: string[];
  onCountry: (v: string) => void;
  onCity: (v: string) => void;
  onDistrict: (v: string) => void;
  onQ: (v: string) => void;
  onPick: (s: Suggestion) => void;
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
        countries={countries}
        cities={cities}
        districts={districts}
        onCountry={onCountry}
        onCity={onCity}
        onDistrict={onDistrict}
      />
    </div>
  );
};

export default FilterBar;
