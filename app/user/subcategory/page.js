import { Suspense } from "react";
import SubCategoryPage from "./SubcategoryClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading order...</div>}>
      <SubCategoryPage />
    </Suspense>
  );
}