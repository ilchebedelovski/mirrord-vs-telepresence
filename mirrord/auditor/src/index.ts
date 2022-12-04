import * as morgan from 'morgan';
import * as express from 'express';
import * as bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json({ strict: true }));
app.use(morgan('tiny'));

app.post('/audit', (req, res) => {
  console.log(req.body);

  res.status(200).send();
});

const port = parseInt(process.env.PORT ?? '3000');
const address = process.env.ADDRESS ?? '0.0.0.0';

const server = app.listen(port, address, () => {
  const address = server.address();

  console.log('Listening on', typeof address === 'string' ? address : `${address.address}:${address.port}`);
});