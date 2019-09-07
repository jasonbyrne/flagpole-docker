import * as fs from 'fs-extra';
import * as http from 'http';
import * as unzipper from 'unzipper';
import { spawn } from 'child_process';

const createFolder = (folderPath: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        fs.ensureDir(folderPath)
            .then(() => {
                resolve();
            })
            .catch(err => {
                reject(err);
            });
    });
}

const download = (uri: string, folderPath: string): Promise<string> => {
    return new Promise(async resolve => {
        const path: string = `${folderPath}/flagpole.zip`;
        await createFolder(folderPath)
        const file = fs.createWriteStream(path);
        http.get(uri, function (response) {
            response.pipe(file);
            console.log(`Downloaded ${uri}`);
            resolve(path);
        });
    });
}

const unzip = (zipFile: string, folderPath): Promise<void> => {
    return new Promise(async resolve => {
        fs.createReadStream(zipFile)
            .pipe(unzipper.Extract({ path: `${folderPath}` }))
            .on('close', () => {
                console.log(`Unzipped ${zipFile} to ${folderPath}`);
                resolve();
            });
    });
}

const execute = (suite: string, env: string, folderPath: string): Promise<string> => {
    return new Promise(resolve => {
        let data: string[] = [];
        const argString: string = `run -s ${suite} -e ${env} -o json -h`;
        const cwd: string = process.cwd();
        console.log(`Execute: flagpole ${argString}`);
        process.chdir(folderPath);
        const flagpoleProcess = spawn(`flagpole`, argString.split(' '));
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
}

const deleteFolder = async (folderPath: string) => {
    console.log(`Empty contents of ${folderPath}`);
    await fs.emptyDir(folderPath);
    console.log(`Removing folder ${folderPath}`);
    await fs.remove(folderPath);
}

export const downloadAndRun = (uri: string, suite: string, env: string, folderPath: string): Promise<string> => {
    return new Promise(async resolve => {
        console.log(`Download ${uri} and unzip to ${folderPath}`);
        const zipFile: string = await download(uri, folderPath);
        await unzip(zipFile, folderPath);
        const output: string = await execute(suite, env, folderPath);
        await deleteFolder(folderPath);
        resolve(output);
    });
}

