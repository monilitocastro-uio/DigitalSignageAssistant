const fs = require('fs');
const path = require('path');

const userFilePath = path.join(__dirname, '../../../data/users.json');

class User {
    static _readFile() {
        try {
            const data = fs.readFileSync(userFilePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
            // If the file doesn't exist, initialize it with an empty array
            fs.writeFileSync(userFilePath, JSON.stringify([]));
            return [];
            } else {
            throw error;
            }
        }
    }

    static _writeFile(data) {
        fs.writeFileSync(userFilePath, JSON.stringify(data, null, 2));
    }

    static findOneByGoogleId(providerId) {
        const users = this._readFile();
        return users.find(user => user.providerId === providerId);
    }

    static create(userDetails) {
        const users = this._readFile();
        users.push(userDetails);
        this._writeFile(users);
        return userDetails;
    }

    static upsert(userDetails) {
        const users = this._readFile();
        const index = users.findIndex(user => user.providerId === userDetails.providerId);

        if (index === -1) {
            // If user does not exist, create new
            users.push(userDetails);
        } else {
            // If user exists, update the user details
            users[index] = userDetails;
        }

        this._writeFile(users);
        return userDetails;
    }
}

module.exports = User;
