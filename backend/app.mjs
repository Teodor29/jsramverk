import 'dotenv/config'
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import docs_routes from './routes/docs_routes.mjs';

const app = express();
const port = process.env.PORT || 1337;

app.use(cors());
app.use(express.json());

app.use('/api', docs_routes);


// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
    app.listen(port, () => console.log(`Server running on ${port}`));
}

export default app;
