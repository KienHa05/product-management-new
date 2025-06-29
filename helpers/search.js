const removeDiacritics = require("./normalize");

module.exports = (query) => {
  const objectSearch = {
    keyword: "",
    regex: ""
  };

  if (query.keyword) {
    objectSearch.keyword = query.keyword;

    const keywordUnsigned = removeDiacritics(query.keyword.trim().toLowerCase());
    const words = keywordUnsigned.split(/\s+/).filter(Boolean);
    const pattern = words.map(w => `(?=.*${w})`).join("") + ".*";

    objectSearch.regex = new RegExp(pattern, "i");
  }

  return objectSearch;
};
