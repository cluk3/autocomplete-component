import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Autocomplete from "./Autocomplete";
// As this is already a mocked fetch, I can use it for testing too!
import fetchCountries from "./fetchCountries";
import countries from "./countries.json";

const setup = (placeholder = "Click me to see suggestions") => {
  const utils = render(
    placeholder ? (
      <Autocomplete
        fetchSuggestions={fetchCountries}
        placeholder={placeholder}
      />
    ) : (
      <Autocomplete fetchSuggestions={fetchCountries} />
    )
  );
  const inputElement = utils.getByPlaceholderText(placeholder);
  return {
    ...utils,
    inputElement,
  };
};
describe("Autocomplete component", () => {
  it("renders properly", () => {
    const { inputElement } = setup();
    expect(inputElement).toBeInTheDocument();
  });

  it("shows all the results when input is focused for the first time", async () => {
    const { findAllByTestId, inputElement } = setup("Country Name");
    inputElement.focus();
    const suggestions = await findAllByTestId("suggestion");

    expect(suggestions.length).toBe(countries.length);
  });

  it("shows proper results when the user types", async () => {
    const { findByText, inputElement } = setup("Country Name");

    fireEvent.change(inputElement, { target: { value: "ita" } });

    // no need to expect, findByText throws if it doesn't find any result
    await findByText("Ita");
  });

  it("shows a user friendly message when no suggestions are available", async () => {
    const { findByText, inputElement } = setup("Country Name");

    fireEvent.change(inputElement, { target: { value: "Not a country" } });

    // no need to expect, findByText throws if it doesn't find any result
    await findByText("No suggestions are available");
  });
  it("shows a user friendly error message when fetch rejects", async () => {});
});
