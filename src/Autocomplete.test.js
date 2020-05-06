import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Autocomplete from "./Autocomplete";
// As this is already a mocked fetch, I can use it for testing too!
import fetchCountries from "./fetchCountries";
import countries from "./countries.json";

describe("Autocomplete component", () => {
  it("renders properly", () => {
    const { getByPlaceholderText } = render(
      <Autocomplete fetchSuggestions={fetchCountries} />
    );
    const inputElement = getByPlaceholderText("Click me to see suggestions");
    expect(inputElement).toBeInTheDocument();
  });

  it("shows all the results when input is focused for the first time", async () => {
    const { findAllByTestId, getByPlaceholderText } = render(
      <Autocomplete
        fetchSuggestions={fetchCountries}
        placeholder="Country Name"
      />
    );
    getByPlaceholderText("Country Name").focus();
    const suggestions = await findAllByTestId("suggestion");

    expect(suggestions.length).toBe(countries.length);
  });

  it("shows proper results when the user types", async () => {
    const { findByText, getByPlaceholderText } = render(
      <Autocomplete
        fetchSuggestions={fetchCountries}
        placeholder="Country Name"
      />
    );
    const inputElement = getByPlaceholderText("Country Name");
    fireEvent.change(inputElement, { target: { value: "ita" } });

    // no need to expect, findByText throws if it doesn't find any result
    findByText("Italy");
  });

  it("shows a user friendly message when no suggestions are available", async () => {});
  it("shows a user friendly error message when fetch rejects", async () => {});
});
