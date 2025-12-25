"use client"
import React from "react";
import DataWrapper from "./DataWrapper";
import { SessionProvider } from "next-auth/react";

const SessionWrapper = ({ children }) => {
  return (
    <SessionProvider>
      <DataWrapper>{children}</DataWrapper>
    </SessionProvider>
  );
};

export default SessionWrapper;
