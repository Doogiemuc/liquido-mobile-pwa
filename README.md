# LIQUIDO

A modern aproach to Liquid Democracy

http://www.liquido.vote

# liquido-mobile-pwa

This is a mobile client for [LIQUIDO](http://www.liquido.vote). Based on the awesome Vue 2.6 PWA boilerplate [Peridot](https://github.com/Gingernaut/Peridot)

# Coding

## Development Code Features
* Progressive Web App (PWA) with Service Worker
* Code splitting and async component/route loading
* Automatic hot-reload in development
* Dockerized production setup with [pm2 load balancing](https://github.com/Unitech/pm2)
* Automatic removal of unused CSS/SCSS
* Global SCSS variables and easy theme customization
* Linting and formatting with [eslint](https://github.com/eslint/eslint) and [prettier](https://github.com/prettier/prettier)
* Uses [Buefy](https://buefy.github.io/#/) for styling


## Running
```bash
# Run in development
yarn run serve

# Building and running with Docker
docker build -t peridot .
docker run -p 8080:8080 peridot:latest

# Lint .vue, .js, .scss
yarn run lint
```

