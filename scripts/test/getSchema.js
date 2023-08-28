const fs = require('fs');


const bridgeSchemaData = fs.readFileSync('bridge-schema.json', 'utf-8');
const bridgeSchema = JSON.parse(bridgeSchemaData);


const confSchemaData = fs.readFileSync('conf-schema.json', 'utf-8');
const confSchema = JSON.parse(confSchemaData);


console.log(bridgeSchema); 
console.log(confSchema);   

