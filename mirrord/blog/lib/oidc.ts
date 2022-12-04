import { createRemoteJWKSet } from 'jose';

import { Issuer } from 'openid-client';

let _issuer: Issuer | null = null;

export const getIssuer = async () => {
  if (!_issuer) {
    _issuer = await Issuer.discover(process.env.OIDC_ISSUER ?? '');
  }

  return _issuer;
};

let _jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

export const getRemoteJWKSet = async () => {
  if (!_jwks) {
    _jwks = createRemoteJWKSet(new URL((await getIssuer()).metadata.jwks_uri ?? ''))
  }

  return _jwks;
}

let _client: InstanceType<Issuer['Client']> | null = null;

const createClient = async () => {
  const issuer = await getIssuer();

  if (!_client) {
    _client = new issuer.Client({
      client_id: process.env.OIDC_CLIENT_ID ?? '',
      client_secret: process.env.OIDC_CLIENT_SECRET,
      redirect_uris: [process.env.OIDC_REDIRECT_URI ?? ''],
      response_types: ['code'],
    });
  }

  return _client;
}

export default createClient; 