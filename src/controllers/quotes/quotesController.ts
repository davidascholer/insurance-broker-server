import figoData from "../../data/figo.json" assert { type: "json" };
import fetchData from "../../data/fetch.json" assert { type: "json" };
import embraceData from "../../data/embrace.json" assert { type: "json" };

export const getEmbraceData = async (req, res) => {
  const embraceObj = Array.isArray(embraceData.embrace)
    ? embraceData.embrace.filter(
        (obj) =>
          obj.animal === req.body.animal && obj.weight === req.body.weight
      )
    : [];
  res.send({
    data: embraceObj,
  });
};

export const getEmbraceFallbackData = async (req, res) => {
  // Temp validation
  let tempWeight = 0;
  if (req.body.animal === "cat") {
    tempWeight = 10;
  } else {
    // Embrace specific weight ranges mapped to cached data weights
    if (req.body.weight <= 10) tempWeight = 5;
    else if (req.body.weight <= 30) tempWeight = 25;
    else if (req.body.weight <= 50) tempWeight = 45;
    else if (req.body.weight <= 80) tempWeight = 65;
    else tempWeight = 95;
  }
  let tempAge = 0;
  const age = req.body.age.value;
  tempAge = 0;
  if (age < 49) {
    tempAge = 0; // 0 - 6 weeks
  } else if (age < 365) {
    tempAge = 49; // 6 weeks - 12 months old
  } else if (age < 730) {
    tempAge = 365; // 1 year old";
  } else if (age < 1095) {
    tempAge = 730; // 2 years old, etc.
  } else if (age < 1460) {
    tempAge = 1095;
  } else if (age < 1825) {
    tempAge = 1460;
  } else if (age < 2190) {
    tempAge = 1825;
  } else if (age < 2555) {
    tempAge = 2190;
  } else if (age < 2920) {
    tempAge = 2555;
  } else if (age < 3285) {
    tempAge = 2920;
  } else if (age < 3650) {
    tempAge = 3285;
  } else if (age < 4015) {
    tempAge = 3650;
  } else if (age < 4380) {
    tempAge = 4015;
  } else if (age < 4745) {
    tempAge = 4380;
  } else if (age < 5110) {
    tempAge = 4745;
  } else if (age < 5475) {
    tempAge = 5110;
  } else if (age >= 5475) {
    tempAge = 5475;
  } else {
    tempAge = 730; // Default to 2 years old if age is not recognized;
  }

  const embraceObj = embraceData.embrace.find(
    (obj) =>
      obj.animal === req.body.animal &&
      obj.weight === tempWeight &&
      obj.age === tempAge
  );

  res.send({
    data: embraceObj,
  });
};

export const getFigoFallbackData = async (req, res) => {
  // Temp validation
  let tempWeight = 0;
  if (req.body.animal === "cat") {
    tempWeight = 10;
  } else {
    // Figo specific weight ranges mapped to cached data weights
    if (req.body.weight <= 10) tempWeight = 5;
    else if (req.body.weight <= 30) tempWeight = 25;
    else if (req.body.weight <= 50) tempWeight = 45;
    else if (req.body.weight <= 80) tempWeight = 65;
    else tempWeight = 95;
  }

  let parsedAge = 0;
  const age = req.body.age.value;
  parsedAge = 0;
  if (age < 56) {
    parsedAge = 0; // under 8 weeks
  } else if (age < 365) {
    parsedAge = 56; // 6 weeks - 12 months old
  } else if (age < 730) {
    parsedAge = 365; // 1 year old";
  } else if (age < 1095) {
    parsedAge = 730; // 2 years old, etc.
  } else if (age < 1460) {
    parsedAge = 1095;
  } else if (age < 1825) {
    parsedAge = 1460;
  } else if (age < 2190) {
    parsedAge = 1825;
  } else if (age < 2555) {
    parsedAge = 2190;
  } else if (age < 2920) {
    parsedAge = 2555;
  } else if (age < 3285) {
    parsedAge = 2920;
  } else if (age < 3650) {
    parsedAge = 3285;
  } else if (age < 4015) {
    parsedAge = 3650;
  } else if (age < 4380) {
    parsedAge = 4015;
  } else if (age < 4745) {
    parsedAge = 4380;
  } else if (age < 5110) {
    parsedAge = 4745;
  } else if (age < 5475) {
    parsedAge = 5110;
  } else if (age < 5840) {
    parsedAge = 5475;
  } else if (age < 6205) {
    parsedAge = 5840;
  } else if (age < 6570) {
    parsedAge = 6205;
  } else if (age < 6935) {
    parsedAge = 6570;
  } else if (age < 7300) {
    parsedAge = 6935;
  } else if (age < 7665) {
    parsedAge = 7300;
  } else if (age < 8030) {
    parsedAge = 7665;
  } else if (age < 8395) {
    parsedAge = 8030;
  } else if (age >= 8395) {
    parsedAge = 8395;
  } else {
    parsedAge = 730; // Default to 2 years old if age is not recognized;
  }

  const figoObj = figoData.figo.find(
    (obj) =>
      obj.animal === req.body.animal &&
      obj.weight === tempWeight &&
      obj.age === parsedAge
  );
  res.send({
    data: figoObj,
  });
};

export const getFetchFallbackData = async (req, res) => {
  // Temp validation
  let parsedWeight = 0;
  // Fetch specific weight ranges mapped to cached data weights
  if (req.body.animal === "cat") {
    parsedWeight = 10;
  } else {
    // Dog
    if (req.body.weight <= 22) parsedWeight = 20;
    else if (req.body.weight <= 70) parsedWeight = 50;
    else parsedWeight = 90;
  }

  let parsedAge = 0;
  const age = req.body.age.value;
  parsedAge = 0;
  if (age < 42) {
    parsedAge = 0; // under 6 weeks
  } else if (age < 365) {
    parsedAge = 42; // 6 weeks - 12 months old
  } else if (age < 730) {
    parsedAge = 365; // 1 year old";
  } else if (age < 1095) {
    parsedAge = 730; // 2 years old, etc.
  } else if (age < 1460) {
    parsedAge = 1095;
  } else if (age < 1825) {
    parsedAge = 1460;
  } else if (age < 2190) {
    parsedAge = 1825;
  } else if (age < 2555) {
    parsedAge = 2190;
  } else if (age < 2920) {
    parsedAge = 2555;
  } else if (age < 3285) {
    parsedAge = 2920;
  } else if (age < 3650) {
    parsedAge = 3285;
  } else if (age < 4015) {
    parsedAge = 3650;
  } else if (age < 4380) {
    parsedAge = 4015;
  } else if (age < 4745) {
    parsedAge = 4380;
  } else if (age < 5110) {
    parsedAge = 4745;
  } else if (age < 5475) {
    parsedAge = 5110;
  } else if (age < 5840) {
    parsedAge = 5475;
  } else if (age < 6205) {
    parsedAge = 5840;
  } else if (age < 6570) {
    parsedAge = 6205;
  } else if (age < 6935) {
    parsedAge = 6570;
  } else if (age < 7300) {
    parsedAge = 6935;
  } else if (age >= 7300) {
    parsedAge = 7300;
  } else {
    parsedAge = 730; // Default to 2 years old if age is not recognized;
  }

  const fetchObj = fetchData.fetch.find(
    (obj) =>
      obj.animal === req.body.animal &&
      obj.weight === parsedWeight &&
      obj.age === parsedAge
  );

  res.send({
    data: fetchObj,
  });
};
