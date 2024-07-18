const db = require('../PostgresWrapper');

class User {
    static async findOneByGoogleId(providerId) {
        const result = await db.query('SELECT * FROM users WHERE provider_id = $1', [providerId]);
        return result.rows[0];
    }

    static async create({ providerId, name, familyName, givenName, email, photo }) {
        const result = await db.query(
            'INSERT INTO users (provider_id, name, family_name, given_name, email, photo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [providerId, name, familyName, givenName, email, photo]
        );
        return result.rows[0];
    }
}

module.exports = User;
