<h1 align="center">Conduit</h1>

![Node.js / Express / Typescript / MySql / Knex Example App](./.github/images/logo.png)

<p align="center">
  Example Node (Express + MySql) codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the <a href="https://github.com/gothinkster/realworld-example-apps">RealWorld</a> API spec.
</p>

<!-- The badges section -->
<p align="center">
<a href="https://github.com/kenyipp/realworld-nodejs-example-app/actions/workflows/ci.yml"><img src="https://github.com/kenyipp/realworld-nodejs-example-app/workflows/CI/badge.svg" alt="Actions Status"></a>
<a href="https://app.codacy.com/gh/kenyipp/realworld-nodejs-example-app/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade"><img src="https://img.shields.io/codacy/grade/d920979be4dc45feb55dcd462ef88229" /></a>
<a href="https://codecov.io/gh/kenyipp/realworld-nodejs-example-app"><img src="https://codecov.io/gh/kenyipp/realworld-nodejs-example-app/branch/master/graph/badge.svg?token=AMBNXM57T8" alt="codecov"></a>
<!-- Snyk.io vulnerabilities badge -->
<a href="https://snyk.io/test/github/kenyipp/realworld-nodejs-example-app"><img src="https://snyk.io/test/github/kenyipp/realworld-nodejs-example-app/badge.svg" alt="Known Vulnerabilities"></a>
<!-- Shields.io license badge -->
<a href="https://github.com/kenyipp/realworld-nodejs-example-app/blob/master/LICENSE"><img alt="License" src="https://img.shields.io/npm/l/downsample"/></a>
</p>

<p align="center"> This repository has complete functionality — pull requests and issues are welcome! </p>

<p align="center">
  <a href="#get_started">Get Started</a>
  <span>|</span>
  <a href="#contributing">Contributing</a>
  <span>|</span>
  <a href="#demo">Demo</a>
</p>

<a id="get_started"></a>

## Get Started
This project utilizes [PNPM](https://pnpm.io) as its package manager. Kindly ensure that you have installed PNPM before commencing work on this project.

### Local Development

To install all dependencies and launch the development server, execute the following commands:

```sh
pnpm install
pnpm run dev
```

Afterward, navigate to [http://localhost:3100/api/health-check](http://localhost:3100/api/health-check) to verify if the server is operating correctly.

To initialize the database in a non-production environment, you can use the POST API at [http://localhost:3100/api/reset](http://localhost:3100/api/reset), which quickly resets the database.

<a id="contributing"></a>

## Contributing

Please review the existing issues in this repository for areas that require improvement.
If you identify any missing or potential areas for improvement, feel free to open a new issue for them.

### Before commit

Before deploying and integrating the application, it is necessary to perform a series of validations such as testing, linting, and formatting. We recommend running `make pre-commit` before making each commit to ensure compliance.

## License
This project is licensed under the MIT License - see the [MIT](LICENSE) file for details.
