# Authentication Provider API Sample Using Scopes
Created 2021-11-21 by @gjsjohnmurray to demonstrate https://github.com/microsoft/vscode/issues/137615

This sample was derived from [authenticationprovider-sample](https://github.com/microsoft/vscode-extension-samples/tree/main/authenticationprovider-sample), adding scopes but removing the logic for syncing between window instances and also the persistence in secret storage.

Registers and uses an authentication provider which supports multiple accounts and implements two scopes:

1. servername
2. username

## VS Code API

### `vscode` module

- [`authentication.registerAuthenticationProvider`](https://code.visualstudio.com/api/references/vscode-api#authentication.registerAuthenticationProvider)
- [`authentication.getSession`](https://code.visualstudio.com/api/references/vscode-api#authentication.getSession)

## Running the example

- Open this example in VS Code 1.60+
- `npm install`
- `cmd/ctrl+shift+b` or `npm run watch` or `npm run compile`
- `F5` to start debugging

1. Run the `SampleAuthProvider: Login on S1 as U1` command. When prompted, enter a fake password for user U1, such as 'p1'
1. Run the `SampleAuthProvider: Login on S1 as U2` command. When prompted, enter a fake password for user U2, such as 'p2'
1. Run the `SampleAuthProvider: Login on S1 (clearing session preference)` command.

On versions before 1.62 you will get a quickpick.

On 1.62 and 1.63 Insiders current at 2021-11-21 this quickpick does not appear. Instead, getSession is called with the specified scopes ['S1'] and you are prompted to enter a username, just as happens pre-1.62 when you take the 'Sign in to another account' option on the quickpick.
 