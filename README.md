# Bogus Story Meter

> Digging through the Internet for reliable information is a tedious task. A plethora of misinformation coexists with reliable data. Bogus Story Meter is a web app and Chrome extension that aims to make this process easier by displaying user-generated ratings as well as AI insights to quickly inform users of a URL's trustworthiness and accuracy of the presented information.

http://198.199.71.9:8080/about

## Team

  - __Product Owner__: Ciaran Conners
  - __Scrum Master__: Patrick Tang
  - __Development Team Members__: John Roxborough, Scott Rudiger

## Table of Contents

1. [Development](#development)
1. [Requirements](#requirements)
    1. [Installing Dependencies](#installing-depend
    1. [Usage](#Usage)
    1. [Tasks](#tasks)
1. [Team](#team)
1. [Contributing](#contributing)

## Development

### Requirements

- Node 6.11.1
- MySQL
- Redis 2.7.1

> Make sure the following dependencies are installed on your system:

> Node 6.11.1 or later
```sh
$ node -v
```
> NPM
```sh
$ npm -v
```
> MySQL
```sh
$ msql --version
```
> Redis 2.7.1 or later
```sh
$ redis-server -v
```
> Sass 3.5.1 or later
```sh
$ sass -v
```

### Installing Dependencies

From within the root directory:

```sh
$ npm install
```
then
```sh
$ cd extension
$ bower install
```

### Usage
> Start redis-server
```sh
$ redis-server &
```
> Access the local MySQL database for development with
```sh
$ mysql -u root -p
```
> hit enter and create a database called "bsm"
```sh
$ create database BSM;
```
> Start node server with
```sh
$ npm run start-dev
```
> seed database by running npm test twice (will change when we add seeding file)
```sh
$ npm test
```
> to transpile .scss files to css
```sh
npm run sass-watch
```
> go to chrome://extensions in the browser

> click load unpacked extension...
> select bogus-story-meter/extension directory
> webapp is available at http://localhost:8080

### Roadmap

View the project roadmap [here](LINK_TO_PROJECT_ISSUES)


### Contributing

See [CONTRIBUTING.md](_CONTRIBUTING.md) for contribution guidelines.
