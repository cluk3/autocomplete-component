import React from "react";
import PropTypes from "prop-types";

export default class SuggestionsList extends React.Component {
  static propTypes = {
    suggestions: PropTypes.arrayOf(
      PropTypes.shape({
        suggestion: PropTypes.string.isRequired,
        tokens: PropTypes.arrayOf(
          PropTypes.shape({
            matches: PropTypes.bool.isRequired,
            content: PropTypes.string.isRequired,
          })
        ),
      }).isRequired
    ),
    handleSuggestionClick: PropTypes.func.isRequired,
    activeSuggestionIndex: PropTypes.number.isRequired,
    setActiveSuggestion: PropTypes.func.isRequired,
    hasError: PropTypes.bool.isRequired,
  };
  constructor(props) {
    super(props);

    this.listRef = React.createRef();
    this.activeSuggestionRef = React.createRef();
  }

  componentDidUpdate() {
    if (!this.activeSuggestionRef.current) return;

    const { activeSuggestionIndex } = this.props;
    const activeSuggestionRect = this.activeSuggestionRef.current.getBoundingClientRect();
    const listRect = this.listRef.current.getBoundingClientRect();

    const relativeYCoord = activeSuggestionRect.top - listRect.top;

    if (
      relativeYCoord < -activeSuggestionRect.height ||
      relativeYCoord > listRect.height
    ) {
      this.listRef.current.scroll({
        top:
          activeSuggestionIndex * activeSuggestionRect.height -
          listRect.height / 2,
        behavior: "smooth",
      });
    }
  }

  render() {
    const {
      suggestions,
      handleSuggestionClick,
      activeSuggestionIndex,
      setActiveSuggestion,
      hasError,
    } = this.props;

    const renderTokens = (tokens) =>
      tokens.map(({ matches, content }, tokenIndex) =>
        matches ? (
          <span key={tokenIndex} className="highlighted">
            {content}
          </span>
        ) : (
          <span key={tokenIndex}>{content}</span>
        )
      );
    return (
      <ul ref={this.listRef} className="suggestions-list" role="listbox">
        {suggestions.length > 0 ? (
          suggestions.map(({ suggestion, tokens }, suggestionIndex) => {
            const isActive = activeSuggestionIndex === suggestionIndex;
            return (
              <li
                {...(isActive ? { ref: this.activeSuggestionRef } : {})}
                aria-selected={isActive}
                role="option"
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
                <div>{tokens ? renderTokens(tokens) : suggestion}</div>
              </li>
            );
          })
        ) : hasError ? (
          <li className="suggestions-list__item suggestions-list__item--error">
            Ooops, something went wrong.
          </li>
        ) : (
          <li className="suggestions-list__item">
            No suggestions are available
          </li>
        )}
      </ul>
    );
  }
}
