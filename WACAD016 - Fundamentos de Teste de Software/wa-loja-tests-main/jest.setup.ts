import "@testing-library/jest-dom";
import React from "react";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, priority, fetchPriority, ...rest }: any) => {
    return React.createElement("img", { src, alt, ...rest });
  },
}));