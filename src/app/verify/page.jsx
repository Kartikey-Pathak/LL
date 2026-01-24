import { Suspense } from "react";
import Verify from "@/components/VerifyComponent";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Verify />
    </Suspense>
  );
}
