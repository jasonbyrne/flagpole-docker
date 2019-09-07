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
const fs = require("fs-extra");
const http = require("http");
const unzipper = require("unzipper");
const child_process_1 = require("child_process");
const createFolder = (folderPath) => {
    return new Promise((resolve, reject) => {
        fs.ensureDir(folderPath)
            .then(() => {
            resolve();
        })
            .catch(err => {
            reject(err);
        });
    });
};
const download = (uri, folderPath) => {
    return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
        const path = `${folderPath}/flagpole.zip`;
        yield createFolder(folderPath);
        const file = fs.createWriteStream(path);
        http.get(uri, function (response) {
            response.pipe(file);
            console.log(`Downloaded ${uri}`);
            resolve(path);
        });
    }));
};
const unzip = (zipFile, folderPath) => {
    return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
        fs.createReadStream(zipFile)
            .pipe(unzipper.Extract({ path: `${folderPath}` }))
            .on('close', () => {
            console.log(`Unzipped ${zipFile} to ${folderPath}`);
            resolve();
        });
    }));
};
const execute = (suite, env, folderPath) => {
    return new Promise(resolve => {
        let data = [];
        const argString = `run -s ${suite} -e ${env} -o json -h`;
        const cwd = process.cwd();
        console.log(`Execute: flagpole ${argString}`);
        process.chdir(folderPath);
        const flagpoleProcess = child_process_1.spawn(`flagpole`, argString.split(' '));
        process.chdir(cwd);
        flagpoleProcess.stdout.on('data', (line) => {
            data.push(line);
        });
        flagpoleProcess.stderr.on('data', (line) => {
            data.push(line);
        });
        flagpoleProcess.on('close', (code) => {
            resolve(data.join("/n"));
        });
    });
};
const deleteFolder = (folderPath) => __awaiter(this, void 0, void 0, function* () {
    console.log(`Empty contents of ${folderPath}`);
    yield fs.emptyDir(folderPath);
    console.log(`Removing folder ${folderPath}`);
    yield fs.remove(folderPath);
});
exports.downloadAndRun = (uri, suite, env, folderPath) => {
    return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
        console.log(`Download ${uri} and unzip to ${folderPath}`);
        const zipFile = yield download(uri, folderPath);
        yield unzip(zipFile, folderPath);
        const output = yield execute(suite, env, folderPath);
        yield deleteFolder(folderPath);
        resolve(output);
    }));
};
//# sourceMappingURL=download.js.map