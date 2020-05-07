import React from "react";

const SuggestionsList = ({
  suggestions,
  handleSuggestionClick,
  activeSuggestionIndex,
  setActiveSuggestion,
  hasError,
}) => {
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
    <ul className="suggestions-list" role="listbox">
      {suggestions.length > 0 ? (
        suggestions.map(({ suggestion, tokens }, suggestionIndex) => {
          const isActive = activeSuggestionIndex === suggestionIndex;
          return (
            <li
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
        <li className="suggestions-list__item">No suggestions are available</li>
      )}
    </ul>
  );
};

export default SuggestionsList;
