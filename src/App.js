import React from "react";
import "./App.css";
import Autocomplete from "./Autocomplete/Autocomplete";
import fetchCountries from "./fetchCountries";

function App() {
  return (
    <div className="App">
      <Autocomplete
        fetchSuggestions={fetchCountries}
        placeholder="Country Name"
        label="Country"
      />
    </div>
  );
}

export default App;
