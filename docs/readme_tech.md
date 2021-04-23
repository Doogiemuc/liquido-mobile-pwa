# Liquido Mobile

Designed for small groups, e.g. social societeies, SMEs, pupils (suggest age >10), open source communities
Liquido Mobile has a uch simpler concept than the larger web based www.Liquido.vote

# Use Cases

[LIQUIDO - Easiest use case flow possible.svg](./LIQUIDO - Easiest use case flow possible.svg)

# Devlepment Roadmap

 * Local data store/cache for polls with proposals => liquido-store or VueApollo InMemoryStore
 * Replace Jquery with Bootstrap.native Javascript http://thednp.github.io/bootstrap.native/index.html

## Screenflow

See ./doc/screenshots


# Support nice developer experience

## Logging on Mobile Device when developping

 * https://github.com/christlee1989/vue-mobile-log
 * TODO: Use Visual Studio Code Chrome Debugger with Vue  https://medium.com/@brockreece/how-i-stopped-using-console-log-when-debugging-vue-components-14e0f7aa280d
 * TODO: Create a Vue Plugin that can show a loging component on mobile phone.

## Client side storage and caching

### Library evaluation

 * https://web.dev/storage-for-the-web/  Nice overview article
 * https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API   Mozilla IndexDB  -> complicated
 * https://www.npmjs.com/package/idb   Promise based wrapper around indexdb
 * https://github.com/mWater/minimongo  - or go the mongo way?
 * Wrote my (first :-)  own npm module  populating-cache


# Test

## Unit Tests

There are **mocha** unit tests in the `test` directory. We use (bable-node)[https://babeljs.io/docs/en/next/babel-node.html] to run them, so that moch can understand the ES6 `import` statements. Simply run tests with

    npm run unit-tests

## Integration tests

## End-2-End tests

We use Cypress.io to for automated end-2-end tests. Cypress is like Selenium and automatically interacts with the web frontend of our PWA. These tests like exactkly like a normal user would. They cover then frontend, calls to the backend API, and everything in the backend including the database.




MAYBE: Simulate test on mobile phone with this very nice mobile simulator: http://mobiletest.me/apple_iphone_6s/8028826 





# Backend

## AWS Lambda Function via AWS API Gateway

https://github.com/awsdocs/aws-lambda-developer-guide/tree/master/sample-apps/nodejs-apig

## Micronaut

See this very nice blog post by adesso that compares Spring to Micronaut.
https://www.adesso.de/de/news/blog/micronaut-eine-alternative-zu-spring-4.jsp

=> Install Micronaut
=> Use Micronaut CLI project generator "mn" 

## sparkjava.com

Still TODO

# Furhter Links & Resources

 * node/express and ORMs:  https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose   e.g. mongoose, objection, graphql
 * node/express REST with mongoose example:  https://github.com/makinhs/rest-api-tutorial 