## Clone

Follow basically ./DEV_ENVIRONMENT.md

Configure github account on your local

Add upstream
```
git remote add upstream https://github.com/angular/components.git
git fetch upstream
```

install
```
npm i -g yarn
yarn
npm i -g husky@9.0.11
```

test push
```
git push
```


If you are using asdf. husky might terminate your commit by error "yarn: command not found".
for this, add ~/.config/husky/init.sh and add following line
```
export PATH=/Users/your-username/.asdf/shims:$PATH
```


## CI Error Troubleshoot

When added method or variable, you need to build documentation before commit.

Update doc before commit
```
yarn bazel run //tools/public_api_guard:cdk/listbox.md_api.accept
yarn bazel run //tools/public_api_guard:material/tooltip.md_api.accept
```

Error
```
INFO: Build completed, 1 test FAILED, 1174 total actions
//tools/public_api_guard:cdk/listbox.md_api                              FAILED in 5.1s
  /home/runner/.cache/bazel/_bazel_runner/9602449184b26e1db8d4fe96b3c76117/execroot/angular_material/bazel-out/k8-fastbuild/testlogs/tools/public_api_guard/cdk/listbox.md_api/test.log

Executed 99 out of 99 tests: 98 tests pass and 1 fails locally.
There were tests whose specified size is too big. Use the --test_verbose_timeout_warnings command line option to see which ones these are.
error Command failed with exit code 3.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
```

## Forked Repository

Add secrets
- ANGULAR_ROBOT_SLACK_TOKEN (Go to Slack API Console → https://api.slack.com/apps Create a Slack App → Generate Token and Scopes)
- SNAPSHOT_BUILDS_GITHUB_TOKEN (GitHub → Developer Settings → Personal Access Tokens → Generate new token (classic))
