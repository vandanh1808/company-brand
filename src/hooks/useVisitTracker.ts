"use client";

import { useEffect, useRef } from "react";

export default function useSiteVisit() {
  const postedRef = useRef(false);

  useEffect(() => {
    const key = "visited:site"; // 1 lần/phiên cho toàn site
    if (sessionStorage.getItem(key)) return;
    if (postedRef.current) return;
    postedRef.current = true;

    fetch("/api/visits", { method: "POST" })
      .then(() => sessionStorage.setItem(key, "1"))
      .catch(() => {
        postedRef.current = false; // cho phép thử lại nếu muốn
      });
  }, []);
}
