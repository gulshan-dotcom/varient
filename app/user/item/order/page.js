import { Suspense } from "react";
import PlaceOrderPage from "./PlaceOrderPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading order...</div>}>
      <PlaceOrderPage />
    </Suspense>
  );
}
