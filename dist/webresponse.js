"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
class WebResponse {
    constructor(response, opts) {
        this._output = '';
        this._response = response;
        if (opts.templatePath) {
            this._output = fs.readFileSync(opts.templatePath, 'utf8');
        }
        else if (opts.input) {
            this._output = opts.input;
        }
    }
    static createFromTemplate(response, templatePath) {
        return new WebResponse(response, { templatePath: templatePath });
    }
    ;
    static createFromInput(response, input) {
        return new WebResponse(response, { input: input });
    }
    ;
    replace(key, value) {
        this._output = this._output.replace('${' + key + '}', value);
        return this;
    }
    parse(replace) {
        for (let key in replace) {
            this.replace(key, replace[key]);
        }
        return this;
    }
    send(replace) {
        if (typeof replace != 'undefined') {
            this.parse(replace);
        }
        this._response.end(this._output);
        return this;
    }
}
exports.WebResponse = WebResponse;
//# sourceMappingURL=webresponse.js.map