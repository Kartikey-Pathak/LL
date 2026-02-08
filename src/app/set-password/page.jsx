import { Suspense } from "react";
import SetPassword from "@/components/SetPassword";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SetPassword/>
    </Suspense>
  );
}
