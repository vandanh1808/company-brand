"use client";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

export default function GlobalProgressBar() {
  return (
    <ProgressBar
      height="3px"
      color="#2563eb"
      options={{ showSpinner: false }}
      shallowRouting
    />
  );
}
