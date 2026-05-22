export default [
  {
    "id": "bb001",
    "title": "Walter Gustavo",
    "mood": ["tense", "isolated"],
    "visualTags": ["sunset", "orange", "desert"],
    "extraTags": ["two-characters"],
    "image":
      "./images/walter-gustavo.png"
  }
].map(img => ({
  "show": "Breaking Bad",
  "year": 2008,
  "director": "Vince Gilligan",
  "movieTags": ["drama", "thriller", "crime"],
  ...img,
}));