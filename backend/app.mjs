import 'dotenv/config'
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';
import document_json_routes from './routes/document_json_routes.mjs';

const app = express();
const port = process.env.PORT || 1337;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', document_json_routes);

app.use(express.static(path.join(process.cwd(), 'my-frontend/dist')));

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

export default app;
