import {
  Event,
  SimplePool,
  getBlankEvent,
  getEventHash,
  getSignature,
  nip19,
} from "nostr-tools";
import config from "../config.json";
import { getPublic, getSecret, showPublic } from "./key";
import "websocket-polyfill";
import { containsWords } from "./wordChecker";

const DEFAULT_RELAYS = ["wss://yabu.me"];

const now = () => Math.floor(Date.now() / 1000);

const mergeContent = (baseContent: string, content: any) => {
  return JSON.stringify({ ...JSON.parse(baseContent), ...content });
};

(async () => {
  const relays = config.relays || DEFAULT_RELAYS;

  const pool = new SimplePool();

  const secretHex = getSecret();
  const { hex, npub } = showPublic();
  console.log("👀 Checking:", npub);

  let lastCheckedAt = now();
  let isDefaultProfile = true;
  let toDefaultProfileTimeoutId: NodeJS.Timeout = setTimeout(() => null, 0);

  const publish = (ev: Event<number>) => {
    const pubs = pool.publish(relays, ev);

    let failedCount = 0;
    pubs.on("failed", failedCount++);

    setTimeout(() => {
      if (!failedCount) return;
      console.log(`❌ Update failed on ${failedCount} relays`);
    }, 10 * 1000);
  };

  while (true) {
    const events = await pool.list(relays, [
      {
        kinds: [1],
        authors: [hex],
        since: lastCheckedAt,
      },
    ]);
    lastCheckedAt = now();

    for (const event of events) {
      if (containsWords(config.wordList, event.content)) {
        console.log("🚨 Found word in wordlist", event);

        // 現在のプロフィールを取得
        const profileList = await pool.list(relays, [
          {
            kinds: [0],
            authors: [hex],
          },
        ]);
        const profile = profileList.sort(
          (a, b) => b.created_at - a.created_at
        )[0];

        // プロフィールがデフォルトの場合新しいプロフィールに更新
        if (isDefaultProfile) {
          const newProfile = {
            ...profile,
            content: mergeContent(
              profile.content,
              config.notDefaultKind0Content
            ),
          };

          const newProfileEvent = {
            ...newProfile,
            id: getEventHash(newProfile),
            sig: getSignature(newProfile, secretHex),
          };

          publish(newProfileEvent);
        }

        isDefaultProfile = false;

        // NGワードが３分間検出されなければデフォルトプロフィールに戻す
        clearTimeout(toDefaultProfileTimeoutId);
        toDefaultProfileTimeoutId = setTimeout(() => {
          const defaultProfile = {
            ...profile,
            content: mergeContent(profile.content, config.defaultKind0Content),
          };

          const defaultProfileEvent = {
            ...defaultProfile,
            id: getEventHash(defaultProfile),
            sig: getSignature(defaultProfile, secretHex),
          };

          publish(defaultProfileEvent);
        }, (config.interval || 5 * 60) * 1000);
      }
    }

    await new Promise((resolve) => {
      setTimeout(resolve, 3000);
    });
  }
})();
