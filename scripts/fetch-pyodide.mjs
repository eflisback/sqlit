#!/usr/bin/env node

import {
	copyFileSync,
	createWriteStream,
	existsSync,
	mkdirSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dest = join(root, 'public', 'pyodide');
const src = join(root, 'node_modules', 'pyodide');

const PYODIDE_VERSION = '0.29.3';
const CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full`;

const CORE_FILES = [
	'pyodide.js',
	'pyodide.mjs',
	'pyodide.asm.js',
	'pyodide.asm.wasm',
	'python_stdlib.zip',
	'pyodide-lock.json',
	'pyodide.d.ts',
	'ffi.d.ts',
	'package.json',
];

const WHL_FILES = [
	'micropip-0.11.0-py3-none-any.whl',
	'sqlite3-1.0.0-cp313-cp313-pyodide_2025_0_wasm32.whl',
];

mkdirSync(dest, { recursive: true });

for (const file of CORE_FILES) {
	const target = join(dest, file);
	if (existsSync(target)) {
		console.log(`skip  ${file}`);
		continue;
	}
	copyFileSync(join(src, file), target);
	console.log(`copy  ${file}`);
}

for (const file of WHL_FILES) {
	const target = join(dest, file);
	if (existsSync(target)) {
		console.log(`skip  ${file}`);
		continue;
	}
	const url = `${CDN}/${file}`;
	console.log(`fetch ${file} ...`);
	const response = await fetch(url);
	if (!response.ok)
		throw new Error(
			`Failed to fetch ${url}: ${response.status} ${response.statusText}`,
		);
	await pipeline(Readable.fromWeb(response.body), createWriteStream(target));
	console.log(`done  ${file}`);
}

console.log('public/pyodide is ready.');
