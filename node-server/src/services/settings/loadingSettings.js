const fs = require('fs');
const yaml = require('yaml');

var settings_ = null;

function loadSettings() {
    if (settings_) {
        return settings_;
    }
    const file = fs.readFileSync('./settings.yml', 'utf8');
    const settings = yaml.parse(file);
    settings_ = settings
    return settings;
}
 

module.exports = { loadSettings };