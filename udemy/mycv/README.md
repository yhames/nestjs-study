<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[NestJS : 개발자를 위한 완벽 가이드 2024](https://www.udemy.com/course/nestjs-complete-developers-guide-korean/?couponCode=KEEPLEARNING) 예제 코드

## Setup

본 예제코드는 Heroku에 배포하기 위한 설정이 되어있습니다.

Heroku에 배포하기 위해서는 다음과 같은 설정이 필요합니다.

### Heroku 프로젝트 생성

새로운 Heroku 프로젝트를 생성합니다.

```bash
$ heroku create
```

위 명령어를 실행하면 프로젝트 URL이 생성됩니다.

### Heroku Database 생성

Heroku에 Database를 생성합니다.

hobby-dev는 무료로 사용할 수 있는 데이터베이스입니다.

```bash
$ heroku addons:create heroku-postgresql:hobby-dev
```

위 명령어를 사용하면 DATABASE_URL 환경변수가 자동으로 생성됩니다.

DATABASE_URL 환경변수는 ormconfig.js에서 사용됩니다.

### Heroku 환경변수 설정

프로젝트에서 사용할 환경변수들을 설정합니다.

```bash
heroku config:set COOKIE_KEY={secret_key}
```
```bash
heroku config:set NODE_ENV=production
```

### Heroku 배포

모든 변경사항을 Heroku의 Git repository에 push 합니다.

```bash
git push heroku master
```

위 명령어를 실행하면 프로젝트 빌드 결과가 출력 됩니다.
