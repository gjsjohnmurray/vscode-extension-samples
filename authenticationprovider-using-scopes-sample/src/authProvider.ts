import {
	AuthenticationProvider,
	AuthenticationProviderAuthenticationSessionsChangeEvent,
	AuthenticationSession,
	AuthenticationSessionAccountInformation,
	Disposable,
	Event,
	EventEmitter,
	window,
} from 'vscode';

class SampleSession implements AuthenticationSession {
    public readonly id: string;
    public readonly accessToken: string;
    public readonly account: AuthenticationSessionAccountInformation;
    public readonly scopes: string[];
	constructor(
        public readonly serverName: string,
        userName: string,
        password: string
        ) {
        this.id = SampleAuthenticationProvider.sessionId(serverName, userName);
        this.accessToken = password;
        this.account = {id: userName, label: `${userName} on ${serverName}`};
		this.scopes = [serverName, userName];
    }
}

export class SampleAuthenticationProvider implements AuthenticationProvider, Disposable {
	static id = 'SampleAuthProvider';
	static secretKeyPrefix = 'SampleAuthProvider:';
	static sessionId(serverName: string, userName: string): string {
        return `${serverName}@${userName}`;
    }
	static credentialKey(sessionId: string): string {
        return `${SampleAuthenticationProvider.secretKeyPrefix}${sessionId}`;
    }

	private _sessions: SampleSession[] = [];

	private _onDidChangeSessions = new EventEmitter<AuthenticationProviderAuthenticationSessionsChangeEvent>();
	get onDidChangeSessions(): Event<AuthenticationProviderAuthenticationSessionsChangeEvent> {
		return this._onDidChangeSessions.event;
	}

	constructor() { }

	dispose(): void {
	}

	// This function is called first when `vscode.authentication.getSessions` is called.
	async getSessions(scopes: string[] = []): Promise<readonly AuthenticationSession[]> {
		let sessions = this._sessions;

		// Filter to return only those that match all supplied scopes, which are positional.
		for (let index = 0; index < scopes.length; index++) {
			sessions = sessions.filter((session) => session.scopes[index] === scopes[index]);
		}
		return sessions;
	}

	// This function is called after `this.getSessions` is called and only when:
	// - `this.getSessions` returns nothing but `createIfNone` was set to `true` in `vscode.authentication.getSession`
	// - `vscode.authentication.getSession` was called with `forceNewSession: true`
	// - The end user initiates the "silent" auth flow via the Accounts menu
	async createSession(scopes: string[]): Promise<AuthenticationSession> {

        let serverName = scopes[0] ?? '';
        if (!serverName) {
            // Prompt for the server name.
            serverName = await window.showInputBox({
                ignoreFocusOut: true,
                placeHolder: 'Server name',
            }) ?? '';
            if (!serverName) {
                throw new Error('Server name is required');
            }
        }

        let userName = scopes[1] ?? '';
        if (!userName) {
            // Prompt for the username.
            userName = await window.showInputBox({
                ignoreFocusOut: true,
                placeHolder: `Username on server '${serverName}'`,
            }) ?? '';
            if (!userName) {
                throw new Error('Username is required');
            }
        }

		// Prompt for the password.
		const password = await window.showInputBox({
			ignoreFocusOut: true,
			placeHolder: `Password for ${userName} on ${serverName}`,
			prompt: `Enter the user's password.`,
			password: true,
		});
		
		if (!password) {
			throw new Error('Password is required');
		}
		

		// This sample doesn't actually persist anything in secret storage
		console.log(`Successfully logged in to ${serverName} as ${userName}`);

		const session = new SampleSession(serverName, userName, password);
	
		// Remove previous session with this id, which may exist if clearSessionPreference was set on the getSession call
		this._sessions = this._sessions.filter((sess) => sess.id !== session.id );

		// Store the new session and return it
		this._sessions.push(session);
		return session;
}

	// This function is called when the end user signs out of the account.
	async removeSession(_sessionId: string): Promise<void> {
	}
}
