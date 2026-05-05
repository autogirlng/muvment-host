"use client";
import { ReactNode, useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "../lib/store";
import { registerClientStore } from "../lib/storeHolder";

export default function StoreProvider({
  children,
}: {
  children: ReactNode;
}) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    storeRef.current = makeStore();
    registerClientStore(storeRef.current);
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
