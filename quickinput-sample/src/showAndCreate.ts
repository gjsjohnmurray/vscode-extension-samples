/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { window } from 'vscode';

/**
 * Shows a pick list using window.showQuickPick().
 */
export async function showQuickPick() {
	let i = 0;
	const result = await window.showQuickPick(['eins', 'zwei', 'drei'], {
		placeHolder: 'eins, zwei or drei',
		onDidSelectItem: item => window.showInformationMessage(`Focus ${++i}: ${item}`)
	});
	window.showInformationMessage(`Got: ${result}`);
}

/**
 * Shows an input box using window.showInputBox(), then create one using window.createInputBox().
 * Demonstrates https://github.com/microsoft/vscode/issues/137750
 */
export async function showThenCreateInputBoxes() {
	const result = await window.showInputBox({placeHolder: 'Type something and press Enter'});
	window.showInformationMessage(`First got: ${result}`);
	const inputBox = window.createInputBox();
	inputBox.prompt = 'No initial value was set after createInputBox()';
	inputBox.onDidAccept(() => {
		window.showInformationMessage(`Second got: ${inputBox.value}`);
	});
	inputBox.show();
}
