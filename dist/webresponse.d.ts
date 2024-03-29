import * as http from 'http';
export declare class WebResponse {
    private _response;
    private _output;
    static createFromTemplate(response: http.ServerResponse, templatePath: string): WebResponse;
    static createFromInput(response: http.ServerResponse, input: string): WebResponse;
    private constructor();
    replace(key: string, value: string): WebResponse;
    parse(replace: {
        [key: string]: string;
    }): WebResponse;
    send(replace?: {
        [key: string]: string;
    }): WebResponse;
}
