import fs from 'fs';
import yaml from 'yaml';


var settings_ = null;

export function loadSettings() {
    if (settings_) {
        return settings_;
    }
    const file = fs.readFileSync('./settings.yml', 'utf8');
    const settings = yaml.parse(file);
    settings_ = settings
    return settings;
}
 
 