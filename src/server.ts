import * as express from 'express';
import { downloadAndRun } from './download';
import { getRandomId } from './randomid';

const app = express();
const port: number = 8080;

// define a route handler for the default home page
app.get('/', async (req, res) => {
    const uri: string = req.query.uri;
    const suite: string = req.query.suite;
    const env: string = req.query.env;
    if (uri && suite && env) {
        try {
            const folderName: string = getRandomId(32);
            const output: string = await downloadAndRun(uri, suite, env, `${process.cwd()}/${folderName}`);
            res.end(output);
        }
        catch (ex) {
            res.end(`{ "error": "${ex}" }`);
        }
    }
    else {
        res.end(`{ "error": "Invalid request" }`);
    }
});

// start the Express server
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});