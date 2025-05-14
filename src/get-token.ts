#!/usr/bin/env node
import axios from 'axios';
import { createServer } from 'http';
import { config } from 'dotenv';
import { URL } from 'url';
import { extractTokens } from './utils/auth.js';

// Load environment variables
config();

const YAHOO_CLIENT_ID = process.env.YAHOO_CLIENT_ID || '';
const YAHOO_CLIENT_SECRET = process.env.YAHOO_CLIENT_SECRET || '';

if (!YAHOO_CLIENT_ID || !YAHOO_CLIENT_SECRET) {
  console.error('YAHOO_CLIENT_ID and YAHOO_CLIENT_SECRET must be defined in .env file');
  process.exit(1);
}

// OAuth URLs
const REQUEST_TOKEN_URL = 'https://api.login.yahoo.com/oauth/v2/get_request_token';
const AUTH_URL = 'https://api.login.yahoo.com/oauth/v2/request_auth';
const GET_TOKEN_URL = 'https://api.login.yahoo.com/oauth/v2/get_token';

// Callback URL (must match the one registered with Yahoo)
const CALLBACK_URL = 'oob'; // Out-of-band (PIN-based) flow

// Step 1: Get a request token
async function getRequestToken() {
  try {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const nonce = Math.random().toString(36).substring(2);

    const params = new URLSearchParams();
    params.append('oauth_consumer_key', YAHOO_CLIENT_ID);
    params.append('oauth_signature_method', 'PLAINTEXT');
    params.append('oauth_timestamp', timestamp);
    params.append('oauth_nonce', nonce);
    params.append('oauth_version', '1.0');
    params.append('oauth_callback', CALLBACK_URL);
    params.append('oauth_signature', `${YAHOO_CLIENT_SECRET}&`);

    const response = await axios.post(REQUEST_TOKEN_URL, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const responseData = response.data;
    console.log('\nRequest Token Response:', responseData);

    // Extract the request token and token secret
    const tokens = extractTokens(responseData);
    if (!tokens.oauth_token) {
      throw new Error('Failed to get oauth_token from response');
    }
    return tokens.oauth_token;
  } catch (error) {
    console.error('Error getting request token:', error);
    throw error;
  }
}

// Step 2: Direct the user to authorize the application
function getAuthorizationUrl(requestToken: string | undefined) {
  if (!requestToken) {
    console.error('Request token is undefined');
    return;
  }
  const authUrl = `${AUTH_URL}?oauth_token=${requestToken}`;
  console.log('\nPlease visit the following URL to authorize the application:');
  console.log(authUrl);
  console.log('\nAfter authorizing, you will receive a verification code (PIN).');
  console.log('Add this code to your .env file as YAHOO_ACCESS_TOKEN=your_access_token\n');
}

// Main function
async function main() {
  try {
    const requestToken = await getRequestToken();
    getAuthorizationUrl(requestToken);
  } catch (error) {
    console.error('Error in OAuth flow:', error);
  }
}

// Run the script
main();
