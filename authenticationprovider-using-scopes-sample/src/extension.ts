// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import 'isomorphic-fetch';
import * as vscode from 'vscode';
import { SampleAuthenticationProvider } from './authProvider';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "vscode-authenticationprovider-using-scopes-sample" is now active!');

	// Register our authentication provider. NOTE: this will register the provider globally which means that
	// any other extension can use this provider via the `getSession` API.
	// NOTE: when implementing an auth provider, don't forget to register an activation event for that provider
	// in your package.json file: "onAuthenticationRequest:SampleAuthProvider"
	context.subscriptions.push(vscode.authentication.registerAuthenticationProvider(
		SampleAuthenticationProvider.id,
		'Sample AuthProvider',
		new SampleAuthenticationProvider(),
		{ supportsMultipleAccounts: true }
	));

	let disposable;

	disposable = vscode.commands.registerCommand('vscode-authenticationprovider-using-scopes-sample.loginOnS1', async () => {
		// Get/create a session for server S1, clearing session preference
		const session = await vscode.authentication.getSession(SampleAuthenticationProvider.id, ['S1'], { createIfNone: true, clearSessionPreference: true });
		console.log(session);
	});

	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('vscode-authenticationprovider-using-scopes-sample.loginOnS1asU1', async () => {
		// Get/create session for server S1 and user U1.
		const session = await vscode.authentication.getSession(SampleAuthenticationProvider.id, ['S1', 'U1'], { createIfNone: true });
		console.log(session);
	});

	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('vscode-authenticationprovider-using-scopes-sample.loginOnS1asU2', async () => {
		// Get/create session for server S1 and user U2.
		const session = await vscode.authentication.getSession(SampleAuthenticationProvider.id, ['S1', 'U2'], { createIfNone: true });
		console.log(session);
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
