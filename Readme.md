# What it is

A Google OAuth-secured AI-drive Content creation system built with Vite, React, Node.js to help drive beautiful content to digital signage systems.


## Initial Setup

To set up the project, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/appleisthebestfruit/markdowncms.git
   cd markdowncms
   ```

2. Secrets and Configs

Make sure to `mv .env.example .env` and fill in the necessary secrets from third-party APIs into the `.env` file. You must also `mv settings.yml.example settings.yml` and apply the allowed emails (as regex string) into the yml file.

2. Install the web app

   ```bash
   cd DigitalSignAssistant
   npm build

   ```

3. Start Dev in `node-server` folder
   ```bash
   cd node-server
   npm install
   npm run dev
   ```

## Get Started

1. Build the react app
2. Build the node server then run that server

## License

MIT License