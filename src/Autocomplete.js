import React, { Component } from "react";
import PropTypes from "prop-types";
import { KEY_CODES } from "./constants";

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
      activeSuggestionIndex: 0,
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

  onKeyDown = (e) => {
    const { activeSuggestionIndex, suggestions, showSuggestions } = this.state;

    if (!showSuggestions) return;

    switch (e.keyCode) {
      case KEY_CODES.ENTER:
        this.setState({
          showSuggestions: false,
          inputText: suggestions[activeSuggestionIndex].suggestion,
          activeSuggestionIndex: 0,
        });
        break;
      case KEY_CODES.DOWN_ARROW:
        if (activeSuggestionIndex < suggestions.length - 1) {
          this.setState({ activeSuggestionIndex: activeSuggestionIndex + 1 });
        }
        break;
      case KEY_CODES.UP_ARROW:
        if (activeSuggestionIndex > 0) {
          this.setState({ activeSuggestionIndex: activeSuggestionIndex - 1 });
        }
        break;
      default:
        return;
    }
  };

  handleOutsideClick = (e) => {
    if (!this.containerRef.current.contains(e.target)) {
      this.setState({ showSuggestions: false });
    }
  };

  setActiveSuggestion = (index) => {
    this.setState({ activeSuggestionIndex: index });
  };
  handleSuggestionClick = (suggestion) => {
    this.setState({ inputText: suggestion, showSuggestions: false });
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
          activeSuggestionIndex: 0,
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
    const {
      inputText,
      suggestions,
      showSuggestions,
      activeSuggestionIndex,
    } = this.state;

    return (
      <div
        ref={this.containerRef}
        className="autocomplete"
        style={{ height: 0 }} // needed for click outside logic to work
      >
        <input
          type="text"
          placeholder={this.props.placeholder}
          className="autocomplete__input"
          value={inputText}
          onFocus={this.onFocus}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
        />
        {showSuggestions && (
          <SuggestionsList
            suggestions={suggestions}
            activeSuggestionIndex={activeSuggestionIndex}
            setActiveSuggestion={this.setActiveSuggestion}
            handleSuggestionClick={this.handleSuggestionClick}
          />
        )}
      </div>
    );
  }
}

export const SuggestionsList = ({
  suggestions,
  handleSuggestionClick,
  activeSuggestionIndex,
  setActiveSuggestion,
}) => {
  return (
    <ul className="suggestions-list">
      {suggestions.length > 0 ? (
        suggestions.map(({ suggestion, tokens }, suggestionIndex) => (
          <li
            className={`suggestions-list__item${
              activeSuggestionIndex === suggestionIndex
                ? " suggestions-list__item--active"
                : ""
            }`}
            data-testid="suggestion"
            key={suggestion}
            onClick={() => handleSuggestionClick(suggestion)}
            onMouseEnter={() => setActiveSuggestion(suggestionIndex)}
          >
            <p>
              {tokens
                ? tokens.map(({ matches, content }, tokenIndex) =>
                    matches ? (
                      <span key={tokenIndex} className="highlighted">
                        {content}
                      </span>
                    ) : (
                      <span key={tokenIndex}>{content}</span>
                    )
                  )
                : suggestion}
            </p>
          </li>
        ))
      ) : (
        <li className="suggestions-list__item">No suggestions are available</li>
      )}
    </ul>
  );
};

export default Autocomplete;
