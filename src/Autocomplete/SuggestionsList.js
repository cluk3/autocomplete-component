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
            <p>{tokens ? renderTokens(tokens) : suggestion}</p>
          </li>
        ))
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
