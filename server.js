require('dotenv').config();
const app = require('./app');
const { db } = require('./database/config');

db.authenticate()
  .then(() => console.log('Database authenticate'))
  .catch((error) => console.log(error));

db.sync()
  .then(() => console.log('Database Synced'))
  .catch((error) => console.log(error));

const port = process.env.PORT || 3200;
app.listen(port, () => {
  console.log(`App Running on port ${port}`);
});
