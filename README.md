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

> **Note**: The Yahoo Fantasy Sports API uses OAuth for authentication. The provided token script may need to be updated if the Yahoo API endpoints have changed.

1. Visit the [Yahoo Developer Network](https://developer.yahoo.com/)
2. Create a new project/application with Fantasy Sports API access
3. Make note of your Client ID and Client Secret
4. Add these values to your `.env` file:
   ```
   YAHOO_CLIENT_ID=your_client_id
   YAHOO_CLIENT_SECRET=your_client_secret
   ```
5. To get an access token, you may need to:
   - Use the Yahoo Developer Console to generate a token
   - Use a tool like Postman with OAuth 1.0a support
   - Follow Yahoo's official documentation for the latest OAuth workflow
6. Once obtained, add the access token to your `.env` file:
   ```
   YAHOO_ACCESS_TOKEN=your_access_token
   ```

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
