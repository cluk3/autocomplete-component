import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Autocomplete from "./Autocomplete";
// As this is already a mocked fetch, I can use it for testing too!
import fetchCountries from "../fetchCountries";
import countries from "../countries.json";
import { KEY_CODES } from "../constants";

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

    expect(suggestions).toHaveLength(countries.length);
  });

  it("shows proper suggestions when the user types", async () => {
    const { findByText, inputElement } = setup("Country Name");

    fireEvent.change(inputElement, { target: { value: "ita" } });

    await findByText("Ita");
  });

  it("hides suggestions when the user clicks away", async () => {
    const { queryAllByTestId, findByText, inputElement } = setup(
      "Country Name"
    );

    fireEvent.change(inputElement, { target: { value: "ita" } });

    await findByText("Ita");

    fireEvent.mouseDown(document.body);

    expect(queryAllByTestId("suggestion")).toHaveLength(0);
  });

  it("shows a user friendly message when no suggestions are available", async () => {
    const { findByText, inputElement } = setup("Country Name");

    fireEvent.change(inputElement, { target: { value: "Not a country" } });

    await findByText("No suggestions are available");
  });

  it("shows a user friendly error message when fetch rejects", async () => {
    const { getByPlaceholderText, findByText } = render(
      <Autocomplete fetchSuggestions={() => Promise.reject()} />
    );
    const inputElement = getByPlaceholderText("Click me to see suggestions");

    fireEvent.focus(inputElement);

    await findByText("Ooops, something went wrong.");
  });

  describe("Keyboard Navigation", () => {
    it("lets user select a suggestion by pressing enter", async () => {
      const { findByText, inputElement } = setup("Country Name");

      fireEvent.change(inputElement, { target: { value: "it" } });

      await findByText("It");

      fireEvent.keyDown(inputElement, { keyCode: KEY_CODES.DOWN_ARROW });
      fireEvent.keyDown(inputElement, { keyCode: KEY_CODES.DOWN_ARROW });
      fireEvent.keyDown(inputElement, { keyCode: KEY_CODES.ENTER });

      expect(inputElement.value).toBe("Italy");
    });

    it("keeps the index into bounds", async () => {
      const { findByText, inputElement } = setup("Country Name");

      fireEvent.change(inputElement, { target: { value: "it" } });

      await findByText("It");

      fireEvent.keyDown(inputElement, { keyCode: KEY_CODES.DOWN_ARROW });
      fireEvent.keyDown(inputElement, { keyCode: KEY_CODES.UP_ARROW });
      fireEvent.keyDown(inputElement, { keyCode: KEY_CODES.UP_ARROW });
      fireEvent.keyDown(inputElement, { keyCode: KEY_CODES.ENTER });

      // first suggestion in the list
      expect(inputElement.value).toBe("Eritrea");

      fireEvent.change(inputElement, { target: { value: "ita" } });

      await findByText("Ita");

      fireEvent.keyDown(inputElement, { keyCode: KEY_CODES.DOWN_ARROW });
      fireEvent.keyDown(inputElement, { keyCode: KEY_CODES.DOWN_ARROW });
      fireEvent.keyDown(inputElement, { keyCode: KEY_CODES.ENTER });

      // second and last suggestion in the list
      expect(inputElement.value).toBe("Mauritania");
    });
  });
});
