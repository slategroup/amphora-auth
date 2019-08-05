# AWS Cognito OAuth

A wrapper around the [Passport Cognito OAuth](https://www.npmjs.com/package/passport-cogito-oauth2) package.

### Configuration

- `COGNITO_CONSUMER_CLIENT` _(required)_: the client key setup in AWS cognito.
- `COGNITO_CONSUMER_SECRET` _(required)_: the secret setup in cognito. This can be blank.
- `COGNITO_CONSUMER_DOMAIN` _(required)_: the base url used for authentication for AWS cognito.
- `COGNITO_CONSUMER_REGION` _(required)_: the region of the aws server.
