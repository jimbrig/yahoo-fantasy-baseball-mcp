#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ErrorCode, ListToolsRequestSchema, McpError, } from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';
import { config } from 'dotenv';
import { getOAuthHeaders } from './utils/auth.js';
// Load environment variables
config();
const YAHOO_CLIENT_ID = process.env.YAHOO_CLIENT_ID;
const YAHOO_CLIENT_SECRET = process.env.YAHOO_CLIENT_SECRET;
const YAHOO_ACCESS_TOKEN = process.env.YAHOO_ACCESS_TOKEN;
if (!YAHOO_CLIENT_ID || !YAHOO_CLIENT_SECRET) {
    throw new Error('Yahoo API credentials are required in environment variables');
}
const LEAGUE_ID = '56606'; // Fat Dips & Big Rips
class YahooFantasyBaseballServer {
    server;
    axiosInstance;
    constructor() {
        this.server = new Server({
            name: 'yahoo-fantasy-baseball-server',
            version: '0.1.0',
        }, {
            capabilities: {
                tools: {},
            },
        });
        this.axiosInstance = axios.create({
            baseURL: 'https://fantasysports.yahooapis.com/fantasy/v2',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        this.setupToolHandlers();
        // Error handling
        this.server.onerror = (error) => console.error('[MCP Error]', error);
        process.on('SIGINT', async () => {
            await this.server.close();
            process.exit(0);
        });
    }
    setupToolHandlers() {
        this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
            tools: [
                {
                    name: 'get_team_roster',
                    description: 'Retrieve the current team roster with key stats',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            team_key: {
                                type: 'string',
                                description: 'Yahoo team key (optional - uses default team if not provided)',
                            },
                        },
                        additionalProperties: false,
                    },
                },
            ],
        }));
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            try {
                switch (request.params.name) {
                    case 'get_team_roster':
                        return await this.getTeamRoster(request.params.arguments);
                    default:
                        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
                }
            }
            catch (error) {
                if (axios.isAxiosError(error)) {
                    return {
                        content: [
                            {
                                type: 'text',
                                text: `Yahoo API error: ${error.response?.data || error.message}`,
                            },
                        ],
                        isError: true,
                    };
                }
                throw error;
            }
        });
    }
    async getTeamRoster(args) {
        const teamKey = args?.team_key || `458.l.${LEAGUE_ID}.t.1`; // Default to first team in league
        const url = `/team/${teamKey}/roster/players`;
        const headers = getOAuthHeaders('GET', `https://fantasysports.yahooapis.com/fantasy/v2${url}`, YAHOO_CLIENT_ID, YAHOO_CLIENT_SECRET, YAHOO_ACCESS_TOKEN);
        const response = await this.axiosInstance.get(url, {
            headers,
            params: { format: 'json' },
        });
        const roster = response.data.fantasy_content.team[1].roster[0].players;
        const players = Object.values(roster)
            .filter((player) => typeof player === 'object' && player.player)
            .map((item) => {
            const player = item.player[0];
            const name = player.name.full;
            const position = player.display_position;
            const team = player.editorial_team_abbr;
            return {
                name,
                position,
                team,
            };
        });
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({ players }, null, 2),
                },
            ],
        };
    }
    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error('Yahoo Fantasy Baseball MCP server running on stdio');
    }
}
const server = new YahooFantasyBaseballServer();
server.run().catch(console.error);
//# sourceMappingURL=index.js.map