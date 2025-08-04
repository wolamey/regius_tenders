import React from "react";


function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}


export function Highlight({ text = "", highlight = "" }) {
  if (!highlight.trim()) {
    return <>{text}</>;
  }

  const escaped = escapeRegExp(highlight);
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <span key={index} className="bg-yellow-300/40 ">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
}
