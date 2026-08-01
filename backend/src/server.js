const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const app = require('./app');

const port = Number(process.env.PORT) || 33000;

app.listen(port, () => {
  console.log(`Waste2Wings API listening on port ${port}`);
});
