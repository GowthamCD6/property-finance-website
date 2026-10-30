/**
 * Google Identity Services SDK Helper
 * Direct, lightweight integration with Google OAuth2 without third-party React wrapper conflicts.
 */

export const GOOGLE_CLIENT_ID = '187538648042-d9c0epul3h74dbseub2qh4plnfn506tv.apps.googleusercontent.com';

declare global {
  interface Window {
    google?: any;
  }
}

/**
 * Ensures Google Identity Services script is loaded and ready
 */
export function ensureGoogleScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.oauth2) {
      resolve();
      return;
    }

    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existingScript) {
      let intervalCount = 0;
      const checker = setInterval(() => {
        intervalCount++;
        if (window.google?.accounts?.oauth2) {
          clearInterval(checker);
          resolve();
        } else if (intervalCount > 50) {
          clearInterval(checker);
          reject(new Error('Google Identity Services SDK took too long to load.'));
        }
      }, 100);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      let intervalCount = 0;
      const checker = setInterval(() => {
        intervalCount++;
        if (window.google?.accounts?.oauth2) {
          clearInterval(checker);
          resolve();
        } else if (intervalCount > 30) {
          clearInterval(checker);
          resolve();
        }
      }, 100);
    };
    script.onerror = () => reject(new Error('Failed to load Google Identity Services.'));
    document.head.appendChild(script);
  });
}

/**
 * Triggers the official Google OAuth token popup and returns the access token
 */
export async function triggerGoogleOAuth(): Promise<string> {
  await ensureGoogleScript();

  return new Promise((resolve, reject) => {
    try {
      if (!window.google?.accounts?.oauth2) {
        throw new Error('Google Identity Services is unavailable. Please check your connection.');
      }

      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'email profile openid',
        callback: (response: any) => {
          if (response.error) {
            reject(new Error(response.error_description || response.error));
          } else if (response.access_token) {
            resolve(response.access_token);
          } else {
            reject(new Error('Google authentication did not return a valid token.'));
          }
        },
      });

      client.requestAccessToken({ prompt: 'select_account' });
    } catch (err) {
      reject(err);
    }
  });
}
