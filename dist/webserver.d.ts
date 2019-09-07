import * as http from 'http';
export declare class WebServer {
    private _httpPort;
    private _server;
    readonly isListening: boolean;
    httpPort: number;
    constructor(requestHandler: (request: http.ServerRequest, response: http.ServerResponse) => void);
    listen(port?: number): Promise<void>;
    close(): Promise<void>;
}
