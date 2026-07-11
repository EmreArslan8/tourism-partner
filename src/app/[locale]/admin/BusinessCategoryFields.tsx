"use client";

import { useState } from "react";
import Field from "@/components/common/Field";
import { CATEGORY_GROUPS } from "@/lib/categories";
import type { GroupKey } from "@/lib/types";

const BusinessCategoryFields = ({
  initialGroup,
  initialType,
  inputClassName,
}: {
  initialGroup: GroupKey;
  initialType: string;
  inputClassName: string;
}) => {
  const [group, setGroup] = useState<GroupKey>(initialGroup);
  const [type, setType] = useState(initialType);
  const selectedGroup = CATEGORY_GROUPS.find((item) => item.key === group) ?? CATEGORY_GROUPS[0];

  return (
    <div className="grid grid-cols-2 gap-3 max-[620px]:grid-cols-1">
      <Field label="Grup" required>
        <select
          name="group"
          value={group}
          className={inputClassName}
          onChange={(event) => {
            const nextGroup = event.target.value as GroupKey;
            const nextCategory = CATEGORY_GROUPS.find((item) => item.key === nextGroup) ?? CATEGORY_GROUPS[0];
            setGroup(nextCategory.key);
            setType(nextCategory.children[0]?.label ?? "");
          }}
        >
          {CATEGORY_GROUPS.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
        </select>
      </Field>
      <Field label="Tür" required>
        <select name="type" value={type} className={inputClassName} onChange={(event) => setType(event.target.value)}>
          {selectedGroup.children.map((item) => <option key={item.slug} value={item.label}>{item.label}</option>)}
        </select>
      </Field>
    </div>
  );
};

export default BusinessCategoryFields;
