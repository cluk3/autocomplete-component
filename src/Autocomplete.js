import React, { Component } from "react";
import PropTypes from "prop-types";

class Autocomplete extends Component {
  static propTypes = {
    fetchSuggestions: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      inputText: "",
      suggestions: [],
      showSuggestions: false,
    };
  }

  onChange = (e) => {
    const { value } = e.currentTarget;

    const fetchSuggestionCall = this.props.fetchSuggestions(value);

    this.latestFetchCall = fetchSuggestionCall;
    fetchSuggestionCall.then((suggestions) => {
      // We want only the result from the latest fetch in order to avoid race conditions
      if (fetchSuggestionCall === this.latestFetchCall)
        this.setState({
          suggestions,
          showSuggestions: true,
        });
    });

    this.setState({
      inputText: value,
    });
  };

  render() {
    const { inputText, suggestions, showSuggestions } = this.state;

    return (
      <>
        <input type="text" value={inputText} onChange={this.onChange} />
        <ul>
          {showSuggestions && suggestions.map((s) => <li key={s}>{s}</li>)}
        </ul>
      </>
    );
  }
}

export default Autocomplete;
