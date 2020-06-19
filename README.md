# [Contemos](https://contemos.app/)
[![Netlify Status](https://api.netlify.com/api/v1/badges/76b2c0c2-90cd-43dc-9fb6-1b9b85d6bf46/deploy-status)](https://app.netlify.com/sites/nervous-lewin-928377/deploys)

An [app](https://contemos.app/) to help foreign language students practice audio comprehension of numbers.

### Running locally

Create `.envrc` file with relevant settings

```
#starts go server that mimics api gateway / lambda
make run-dev-server

make client-run
```

### Test

```
make setup-tests
make test
make cleanup-tests
```
