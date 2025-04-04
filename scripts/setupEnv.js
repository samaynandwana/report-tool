const fs = require('fs');
const path = require('path');

const createEnvFile = (templatePath, outputPath) => {
  if (fs.existsSync(outputPath)) {
    console.log(`${outputPath} already exists, skipping...`);
    return;
  }

  fs.copyFileSync(templatePath, outputPath);
  console.log(`Created ${outputPath}`);
};

// Setup client environment
createEnvFile(
  path.join(__dirname, '../client/.env.example'),
  path.join(__dirname, '../client/.env')
);

// Setup server environment
createEnvFile(
  path.join(__dirname, '../server/.env.example'),
  path.join(__dirname, '../server/.env')
);

console.log('\nEnvironment files created successfully!');
console.log('\nPlease update the .env files with your configuration values.'); 