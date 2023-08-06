import * as fs from "fs";
import { getPublicKey, nip19, utils } from "nostr-tools";
import * as path from "path";

const PATH = path.resolve(".nostr_account_secret");

export const setSecret = (key: string) => {
  if (key.startsWith("nsec")) {
    key = nip19.decode(key).data.toString();
  }
  fs.writeFileSync(PATH, key);
};

export const showPublic = (): { hex: string; npub: string } => {
  const hex = getPublic();
  const npub = nip19.npubEncode(hex);
  return { hex, npub };
};

export const getPublic = () => {
  const secret = getSecret();
  const hex = getPublicKey(secret);
  return hex;
};

export const getSecret = () => {
  try {
    const secret = fs.readFileSync(PATH).toString();
    return secret;
  } catch (e) {
    throw Error("Could not read secret.");
  }
};
