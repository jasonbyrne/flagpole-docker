"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
class WebServer {
    constructor(requestHandler) {
        this._httpPort = 8080;
        this._server = http.createServer(requestHandler);
    }
    get isListening() {
        return this._server.listening;
    }
    get httpPort() {
        return this._httpPort;
    }
    set httpPort(value) {
        this._httpPort = value;
    }
    listen(port) {
        if (this.isListening) {
            throw new Error('HTTP Server is already listening.');
        }
        return new Promise((resolve, reject) => {
            if (typeof port != 'undefined' && port > 0) {
                this._httpPort = Math.ceil(port);
            }
            this._server.listen(this._httpPort, (err) => {
                if (err) {
                    return reject(`Could not listen on port ${this._httpPort}: ${err}`);
                }
                resolve();
            });
        });
    }
    close() {
        return new Promise((resolve) => {
            if (this.isListening) {
                this._server.close(() => {
                    resolve();
                });
            }
            else {
                resolve();
            }
        });
    }
}
exports.WebServer = WebServer;
//# sourceMappingURL=webserver.js.map