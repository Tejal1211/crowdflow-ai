import { test, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Navbar from "../components/layout/Navbar";

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

test("Navbar renders logo and navigation links", () => {
  renderWithRouter(<Navbar />);

  expect(screen.getByText("CrowdFlow AI")).toBeInTheDocument();
  expect(screen.getByText("Features")).toBeInTheDocument();
  expect(screen.getByText("How It Works")).toBeInTheDocument();
  expect(screen.getByText("About")).toBeInTheDocument();
});

test("Navbar mobile menu toggles correctly", () => {
  renderWithRouter(<Navbar />);

  const toggleButton = screen.getByLabelText("Open navigation menu");
  expect(toggleButton).toBeInTheDocument();

  // Open menu
  fireEvent.click(toggleButton);
  expect(screen.getByLabelText("Close navigation menu")).toBeInTheDocument();

  // Close menu
  fireEvent.click(screen.getByLabelText("Close navigation menu"));
  expect(screen.getByLabelText("Open navigation menu")).toBeInTheDocument();
});

test("Navbar closes mobile menu on Escape key", () => {
  renderWithRouter(<Navbar />);

  const toggleButton = screen.getByLabelText("Open navigation menu");
  fireEvent.click(toggleButton);

  expect(screen.getByLabelText("Close navigation menu")).toBeInTheDocument();

  // Press Escape
  fireEvent.keyDown(document, { key: "Escape" });
  expect(screen.getByLabelText("Open navigation menu")).toBeInTheDocument();
});