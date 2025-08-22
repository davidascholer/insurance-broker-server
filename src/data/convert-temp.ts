import fs from "fs";

const convertAgeToNumber = (age: string) => {
  if (age === "6 weeks to 11 months") {
    return 42;
  } else if (age === "1 year old") {
    return 365;
  } else if (age === "2 years old") {
    return 730;
  } else if (age === "3 years old") {
    return 1095;
  } else if (age === "4 years old") {
    return 1460;
  } else if (age === "5 years old") {
    return 1825;
  } else if (age === "6 years old") {
    return 2190;
  } else if (age === "7 years old") {
    return 2555;
  } else if (age === "8 years old") {
    return 2920;
  } else if (age === "9 years old") {
    return 3285;
  } else if (age === "10 years old") {
    return 3650;
  } else if (age === "11 years old") {
    return 4015;
  } else if (age === "12 years old") {
    return 4380;
  } else if (age === "13 years old") {
    return 4745;
  } else if (age === "14 years old") {
    return 5110;
  } else if (age === "15 years old") {
    return 5475;
  } else if (age === "16 years old") {
    return 5840;
  } else if (age === "17 years old") {
    return 6205;
  } else if (age === "18 years old") {
    return 6570;
  } else if (age === "19 years old") {
    return 6935;
  } else {
    return 7300;
  }
};

(async () => {
  const q = fs.readFileSync("src/data/fetch.json", "utf8");
  const qParsed = JSON.parse(q);
  const quotes = qParsed.fetch;

  const newQuotes: Array<{ [key: string]: any }> = [];
  for (const quote of quotes) {
    newQuotes.push({
      ...quote,
      weight: Number(quote.weight),
      age: convertAgeToNumber(quote.age),
    });
  }

  const newObj = { fetch: newQuotes };
  fs.writeFileSync("src/data/fetch2.json", JSON.stringify(newObj));
  
})();
