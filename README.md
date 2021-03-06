# Scaffold 🦴

> The Athenna scaffold project used by 'athenna new project' command to create your project.

[![GitHub followers](https://img.shields.io/github/followers/athennaio.svg?style=social&label=Follow&maxAge=2592000)](https://github.com/athennaio?tab=followers)
[![GitHub stars](https://img.shields.io/github/stars/athennaio/scaffold.svg?style=social&label=Star&maxAge=2592000)](https://github.com/athennaio/scaffold/stargazers/)

<p>
    <a href="https://www.buymeacoffee.com/athenna" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>
</p>

<p>
  <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/athennaio/scaffold?style=for-the-badge&logo=appveyor">

  <img alt="Repository size" src="https://img.shields.io/github/repo-size/athennaio/scaffold?style=for-the-badge&logo=appveyor">

  <img alt="License" src="https://img.shields.io/badge/license-MIT-brightgreen?style=for-the-badge&logo=appveyor">

  <img alt="Commitizen" src="https://img.shields.io/badge/commitizen-friendly-brightgreen?style=for-the-badge&logo=appveyor">
</p>

<img src="https://raw.githubusercontent.com/AthennaIO/Scaffold/9d2247f0afce10b754e171b0ac23062eeb2f5024/.github/logo.svg" width="200px" align="right" hspace="30px" vspace="100px">

## Running project

> First creates your .env and .env.test file:

```shell
cp .env.example .env && cp .env.example .env.test
```

> Creates a new PostgreSQL container in port 5433 using docker:

```shell
docker run --name=postgres-devel -e POSTGRES_PASSWORD=root -p 5433:5432 -d postgres
```

> Install dependencies, migrate database and generate your prisma files:

```shell
npm install && node artisan db:migrate && node artisan db:generate
```

> Start the project:

```shell
node artisan serve
```

## Links

> For project documentation [click here](https://athenna.io). If something is not clear in the documentation please open an issue in the [documentation repository](https://github.com/athennaio/docs)

## Contributing

> If you want to contribute to this project, first read the [CONTRIBUTING.MD](https://github.com/AthennaIO/Core/blob/develop/CONTRIBUTING.md) file. It will be a pleasure to receive your help.

---

Made with 🖤 by [Athenna Team](https://github.com/AthennaIO) :wave:
