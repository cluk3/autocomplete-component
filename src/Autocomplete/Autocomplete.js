import React, { Component } from "react";
import PropTypes from "prop-types";
import { KEY_CODES } from "../constants";
import SuggestionsList from "./SuggestionsList";
import "./Autocomplete.css";

const getUniqueId = () => Math.floor(Math.random() * 100000); // naive way to get a uniqueId

class Autocomplete extends Component {
  static propTypes = {
    fetchSuggestions: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    label: PropTypes.string,
    inputId: PropTypes.string,
  };

  static defaultProps = {
    placeholder: "Click me to see suggestions",
    label: "",
    inputId: `autocomplete-${getUniqueId()}`,
  };

  constructor(props) {
    super(props);

    this.state = {
      inputText: "",
      suggestions: [],
      showSuggestions: false,
      activeSuggestionIndex: 0,
      hasError: false,
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
    fetchSuggestionCall
      .then((suggestions) => {
        // We want only the result from the latest fetch in order to avoid race conditions
        if (fetchSuggestionCall === this.latestFetchCall)
          this.setState({
            suggestions,
            showSuggestions: true,
            activeSuggestionIndex: 0,
          });
      })
      .catch((e) => {
        if (fetchSuggestionCall === this.latestFetchCall)
          this.setState({
            hasError: true,
            suggestions: [],
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
    const {
      inputText,
      suggestions,
      showSuggestions,
      activeSuggestionIndex,
      hasError,
    } = this.state;
    const { label, placeholder, inputId } = this.props;

    return (
      <div
        ref={this.containerRef}
        className="autocomplete"
        style={{ height: 0 }} // needed for click outside logic to work
      >
        {label && (
          <label htmlFor={inputId} className="autocomplete__label">
            {label}
          </label>
        )}
        <div className="autocomplete__container">
          <input
            id={inputId}
            type="text"
            placeholder={placeholder}
            autoComplete="off" //disable browser default autocomplete
            aria-autocomplete="list"
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
              hasError={hasError}
            />
          )}
        </div>
      </div>
    );
  }
}

export default Autocomplete;
