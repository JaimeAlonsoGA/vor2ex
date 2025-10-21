import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const config = require('../i18next-scanner.config.cjs');
const { lngs, ns: namespaces } = config.options;

const baseDir = path.resolve(__dirname, '../app/i18n');

function readJson(filePath: string): Record<string, any> {
    try {
        const raw = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(raw || '{}');
    } catch (e) {
        return {};
    }
}

function writeJson(filePath: string, data: Record<string, any>) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function walk(obj: any, prefix = ''): string[] {
    if (obj == null) return [];
    if (typeof obj !== 'object') return [prefix];
    const keys: string[] = [];
    for (const k of Object.keys(obj)) {
        const next = prefix ? `${prefix}.${k}` : k;
        keys.push(...walk(obj[k], next));
    }
    return keys;
}

function diffKeys(
    base: Record<string, any>,
    target: Record<string, any>
): string[] {
    const baseKeys = new Set(walk(base));
    const targetKeys = new Set(walk(target));
    const missing: string[] = [];
    for (const k of baseKeys) if (!targetKeys.has(k)) missing.push(k);
    return missing.sort();
}

function setDeep(obj: Record<string, any>, dotted: string, value: any) {
    const parts = dotted.split('.');
    let cur = obj;
    for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        if (i === parts.length - 1) {
            cur[p] = value;
        } else {
            cur[p] = cur[p] ?? {};
            cur = cur[p];
        }
    }
}

async function main() {
    const defaultLng = config.options.defaultLng || lngs[0];
    const placeholder = config.options.defaultValue || '__STRING_NOT_TRANSLATED__';

    let hasMissing = false;

    for (const ns of namespaces) {
        const basePath = path.join(baseDir, defaultLng, `${ns}.json`);
        const baseJson = readJson(basePath);

        for (const lng of lngs) {
            if (lng === defaultLng) continue;
            const lngPath = path.join(baseDir, lng, `${ns}.json`);
            const lngJson = readJson(lngPath);

            const missing = diffKeys(baseJson, lngJson);
            if (missing.length) {
                hasMissing = true;
                console.log(`Missing in ${lng}/${ns}.json:`);
                for (const k of missing) {
                    console.log(`  - ${k}`);
                    // Fill with placeholder to keep files in sync
                    setDeep(lngJson, k, placeholder);
                }
                writeJson(lngPath, lngJson);
            }
        }
    }

    if (hasMissing) {
        console.log('\nSome keys were missing and have been added with placeholders.');
        if (process.argv.includes('--check')) {
            process.exitCode = 1;
        }
    } else {
        console.log('All locale files are in sync.');
    }
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
