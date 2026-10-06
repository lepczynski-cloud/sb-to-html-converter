# Security policy

## Supported versions

Only the latest released version is supported with security fixes.

## Reporting a vulnerability

Please do not open a public issue for a suspected vulnerability. Use GitHub's
private vulnerability reporting feature in the repository's **Security** tab.
Include a description, reproduction steps, affected browser, and a minimal test
project when possible.

## Trust boundaries

Conversion is performed in the browser. The selected project file is not sent
to this project's server. A generated game may still access the network when it
uses cloud variables or custom extensions. Custom extensions run without a
sandbox in the generated game. Only convert projects and load extension sources
that you trust.
