import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset({
  tsconfig: "./tsconfig.test.json",
}).transform;

/** @type {import("jest").Config} **/
export default {
  testEnvironment: "jsdom",
  transform: {
    ...tsJestTransformCfg,
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/src/__mocks__/fileMock.js",
  },
};
