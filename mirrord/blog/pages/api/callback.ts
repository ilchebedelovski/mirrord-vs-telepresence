import Cookies from 'cookies';
import type { TokenSet } from 'openid-client';
import type { NextApiRequest, NextApiResponse } from 'next';

import oidcClient from '../../lib/oidc';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TokenSet>
) {
  const cookies = new Cookies(req, res);

  const nonce = cookies.get('oauth-nounce');
  const code_verifier = cookies.get('oauth-verifier');
  
  const client = await oidcClient();

  const params = client.callbackParams(req);
  const tokenSet = await client.callback(process.env.OIDC_REDIRECT_URI ?? '', params, {
    state: '',
    nonce,
    code_verifier,
  });

  cookies.set('oauth-access-token', tokenSet.access_token, {
    httpOnly: true,
  });

  if (tokenSet.refresh_token) {
    cookies.set('oauth-refresh-token', tokenSet.refresh_token, {
      httpOnly: true,
    });
  }

  res.status(200).redirect('/')
}