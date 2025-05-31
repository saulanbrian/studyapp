import React from "react";

export default function renderWhen<P extends object, TData>(
  Component: React.ComponentType<P>,
  data: TData | undefined
): React.FC<P> {
  return (props) => {
    if (!data) return null
    return <Component {...(props) as P} />
  }
}
