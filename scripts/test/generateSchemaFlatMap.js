const fs = require("fs");

const filePath = "./bridges.json";
const resultPath = "./result.json";


const regArr = [
  /\.get/,
  /\.put/,
  /bridge\.node_status/,
  /bridge\.metrics/,
  /bridge\.node_metrics/,
];
const removeUselessData = (obj) => {
  const target = obj.components.schemas;
  for (let key in target) {
    if (regArr.some((reg) => reg.test(key))) {
      delete target[key];
    }
  }
  return target;
};

const generatePropsArr = (obj) => {
  const ret = {};
  const keys = Object.keys(obj).sort();
  keys.forEach((key) => {
    const singleLevelSchema = obj[key];
    const { properties } = singleLevelSchema;
    ret[key] = Object.keys(properties).sort();
  });
  return ret;
};

fs.readFile(filePath, "utf-8", (err, data) => {
  if (err) {
    console.log(err);
  } else {
    const obj = JSON.parse(data);
    const ret = generatePropsArr(removeUselessData(obj));
    fs.writeFile(resultPath, JSON.stringify(ret, null, 4), (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("success");
      }
    });
  }
});
