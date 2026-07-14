"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRegions } from "@/lib/geo";
import { PartnerPanelSelect } from "../_ui";
import styles from "../styles";

export default function RequestRegionFields({
  defaultCountry,
  defaultCity,
  defaultDistrict,
}: {
  defaultCountry: string;
  defaultCity: string;
  defaultDistrict: string;
}) {
  const tq = useTranslations("quote");
  const t = useTranslations("panel");
  const [country, setCountry] = useState(defaultCountry || "Türkiye");
  const [city, setCity] = useState(defaultCity || "");
  const [district, setDistrict] = useState(defaultDistrict || "");
  const { countries, cities, districts } = useRegions(country, city, district);

  return (
    <div className="grid grid-cols-3 gap-2.5 max-[720px]:grid-cols-1">
      <label className={styles.labelCls}>
        {tq("country")}
        <PartnerPanelSelect
          name="country"
          value={country}
          onChange={(event) => {
            setCountry(event.target.value);
            setCity("");
            setDistrict("");
          }}
        >
          <option value="">{t("countryPlaceholder")}</option>
          {countries.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </PartnerPanelSelect>
      </label>
      <label className={styles.labelCls}>
        {tq("city")}
        <PartnerPanelSelect
          name="city"
          value={city}
          disabled={!country}
          onChange={(event) => {
            setCity(event.target.value);
            setDistrict("");
          }}
        >
          <option value="">{country ? t("cityPlaceholder") : t("countryFirst")}</option>
          {cities.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </PartnerPanelSelect>
      </label>
      <label className={styles.labelCls}>
        {tq("district")}
        <PartnerPanelSelect
          name="district"
          value={district}
          disabled={!city}
          onChange={(event) => setDistrict(event.target.value)}
        >
          <option value="">{city ? t("districtPlaceholder") : t("cityFirst")}</option>
          {districts.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </PartnerPanelSelect>
      </label>
    </div>
  );
}
