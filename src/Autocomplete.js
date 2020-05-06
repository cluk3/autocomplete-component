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
    };

    this.containerRef = React.createRef();
    this.latestFetchCall = null;
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleOutsideClick);
    document.addEventListener("touchstart", this.handleOutsideClick);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleOutsideClick);
    document.removeEventListener("touchstart", this.handleOutsideClick);
  }

  onFocus = () => {
    this.handleFetchSuggestions(this.state.inputText);
  };

  handleOutsideClick = (e) => {
    if (!this.containerRef.current.contains(e.target)) {
      this.setState({ showSuggestions: false });
    }
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
      <div ref={this.containerRef}>
        <input
          type="text"
          placeholder={this.props.placeholder}
          value={inputText}
          onFocus={this.onFocus}
          onChange={this.onChange}
        />
        {showSuggestions && (
          <SuggestionsList
            suggestions={suggestions}
            handleSuggestionClick={(suggestion) => {
              this.setState({ inputText: suggestion, showSuggestions: false });
            }}
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
            onClick={() => handleSuggestionClick(suggestion)}
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
