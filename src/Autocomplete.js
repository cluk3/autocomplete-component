import React, { Component } from "react";
import PropTypes from "prop-types";

class Autocomplete extends Component {
  static propTypes = {
    fetchSuggestions: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
  };

  static defaultProps = {
    placeholder: "Click me to see suggestions",
  };

  constructor(props) {
    super(props);

    this.state = {
      inputText: "",
      suggestions: [],
      showSuggestions: false,
      isPristine: true,
    };
  }

  onFocus = () => {
    if (this.state.isPristine) {
      this.handleFetchSuggestions();
      this.setState({ isPristine: false });
    } else {
      this.setState({ showSuggestions: true });
    }
  };

  onBlur = () => {
    this.setState({ showSuggestions: false });
  };

  handleFetchSuggestions = (input) => {
    const fetchSuggestionCall = this.props.fetchSuggestions(input);

    this.latestFetchCall = fetchSuggestionCall;
    fetchSuggestionCall.then((suggestions) => {
      // We want only the result from the latest fetch in order to avoid race conditions
      if (fetchSuggestionCall === this.latestFetchCall)
        this.setState({
          suggestions,
          showSuggestions: true,
        });
    });
  };

  onChange = (e) => {
    const inputText = e.currentTarget.value;

    this.handleFetchSuggestions(inputText);

    this.setState({
      inputText,
    });
  };

  render() {
    const { inputText, suggestions, showSuggestions } = this.state;

    return (
      <div onFocus={this.onFocus} tabIndex="-1">
        <input
          type="text"
          placeholder={this.props.placeholder}
          value={inputText}
          onChange={this.onChange}
        />
        {showSuggestions && (
          <SuggestionsList
            suggestions={suggestions}
            handleSuggestionClick={() => {}}
          />
        )}
      </div>
    );
  }
}

export const SuggestionsList = ({ suggestions, handleSuggestionClick }) => {
  return (
    <ul>
      {suggestions.length > 0 ? (
        suggestions.map(({ suggestion, tokens }) => (
          <li
            data-testid="suggestion"
            key={suggestion}
            onClick={handleSuggestionClick}
          >
            {tokens
              ? tokens.map(({ matches, content }, index) =>
                  matches ? (
                    <span key={index} style={{ backgroundColor: "yellow" }}>
                      {content}
                    </span>
                  ) : (
                    <span key={index}>{content}</span>
                  )
                )
              : suggestion}
          </li>
        ))
      ) : (
        <li>No suggestions are available</li>
      )}
    </ul>
  );
};

export default Autocomplete;
