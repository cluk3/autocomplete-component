import countries from "./countries.json";

export default function fetchCountries(search) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!search) {
        const result = countries.map((c) => ({
          suggestion: c,
        }));
        return resolve(result);
      }
      const lowerCaseSearch = search.toLowerCase();
      const result = countries
        .filter((country) => country.toLowerCase().includes(lowerCaseSearch))
        .map((country) => {
          const matchStartIndex = country
            .toLowerCase()
            .indexOf(lowerCaseSearch);
          const matchEndIndex = matchStartIndex + lowerCaseSearch.length;
          return {
            suggestion: country,
            tokens: [
              {
                content: country.slice(0, matchStartIndex),
                matches: false,
              },
              {
                content: country.slice(matchStartIndex, matchEndIndex),
                matches: true,
              },
              {
                content: country.slice(matchEndIndex),
                matches: false,
              },
            ].filter((x) => x.content),
          };
        });
      resolve(result);
    }, Math.random() * 1000);
  });
}
