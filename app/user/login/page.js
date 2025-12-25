import { Suspense } from "react";
import LoginClient from "./LoginClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading order...</div>}>
      <LoginClient />
    </Suspense>
  );
}
