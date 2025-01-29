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



## Forked Repository

Add secrets
- ANGULAR_ROBOT_SLACK_TOKEN (Go to Slack API Console → https://api.slack.com/apps Create a Slack App → Generate Token and Scopes)
- SNAPSHOT_BUILDS_GITHUB_TOKEN (GitHub → Developer Settings → Personal Access Tokens → Generate new token (classic))