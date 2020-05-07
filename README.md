# React autocomplete component (take home test)

You can find a [live example here](https://loving-hoover-26c22d.netlify.app/)

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Test track

> Please prepare an auto-complete component in React:
>
> 1. You cannot use any 3rd party libraries - only pure React and internal DOM functions

✅

> 2. The function to filter the data should be asynchronous. You can use mock data (such as a JSON array), but the function which uses it should be asynchronous (similar to a real REST call)

✅ check `src/fetchCountries.js`

> 3. It should have basic working CSS. No need for anything fancy (such as drop-shadows etc), but should look decent

✅

> 4. You need to handle all non-standard/edge use-cases - it should have a perfect user-experience

I think I did, I'm handling a11y, keyboard navigation, lost of focus, error management, no suggestions and race conditions issues. I'm discussing what I didn't handle in [this section](#what-could-be-improved)

> 5. Bonus points if you highlight the matching part of the text and not only showing it

✅

> 6. Should use plain JS, not TS

✅

> 7. No external state management libraries (refer to #1 as well), only native React methods

✅

> 8. Use only class components, feel free to use life-cycle methods if you need

✅

> 9. Shortcuts and hacks are perfectly ok - BUT you have to add comments on what are you doing there and why. You should either write production ready code or include comments on what needs to be changed for production

I added some comments in the code, but also check the sections below.

## Component design

The component is by design not fully customizable as it would increase the complexity, also it was not mentioned in the test track, so I choose a KISS approach. Anyway in the section below I'm covering what can be done to improve the component.
I'm assuming the API returning the suggestions is also returning data about which parts of the text are matching.
This is because the matching of the text is strictly related to the algorithm used for matching (naive, fuzzy, regex, etc.) and the component should make no assumptions about it.
Also, I decided to show an error message and a message in case there are no suggestions.
This really depends on use cases and personal preferences, it would be a acceptable UX also to show nothing.

## What could be improved

- It's not fully customizable, using the render props pattern it could be possible to let the component consumer specify how to render the suggestions list and even the input itself
- The styles are relying on classes, if not using the render props pattern, it could be possible to accept a `styles` prop (object or function) and offering the consumer the opportunity to override the styles without having to rely on classes.
- It could detect wheter the suggestions list should render below or above the input based on the position on the input on the page, i.e. if the input is at the bottom of the viewport, the list should render above it.
- The scrolling with keyboard logic is based on the hardcoded height of the list and list elements and can be greatly improved.
- Customize the error/no suggestions messages, or add a configuration prop so the consumer can choose whether to show the messages or not with bool flag. With a render props pattern there would be no necessity for the config prop.
