/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/


import * as vscode from 'vscode';

let myStatusBarItem: vscode.StatusBarItem;

export function activate({ subscriptions }: vscode.ExtensionContext) {

	// register a command that is invoked when the status bar
	// item is clicked
	const myCommandId = 'sample.updateItem';
	subscriptions.push(vscode.commands.registerCommand(myCommandId, () => {
		updateStatusBarItem();
	}));

	// create a new status bar item that we can now manage
	myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	myStatusBarItem.command = myCommandId;
	subscriptions.push(myStatusBarItem);

	// update status bar item immediately from activate()
	updateStatusBarItem();
}

function updateStatusBarItem(): void {
	let shell;
	let attempt;

	// Try multiple times in case it's a timing issue.
	// TODO add a small delay between attempts to see if it succeeds after a bit.
	for (attempt = 1; attempt <= 10; attempt++) {
		shell = vscode.env.shell;
		if (shell !== '') break;
	}
	if (vscode.env.shell === '') {
		myStatusBarItem.text = `vscode.env.shell is EMPTY after ${attempt - 1} tries - CLICK HERE to check again`;
		myStatusBarItem.show();
	} else {
		myStatusBarItem.text = `After ${attempt} tries shell is ${shell}`;
		myStatusBarItem.show();
	}
}
