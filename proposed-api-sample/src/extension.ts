import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "proposed-api-sample" is now active!');

	/**
	 * You can use proposed API here. `vscode.` should start auto complete
	 * Proposed API as defined in vscode.proposed.<proposalName>.d.ts.
	 */

	const disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World!');
	});
	context.subscriptions.push(disposable);
	
	vscode.interactive.addInteractiveRequest({command: 'extension.helloWorld', args: {}});

	context.subscriptions.push(
		vscode.interactive.registerInteractiveSessionProvider('proposed-api-sample', new SampleInteractiveSessionProvider())
	);
	context.subscriptions.push(
		vscode.interactive.registerInteractiveEditorSessionProvider( new SampleInteractiveEditorSessionProvider())
	);
}

class SampleInteractiveSessionProvider implements vscode.InteractiveSessionProvider {
	provideInitialSuggestions?(token: vscode.CancellationToken): vscode.ProviderResult<string[]> {
		return [
			'suggestionOne',
			'suggestionTwo'
		];
	}
	provideSlashCommands(session: vscode.InteractiveSession, token: vscode.CancellationToken): vscode.ProviderResult<vscode.InteractiveSessionSlashCommand[]> {
		return [
			{
				command: 'hello',
				kind: vscode.CompletionItemKind.Text,
				detail: 'Some detail about "hello" command (Text kind)'
			},
			{
				command: 'throw',
				kind: vscode.CompletionItemKind.Event,
				detail: 'Make provider throw an error'
			},
			{
				command: 'null',
				kind: vscode.CompletionItemKind.Event,
				detail: 'Provider will return nothing'
			},
			{
				command: 'goodbye',
				kind: vscode.CompletionItemKind.Keyword,
				detail: 'Some detail about "goodbye" command (Keyword kind)'
			}
		];
	}
	prepareSession(initialState: vscode.InteractiveSessionState | undefined, token: vscode.CancellationToken): vscode.ProviderResult<vscode.InteractiveSession> {
		return new SampleInteractiveSession(initialState);
	}
	resolveRequest(session: vscode.InteractiveSession, context: string | vscode.InteractiveSessionRequestArgs, token: vscode.CancellationToken): vscode.ProviderResult<vscode.InteractiveRequest> {
		throw new Error('Method not implemented.');
	}
	XprovideResponse(request: vscode.InteractiveRequest, token: vscode.CancellationToken): vscode.ProviderResult<vscode.InteractiveResponse> {
		return {
			content: `That was ${request.message}`,
			followups: [
				'followup1',
				'followup2'
			],
		};
	}
	provideResponseWithProgress(request: vscode.InteractiveRequest, progress: vscode.Progress<vscode.InteractiveProgress>, token: vscode.CancellationToken): vscode.ProviderResult<vscode.InteractiveResponseForProgress> {
		const message = request.message.trim();
		if (message === 'suggestionOne') {
			progress.report({content: `${message} - Pick a command to run`});
			return {
				commands: [
					{commandId: 'foo.bar1', args: [], title: 'foo.bar1 command'},
					{commandId: 'workbench.action.toggleDevTools', args: [], title: 'Toggle DevTools'},
				]
			};
		} else if (message === 'suggestionTwo') {
			progress.report({content: `${message} - Choose a followup to ask`});
			return {
				followups: [
					'followup3',
					'followup4'
				]
			};
		} else if (message === '/null') {
			progress.report({content: `${message} - return nothing`});
			return;
		} else if (message === '/throw') {
			progress.report({content: `${message} - throw an error`});
			throw new Error('Provider threw this error.');
		} else {
			progress.report({content: `You asked "${message}"`});
			const responseIsIncomplete = message === 'followup3';
			return {
				errorDetails: {message: `Sorry, I don't understand "${message}" - (responseIsIncomplete=${responseIsIncomplete})`, responseIsIncomplete}
			};
		}
	}
}

class SampleInteractiveEditorSessionProvider implements vscode.InteractiveEditorSessionProvider {
	prepareInteractiveEditorSession(context: vscode.TextDocumentContext, token: vscode.CancellationToken): vscode.ProviderResult<vscode.InteractiveEditorSession> {
		return new SampleInteractiveEditorSession(context, token);
	}
	provideInteractiveEditorResponse(request: vscode.InteractiveEditorRequest, token: vscode.CancellationToken): vscode.ProviderResult<vscode.InteractiveEditorResponse> {
		return {
			edits: [
				{newText: request.prompt, range: request.selection}
			],
			placeholder: 'From provideInteractiveEditorResponse'
		};
	}
	releaseInteractiveEditorSession?(session: vscode.InteractiveEditorSession) {
		return;
	}
	
}

class SampleInteractiveEditorSession implements vscode.InteractiveEditorSession {
	placeholder?: string | undefined;
	private context: vscode.TextDocumentContext;
	private token: vscode.CancellationToken;
	constructor(context: vscode.TextDocumentContext, token: vscode.CancellationToken) {
		this.placeholder = `SampleInteractiveEditorSession placeholder, selection=${context.document.getText(context.selection)}`;
		this.context = context;
		this.token = token;
		return;
	}
}

class SampleInteractiveSession implements vscode.InteractiveSession {
	requester?: vscode.InteractiveSessionParticipantInformation | undefined;
	responder?: vscode.InteractiveSessionParticipantInformation | undefined;
	state: vscode.InteractiveSessionState | undefined;

	constructor(initialState: vscode.InteractiveSessionState | undefined) {
		this.requester = { name: 'John', icon: vscode.Uri.parse('https://avatars.githubusercontent.com/u/6726799?s=40&v=4') };
		this.responder = { name: 'VSCodeTriageBot', icon: vscode.Uri.parse('https://avatars.githubusercontent.com/u/105309205?s=52&v=4')};
		this.state = initialState;
	}

	saveState(): vscode.InteractiveSessionState {
		return this.state || {};
	}
}