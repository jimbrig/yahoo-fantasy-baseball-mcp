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
export declare function getOAuthHeaders(method: string, url: string, consumerKey: string, consumerSecret: string, accessToken?: string): Record<string, string>;
/**
 * Extract the access token and refresh token from a response
 *
 * @param responseData - Response data from Yahoo OAuth endpoint
 * @returns Object containing access token and refresh token
 */
export declare function extractTokens(responseData: string): {
    accessToken: string;
    refreshToken: string;
    oauth_token?: string;
    oauth_token_secret?: string;
    oauth_session_handle?: string;
};
