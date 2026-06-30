import { PageHeader } from "../_components";
import ApprovalBoard from "./ApprovalBoard";
import type { AdminBusiness } from "@/lib/types";

interface Props {
  businesses: AdminBusiness[];
  locale: string;
}

const ApprovalsView = ({ businesses, locale }: Props) => {
  return (
    <>
      <PageHeader
        eyebrow="Onay"
        title="Başvurular (Onay Havuzu)"
        description="Tedarikçi ve acente kayıtlarını evraklarıyla inceleyin; onaylayın veya reddedin."
      />
      <ApprovalBoard businesses={businesses} locale={locale} />
    </>
  );
};

export default ApprovalsView;
