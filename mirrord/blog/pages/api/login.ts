import Cookies from 'cookies';
import { generators, Issuer } from 'openid-client';
import type { NextApiRequest, NextApiResponse } from 'next'

import oidcClient from '../../lib/oidc';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cookies = new Cookies(req, res);

  const nonce = generators.nonce();
  const codeVerifier = generators.codeVerifier();

  const code_challenge = generators.codeChallenge(codeVerifier);

  cookies.set('oauth-nounce', nonce, {
    httpOnly: true,
  });

  cookies.set('oauth-verifier', codeVerifier, {
    httpOnly: true,
  });

  const client = await oidcClient();

  const url = client.authorizationUrl({
    scope: 'openid email profile',
    nonce,
    code_challenge,
    code_challenge_method: 'S256',
  });

  res.status(200).redirect(url.replace('example-idp', 'localhost'));
}
