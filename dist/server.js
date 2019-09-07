"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const download_1 = require("./download");
const randomid_1 = require("./randomid");
const app = express();
const port = 8080;
app.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    const uri = req.query.uri;
    const suite = req.query.suite;
    const env = req.query.env;
    if (uri && suite && env) {
        try {
            const folderName = randomid_1.getRandomId(32);
            const output = yield download_1.downloadAndRun(uri, suite, env, `${process.cwd()}/${folderName}`);
            res.end(output);
        }
        catch (ex) {
            res.end(`{ "error": "${ex}" }`);
        }
    }
    else {
        res.end(`{ "error": "Invalid request" }`);
    }
}));
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map