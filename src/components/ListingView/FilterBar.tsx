import SearchBox, { type Suggestion } from "./SearchBox";
import FilterSelects from "./FilterSelects";
import styles from "./styles";

export default function FilterBar({
  country,
  city,
  district,
  q,
  verifiedOnly,
  minRating,
  countries,
  cities,
  districts,
  onCountry,
  onCity,
  onDistrict,
  onQ,
  onPick,
  onVerified,
  onMinRating,
}: {
  country: string;
  city: string;
  district: string;
  q: string;
  verifiedOnly: boolean;
  minRating: number;
  countries: string[];
  cities: string[];
  districts: string[];
  onCountry: (v: string) => void;
  onCity: (v: string) => void;
  onDistrict: (v: string) => void;
  onQ: (v: string) => void;
  onPick: (s: Suggestion) => void;
  onVerified: (v: boolean) => void;
  onMinRating: (v: number) => void;
}) {
  return (
    <div className={styles.bar}>
      <SearchBox value={q} onChange={onQ} onPick={onPick} />
      <FilterSelects
        country={country}
        city={city}
        district={district}
        verifiedOnly={verifiedOnly}
        minRating={minRating}
        countries={countries}
        cities={cities}
        districts={districts}
        onCountry={onCountry}
        onCity={onCity}
        onDistrict={onDistrict}
        onVerified={onVerified}
        onMinRating={onMinRating}
      />
    </div>
  );
}
