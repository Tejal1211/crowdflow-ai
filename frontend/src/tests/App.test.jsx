import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";

test("App renders with loading state", async () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );

  // Check for loading spinner initially
  const spinner = document.querySelector('.animate-spin');
  expect(spinner).toBeInTheDocument();
});
