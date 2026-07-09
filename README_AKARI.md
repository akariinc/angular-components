## Clone

Follow basically ./DEV_ENVIRONMENT.md

Configure github account on your local

Add upstream
```
git remote add upstream https://github.com/angular/components.git
git fetch upstream
```

install (19.x branches use pnpm, not yarn)
```
npm i -g pnpm
pnpm install --frozen-lockfile
npm i -g husky@9.0.11
```

test push
```
git push
```


If you are using asdf. husky might terminate your commit by error "pnpm: command not found".
for this, add ~/.config/husky/init.sh and add following line
```
export PATH=/Users/your-username/.asdf/shims:$PATH
```


## CI Error Troubleshoot

When a method or variable is added to a public class, the API goldens must be
regenerated before commit. On 19.x the goldens live in `goldens/<package>/...`
(not `tools/public_api_guard`), and are updated per package:

```
pnpm bazel run //goldens:cdk_api.accept
pnpm bazel run //goldens:material_api.accept
```

Check them the same way CI does:
```
pnpm bazel test goldens/...
```

## Fork changes

See CHANGELOG_AKARI.md. The fork touches:
- `src/cdk/listbox/` (display input + custom sanitizer)
- `src/material/tooltip/` (HTML/SVG message + custom sanitizer)
- `.github/workflows/ci.yml`, `.github/actions/slack`, `scripts/deploy/*` (fork CI/publishing)

The two sanitizer copies (`listbox-custom-sanitizer.ts`, `tooltip-custom-sanitizer.ts`)
must stay identical.

## Forked Repository

Add secrets
- ANGULAR_ROBOT_SLACK_TOKEN (Go to Slack API Console → https://api.slack.com/apps Create a Slack App → Generate Token and Scopes)
- SNAPSHOT_BUILDS_GITHUB_TOKEN (GitHub → Developer Settings → Personal Access Tokens → Generate new token (classic))

Snapshot builds are published by the `publish_snapshots` CI job to
https://github.com/akariinc/cdk-builds and https://github.com/akariinc/material-builds
(only the cdk and material packages are published).
