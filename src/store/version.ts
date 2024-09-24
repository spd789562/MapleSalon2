import { atom, batched } from 'nanostores';
import { getVersion } from '@tauri-apps/api/app';

const LATEST_RELEASE_URL =
  'https://api.github.com/repos/spd789562/MapleSalon2/releases/latest';

interface GithubReleaseResponse {
  tag_name: string;
  name: string;
}

let latestCheckTime = 0;

export const $currentVersion = atom<string | undefined>(undefined);
export const $latestVersion = atom<string | undefined>(undefined);

export const $hasNewVersion = batched(
  [$currentVersion, $latestVersion],
  (curr, latest) => (latest ? curr !== latest : false),
);

export async function updateCurrentVersion() {
  $currentVersion.set(await getVersion());
}
export async function updateLatestVersion() {
  if (Date.now() - latestCheckTime < 1000 * 60 * 60) {
    return;
  }
  const response = (await fetch(LATEST_RELEASE_URL).then((r) =>
    r.json(),
  )) as GithubReleaseResponse;
  const version = response.tag_name.split('v')?.[1] || '';
  $latestVersion.set(version);
  latestCheckTime = Date.now();
}
