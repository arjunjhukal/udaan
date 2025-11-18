import React from "react";


export function renderHtml(
  html: string,
  className?: string,
  style?: React.CSSProperties
) {
  return (
    <div
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: html }
      }
    />
  );
}
