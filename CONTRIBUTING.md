# Contributing

We welcome bug reports, feature requests, documentation improvements, and pull requests
for EMQX Dashboard.

## Licensing and Contributions

The [Business Source License 1.1](./LICENSE) permits copying, modifying, creating
derivative works, redistributing, and non-production use of the covered code. You can
fork the repository, develop changes, and submit pull requests. Use and distribution
of your fork remain subject to the applicable license, including the conditions for
production use. Keep the license with copies you distribute.

Only contribute code that you have the right to submit. Identify any third-party
code and its license in your pull request.

## Which Branch to Target

Dashboard maintains multiple release lines. Target the branch for the Dashboard
version affected by your change, and mention the corresponding Broker version in
your pull request. If you are unsure which branch to use, ask the maintainers for
guidance before opening duplicate pull requests for other release lines.

## Local Development

See the [README](./README.md) for local development setup and cloud host configuration
for connecting to a Broker. Use a Broker version compatible with the Dashboard branch.

- Install dependencies with `pnpm install`.
- Start the standard development server with `pnpm dev`, or use
  `pnpm dev:enterprise` for the enterprise edition.
- Build with `pnpm build` or `pnpm build:enterprise`, as appropriate for your change.
- Run `pnpm lint` to lint and fix source files. This command modifies files; review
  the resulting diff and keep unrelated changes out of your pull request.

## Pull Requests

Describe the problem, the resulting behavior, the affected Dashboard and Broker
versions, and how you verified the change. Link related issues and include screenshots
for visible UI changes when helpful. Keep each pull request focused on one change.

## Commit Message Guidelines

Follow the EMQX commit message format:

```text
<type>(<optional scope>): <subject>

<optional body>

<optional footer>
```

Use `feat`, `fix`, `docs`, `style`, `refactor`, `chore`, `perf`, `test`, `build`, `ci`,
or `revert` as the type. Choose a scope that describes the affected area when helpful.
Write the subject in the imperative, start with lowercase, and omit a trailing period.
Keep each line within 100 characters.

Explain the reason for the change in the body when needed. Use the footer for issue
references, such as `Closes #123`, and describe breaking changes with `BREAKING CHANGE:`.

For example:

```text
fix(overview): correct the displayed connection count

Closes #123
```
