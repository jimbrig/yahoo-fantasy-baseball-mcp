import crypto from 'crypto';
import { createHmac } from 'crypto';

interface OAuthParams {
  oauth_consumer_key: string;
  oauth_nonce: string;
  oauth_signature_method: string;
  oauth_timestamp: string;
  oauth_version: string;
  oauth_token?: string;
  oauth_signature?: string;
  [key: string]: string | undefined;
}

/**
 * Generate OAuth 1.0a headers for Yahoo Fantasy API
 *
 * @param method - HTTP method (GET, POST, etc.)
 * @param url - Full URL to be requested
 * @param consumerKey - OAuth consumer key (client ID)
 * @param consumerSecret - OAuth consumer secret (client secret)
 * @param accessToken - OAuth access token (optional)
 * @returns HTTP headers with OAuth 1.0a authorization
 */
export function getOAuthHeaders(
  method: string,
  url: string,
  consumerKey: string,
  consumerSecret: string,
  accessToken?: string
): Record<string, string> {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = crypto.randomBytes(16).toString('hex');

  // Base OAuth parameters
  const oauthParams: OAuthParams = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: nonce,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: timestamp,
    oauth_version: '1.0',
  };

  // Add token if available
  if (accessToken) {
    oauthParams.oauth_token = accessToken;
  }

  // Get URL without query parameters
  const urlParts = url.split('?');
  const baseUrl = urlParts[0];

  // Parse query parameters if any
  const queryParams: Record<string, string> = {};
  if (urlParts.length > 1) {
    const queryString = urlParts[1];
    if (queryString) {
      queryString.split('&').forEach(param => {
        const parts = param.split('=');
        if (parts.length === 2 && parts[0]) {
          queryParams[parts[0]] = decodeURIComponent(parts[1] || '');
        }
      });
    }
  }

  // Combine OAuth and query parameters
  const allParams = { ...oauthParams, ...queryParams };

  // Create parameter string for signature
  const paramString = Object.keys(allParams)
    .sort()
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(allParams[key] || '')}`)
    .join('&');

  // Create signature base string
  const signatureBaseString = [
    method.toUpperCase(),
    encodeURIComponent(baseUrl || ''),
    encodeURIComponent(paramString)
  ].join('&');

  // Create signing key
  let tokenSecret = '';
  if (accessToken) {
    const tokenParts = accessToken.split('&');
    for (const part of tokenParts) {
      const keyValue = part.split('=');
      if (keyValue.length === 2 && keyValue[0] === 'oauth_token_secret' && keyValue[1]) {
        tokenSecret = keyValue[1];
        break;
      }
    }
  }
  const signingKey = `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(tokenSecret)}`;

  // Generate signature
  const signature = createHmac('sha1', signingKey)
    .update(signatureBaseString)
    .digest('base64');

  // Add signature to OAuth parameters
  oauthParams.oauth_signature = signature;

  // Create Authorization header
  const authHeader = 'OAuth ' + Object.keys(oauthParams)
    .map(key => {
      const value = oauthParams[key] || '';
      return `${encodeURIComponent(key)}="${encodeURIComponent(value)}"`;
    })
    .join(', ');

  return {
    'Authorization': authHeader
  };
}

/**
 * Extract the access token and refresh token from a response
 *
 * @param responseData - Response data from Yahoo OAuth endpoint
 * @returns Object containing access token and refresh token
 */
export function extractTokens(responseData: string): {
  accessToken: string;
  refreshToken: string;
  oauth_token?: string;
  oauth_token_secret?: string;
  oauth_session_handle?: string;
} {
  const params = new URLSearchParams(responseData);

  return {
    accessToken: params.get('oauth_token') || '',
    refreshToken: params.get('oauth_session_handle') || '',
    oauth_token: params.get('oauth_token') || undefined,
    oauth_token_secret: params.get('oauth_token_secret') || undefined,
    oauth_session_handle: params.get('oauth_session_handle') || undefined
  };
}
