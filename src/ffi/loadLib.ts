/// <reference lib="deno.ns" />

import denoJson from '../../deno.json' with { type: 'json' };

// Version comes from deno.json — single source of truth for both JS and native.
const LIB_VERSION = denoJson.version;

// Where to fetch prebuilt binaries from.
const RELEASE_URL_BASE = `https://github.com/diyorbek/canvas-native/releases/download/v${LIB_VERSION}`;

function getTarget(): { name: string; filename: string } {
  const os = Deno.build.os;
  const arch = Deno.build.arch;

  if (os === 'darwin' && arch === 'aarch64') {
    return { name: 'darwin-arm64', filename: 'libcanvasnative.dylib' };
  }
  if (os === 'darwin' && arch === 'x86_64') {
    return { name: 'darwin-x64', filename: 'libcanvasnative.dylib' };
  }
  if (os === 'linux' && arch === 'x86_64') {
    return { name: 'linux-x64', filename: 'libcanvasnative.so' };
  }
  if (os === 'linux' && arch === 'aarch64') {
    return { name: 'linux-arm64', filename: 'libcanvasnative.so' };
  }
  if (os === 'windows' && arch === 'x86_64') {
    return { name: 'windows-x64', filename: 'libcanvasnative.dll' };
  }
  if (os === 'windows' && arch === 'aarch64') {
    return { name: 'windows-arm64', filename: 'libcanvasnative.dll' };
  }
  throw new Error(`canvas-native: unsupported platform ${os}/${arch}`);
}

function getCacheDir(): string {
  const os = Deno.build.os;

  if (os === 'windows') {
    const localAppData =
      Deno.env.get('LOCALAPPDATA') ??
      (Deno.env.get('USERPROFILE')
        ? `${Deno.env.get('USERPROFILE')}/AppData/Local`
        : null);
    if (!localAppData) {
      throw new Error('canvas-native: could not determine LOCALAPPDATA');
    }
    return `${localAppData}/canvas-native/v${LIB_VERSION}`;
  }

  const home = Deno.env.get('HOME');
  if (!home) {
    throw new Error('canvas-native: could not determine home directory');
  }
  if (os === 'darwin') {
    return `${home}/Library/Caches/canvas-native/v${LIB_VERSION}`;
  }
  const xdgCache = Deno.env.get('XDG_CACHE_HOME');
  const base = xdgCache ?? `${home}/.cache`;
  return `${base}/canvas-native/v${LIB_VERSION}`;
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await Deno.stat(path);
    return true;
  } catch {
    return false;
  }
}

async function sha256(path: string): Promise<string> {
  const data = await Deno.readFile(path);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function download(url: string, destPath: string): Promise<void> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(
      `canvas-native: failed to download ${url} (${res.status} ${res.statusText})`,
    );
  }
  const body = res.body;
  if (!body) throw new Error('canvas-native: empty response body');

  const file = await Deno.open(destPath, {
    write: true,
    create: true,
    truncate: true,
  });
  try {
    await body.pipeTo(file.writable);
  } catch (e) {
    // pipeTo closes the file; re-throw
    throw e;
  }
}

export async function resolveLibPath(): Promise<string> {
  // 1. Env var override (developer builds, custom paths)
  const override = Deno.env.get('CANVAS_NATIVE_LIB');
  if (override) return override;

  // 2. Local dev build (./build/libcanvasnative.{dylib,so,dll})
  const { filename, name: target } = getTarget();
  const devPath = `./build/${filename}`;
  if (await fileExists(devPath)) return devPath;

  // 3. Cached download
  const cacheDir = getCacheDir();
  const cachedPath = `${cacheDir}/${filename}`;
  if (await fileExists(cachedPath)) return cachedPath;

  // 4. Download from GitHub Releases
  await Deno.mkdir(cacheDir, { recursive: true });
  const assetName = `${filename}.${target}`;
  const url = `${RELEASE_URL_BASE}/${assetName}`;
  const checksumUrl = `${url}.sha256`;

  console.error(`canvas-native: downloading ${url} ...`);
  const tmpPath = `${cachedPath}.tmp`;
  await download(url, tmpPath);

  // Verify checksum
  try {
    const checksumRes = await fetch(checksumUrl);
    if (checksumRes.ok) {
      const expected = (await checksumRes.text()).trim().split(/\s+/)[0];
      const actual = await sha256(tmpPath);
      if (expected && expected !== actual) {
        await Deno.remove(tmpPath).catch(() => {});
        throw new Error(
          `canvas-native: checksum mismatch (expected ${expected}, got ${actual})`,
        );
      }
    }
  } catch (e) {
    // If checksum file is missing on the release, we don't hard-fail —
    // but any actual mismatch above throws.
    if (e instanceof Error && e.message.includes('checksum mismatch')) throw e;
  }

  await Deno.rename(tmpPath, cachedPath);
  return cachedPath;
}
