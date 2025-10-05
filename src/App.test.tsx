import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

test("App homepage", async () => {
  // ARRANGE
  render(<App />);

  // ASSERT
  expect(screen.getByRole("heading")).toHaveTextContent("Vite + React");
});
