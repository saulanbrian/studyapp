import React, { Suspense } from "react";

export default function withSuspense<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> {
  return (props) => {
    return (
      <Suspense>
        <Component {...(props as P)} />
      </Suspense>
    )
  }
}
