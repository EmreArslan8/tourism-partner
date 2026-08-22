import { Suspense } from "react";
import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "./LoginForm";

/* LoginForm useSearchParams (?expired=1) okuduğu için <Suspense> sınırı içinde
   render edilir — aksi halde sayfa tamamen client-side render'a düşebilir. */
const LoginPageView = () => (
  <AuthShell>
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  </AuthShell>
);

export default LoginPageView;
