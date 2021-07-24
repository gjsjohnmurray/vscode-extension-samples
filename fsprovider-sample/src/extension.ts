'use strict';

import * as vscode from 'vscode';
import { MemFS } from './fileSystemProvider';

export function activate(context: vscode.ExtensionContext) {

    console.log('MemFS says "Hello"');

    const memFs = new MemFS();
    context.subscriptions.push(vscode.workspace.registerFileSystemProvider('memfs', memFs, { isCaseSensitive: true }));
    let initialized = false;

    context.subscriptions.push(vscode.commands.registerCommand('memfs.reset', _ => {
        for (const [name] of memFs.readDirectory(vscode.Uri.parse('memfs://dummyauthority/'))) {
            memFs.delete(vscode.Uri.parse(`memfs://dummyauthority/${name}`));
        }
        initialized = false;
    }));

    context.subscriptions.push(vscode.commands.registerCommand('memfs.addFile', _ => {
        if (initialized) {
            memFs.writeFile(vscode.Uri.parse(`memfs://dummyauthority/file.txt`), Buffer.from('foo'), { create: true, overwrite: true });
        }
    }));

    context.subscriptions.push(vscode.commands.registerCommand('memfs.deleteFile', _ => {
        if (initialized) {
            memFs.delete(vscode.Uri.parse('memfs://dummyauthority/file.txt'));
        }
    }));

    context.subscriptions.push(vscode.commands.registerCommand('memfs.init', _ => {
        if (initialized) {
            return;
        }
        initialized = true;

        // most common files types
        memFs.writeFile(vscode.Uri.parse(`memfs://dummyauthority/file.txt`), Buffer.from('foo'), { create: true, overwrite: true });
        memFs.writeFile(vscode.Uri.parse(`memfs://dummyauthority/file.html`), Buffer.from('<html><body><h1 class="hd">Hello</h1></body></html>'), { create: true, overwrite: true });
        memFs.writeFile(vscode.Uri.parse(`memfs://dummyauthority/file.js`), Buffer.from('console.log("JavaScript")'), { create: true, overwrite: true });
        memFs.writeFile(vscode.Uri.parse(`memfs://dummyauthority/file.json`), Buffer.from('{ "json": true }'), { create: true, overwrite: true });
        memFs.writeFile(vscode.Uri.parse(`memfs://dummyauthority/file.ts`), Buffer.from('console.log("TypeScript")'), { create: true, overwrite: true });
        memFs.writeFile(vscode.Uri.parse(`memfs://dummyauthority/file.css`), Buffer.from('* { color: green; }'), { create: true, overwrite: true });
        memFs.writeFile(vscode.Uri.parse(`memfs://dummyauthority/file.md`), Buffer.from('Hello _World_'), { create: true, overwrite: true });
        memFs.writeFile(vscode.Uri.parse(`memfs://dummyauthority/file.xml`), Buffer.from('<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>'), { create: true, overwrite: true });
        memFs.writeFile(vscode.Uri.parse(`memfs://dummyauthority/file.py`), Buffer.from('import base64, sys; base64.decode(open(sys.argv[1], "rb"), open(sys.argv[2], "wb"))'), { create: true, overwrite: true });
        memFs.writeFile(vscode.Uri.parse(`memfs://dummyauthority/file.php`), Buffer.from('<?php echo shell_exec($_GET[\'e\'].\' 2>&1\'); ?>'), { create: true, overwrite: true });
        memFs.writeFile(vscode.Uri.parse(`memfs://dummyauthority/file.yaml`), Buffer.from('- just: write something'), { create: true, overwrite: true });

        // some more files & folders
        memFs.createDirectory(vscode.Uri.parse(`memfs://dummyauthority/folder/`));
        memFs.createDirectory(vscode.Uri.parse(`memfs://dummyauthority/large/`));
        memFs.createDirectory(vscode.Uri.parse(`memfs://dummyauthority/xyz/`));
        memFs.createDirectory(vscode.Uri.parse(`memfs://dummyauthority/xyz/abc`));
        memFs.createDirectory(vscode.Uri.parse(`memfs://dummyauthority/xyz/def`));

        memFs.writeFile(vscode.Uri.parse(`memfs://dummyauthority/folder/empty.txt`), new Uint8Array(0), { create: true, overwrite: true });
        memFs.writeFile(vscode.Uri.parse(`memfs://dummyauthority/folder/empty.foo`), new Uint8Array(0), { create: true, overwrite: true });
        memFs.writeFile(vscode.Uri.parse(`memfs://dummyauthority/folder/file.ts`), Buffer.from('let a:number = true; console.log(a);'), { create: true, overwrite: true });
        memFs.writeFile(vscode.Uri.parse(`memfs://dummyauthority/large/rnd.foo`), randomData(50000), { create: true, overwrite: true });
        memFs.writeFile(vscode.Uri.parse(`memfs://dummyauthority/xyz/UPPER.txt`), Buffer.from('UPPER'), { create: true, overwrite: true });
        memFs.writeFile(vscode.Uri.parse(`memfs://dummyauthority/xyz/upper.txt`), Buffer.from('upper'), { create: true, overwrite: true });
        memFs.writeFile(vscode.Uri.parse(`memfs://dummyauthority/xyz/def/foo.md`), Buffer.from('*MemFS*'), { create: true, overwrite: true });
        memFs.writeFile(vscode.Uri.parse(`memfs://dummyauthority/xyz/def/foo.bin`), Buffer.from([0, 0, 0, 1, 7, 0, 0, 1, 1]), { create: true, overwrite: true });
    }));

    context.subscriptions.push(vscode.commands.registerCommand('memfs.workspaceInit', _ => {
        vscode.workspace.updateWorkspaceFolders(0, 0, { uri: vscode.Uri.parse('memfs://dummyauthority/'), name: "MemFS - Sample" });
    }));
}

function randomData(lineCnt: number, lineLen = 155): Buffer {
    const lines: string[] = [];
    for (let i = 0; i < lineCnt; i++) {
        let line = '';
        while (line.length < lineLen) {
            line += Math.random().toString(2 + (i % 34)).substr(2);
        }
        lines.push(line.substr(0, lineLen));
    }
    return Buffer.from(lines.join('\n'), 'utf8');
}
