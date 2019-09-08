# flagpole-docker

This is not secure, but is a working proof of concept. Installs Flagpole and runs an Express web server. 

Incoming request gives it the URL of a zip file with the Flagpole tests, passed in with the `uri` query string. `suite` and `env` query string params must also be passed in.

It will download the zip, extract it, run the selected suite, and then remove the folder.

Puppeteer will fail if not running headless.
