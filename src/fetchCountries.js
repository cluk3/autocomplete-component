import countries from "./countries.json";

export default function fetchCountries(search = "") {
  return new Promise((resolve) => {
    setTimeout(() => {
      const result = countries.filter((country) =>
        country.toLowerCase().includes(search.toLowerCase())
      );
      resolve(result);
    }, Math.random() * 1000);
  });
}
