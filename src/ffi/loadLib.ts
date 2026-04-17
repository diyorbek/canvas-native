import {
  mkdir,
  readFile,
  rename,
  stat,
  unlink,
  writeFile,
} from 'node:fs/promises';
import process from 'node:process';
import denoJson from '../../deno.json' with { type: 'json' };

// Version comes from deno.json — single source of truth for both JS and native.
const LIB_VERSION = denoJson.version;

// Where to fetch prebuilt binaries from.
const RELEASE_URL_BASE = `https://github.com/diyorbek/canvas-native/releases/download/v${LIB_VERSION}`;

// Map Node's process.platform/arch to our target naming.
const PLATFORM_MAP: Record<string, string> = {
  darwin: 'darwin',
  linux: 'linux',
  win32: 'windows',
};
const ARCH_MAP: Record<string, string> = { arm64: 'aarch64', x64: 'x86_64' };
const EXT_MAP: Record<string, string> = {
  darwin: 'dylib',
  linux: 'so',
  win32: 'dll',
};

function getTarget(): { name: string; filename: string } {
  const os = PLATFORM_MAP[process.platform];
  const arch = ARCH_MAP[process.arch];
  const ext = EXT_MAP[process.platform];

  if (!os || !arch || !ext) {
    throw new Error(
      `canvas-native: unsupported platform ${process.platform}/${process.arch}`,
    );
  }

  return {
    name: `${os}-${process.arch}`,
    filename: `libcanvasnative.${ext}`,
  };
}

function getCacheDir(): string {
  if (process.platform === 'win32') {
    const localAppData =
      process.env.LOCALAPPDATA ??
      (process.env.USERPROFILE
        ? `${process.env.USERPROFILE}/AppData/Local`
        : null);

    if (!localAppData) {
      throw new Error('canvas-native: could not determine LOCALAPPDATA');
    }

    return `${localAppData}/canvas-native/v${LIB_VERSION}`;
  }

  const home = process.env.HOME;
  if (!home) {
    throw new Error('canvas-native: could not determine home directory');
  }

  if (process.platform === 'darwin') {
    return `${home}/Library/Caches/canvas-native/v${LIB_VERSION}`;
  }

  const base = process.env.XDG_CACHE_HOME ?? `${home}/.cache`;
  return `${base}/canvas-native/v${LIB_VERSION}`;
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function sha256(path: string): Promise<string> {
  const data = new Uint8Array(await readFile(path));
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
  const buf = await res.arrayBuffer();
  await writeFile(destPath, new Uint8Array(buf));
}

export async function resolveLibPath(): Promise<string> {
  // 1. Env var override (developer builds, custom paths)
  const override = process.env.CANVAS_NATIVE_LIB;
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
  await mkdir(cacheDir, { recursive: true });
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
        await unlink(tmpPath).catch(() => {});
        throw new Error(
          `canvas-native: checksum mismatch (expected ${expected}, got ${actual})`,
        );
      }
    }
  } catch (e) {
    if (e instanceof Error && e.message.includes('checksum mismatch')) throw e;
  }

  await rename(tmpPath, cachedPath);
  return cachedPath;
}
