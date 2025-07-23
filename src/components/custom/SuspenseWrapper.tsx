import React, { Suspense } from "react";

const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => {
  return <Suspense fallback={<p>loading...</p>}>{children}</Suspense>;
};

export default SuspenseWrapper;
