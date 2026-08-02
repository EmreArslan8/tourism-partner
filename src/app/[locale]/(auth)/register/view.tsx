import AuthShell from "@/components/auth/AuthShell";
import RegisterForm from "./RegisterForm";

/* ?ref=<temsilci> ile gelen ziyaretçide referans alanı hazır dolu gelsin diye
   değer sunucudan prop olarak iniyor — istemcide efektle doldurmak hidrasyon
   uyuşmazlığı ve gereksiz render doğuruyordu. */
const RegisterPageView = ({ referral }: { referral?: string }) => (
  <AuthShell>
    <RegisterForm defaultReferral={referral} />
  </AuthShell>
);

export default RegisterPageView;
