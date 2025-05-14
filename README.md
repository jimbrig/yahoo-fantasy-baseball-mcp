# Yahoo Fantasy Baseball MCP Server

This MCP server provides tools to interact with the Yahoo Fantasy Sports API, specifically tailored for fantasy baseball leagues.

## Features

- OAuth 1.0a authentication with Yahoo API
- Access to team rosters, player stats, and more
- Integration with Claude via MCP protocol

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Yahoo Developer account with API credentials
- A Yahoo Fantasy Baseball league

### Installation

1. Clone this repository:
   ```
   git clone <repository-url>
   cd yahoo-fantasy-baseball-MCP
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables by creating or updating a `.env` file:
   ```
   YAHOO_CLIENT_ID=your_yahoo_client_id
   YAHOO_CLIENT_SECRET=your_yahoo_client_secret
   YAHOO_ACCESS_TOKEN=your_access_token
   ```

### Obtaining Yahoo API Access

1. Visit the [Yahoo Developer Network](https://developer.yahoo.com/)
2. Create a new project/application
3. Make note of your Client ID and Client Secret
4. Run the authentication script to get an access token:
   ```
   npm run build
   npm run get-token
   ```
5. Follow the instructions from the console to authorize the application
6. Add the resulting access token to your `.env` file

### Building and Running the Server

Build the TypeScript files:
```
npm run build
```

Start the server:
```
npm start
```

## MCP Configuration

To add this server to your Claude configuration, add the following to your MCP settings file:

```json
"yahoo-fantasy-baseball": {
  "autoApprove": [],
  "disabled": false,
  "timeout": 60,
  "command": "node",
  "args": ["path/to/yahoo-fantasy-baseball-MCP/build/index.js"],
  "env": {
    "YAHOO_CLIENT_ID": "your_yahoo_client_id",
    "YAHOO_CLIENT_SECRET": "your_yahoo_client_secret",
    "YAHOO_ACCESS_TOKEN": "your_access_token"
  },
  "transportType": "stdio"
}
```

## Available Tools

### get_team_roster

Retrieves the current roster for a team.

Parameters:
- `team_key` (optional): Yahoo team key. Defaults to your primary team.

Example usage:
```
Use the get_team_roster tool to see my current lineup.
```

### get_waiver_players (Coming Soon)

Lists available players on the waiver wire with relevant stats.

### get_matchup (Coming Soon)

Provides details about your current matchup.

## License

MIT
