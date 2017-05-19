# Auth0 Authentication Cloud Service

An AEM Cloud Service implementation wrapping Auth0 Authentication using Lock.

This is a work in progress implementation as presented at Adobe Immerse 2017.

## Installation 

The custom service can be installed either directly using the Maven 
command below or may be included as a deployable package in another 
module.

```
mvn -P local clean install
```

Prior to your first build you will need to also run `npm run build`
until such a time as I clean up that mess.

## Usage

### Configuration

Instances of the Auth0 Cloud Service are configured through the 
AEM Cloud Services administrative dashboard.  Each instance must 
include the following information:

* Client ID - ID of the Auth0 client
* Domain - Domain of the Auth0 account

These values are acquired from Auth0.  For more information about 
setting up Auth0 clients see 
[the Auth0 Client documentation](https://auth0.com/docs/clients).

### API

When associated to a site or application the cloud service exposes 
a front end API under the global variable `auth0Manager`.

#### #isAuthenticated: Promise\<boolean\>
```
auth0Manager.isAuthenticated()
    .then( authenticated => { console.log( authenticated ) } );
```

#### #getProfile: Promise\<any\>

Returns a Promise of a user profile.  The profile is the profile object 
provided by Auth0 Lock's `getUserInfo` method.

```
auth0Manager.getProfile()
    .then( profile => { console.log( profile.email ) } );
```

#### #login: Promise\<any\>

Initializes the Lock login.  Returns a promise of authentication.  This 
promise would only be used in Popup mode as in non-popup mode a 
redirection will occur. 

```
auth0Manager.login();
```

#### #logout: Promise\<any\>

Initializes the Lock logout.  Returns a promise of logout.  This promise 
would only be used in Popup mode as in non-popup mode a redirection 
will occur. 

```
auth0Manager.logout();
```

#### #onAuthenticated(callback: function)

Adds an authentication callback.  The callback will be invoked after 
successful authentication or immediately if the user is already 
authenticated.

#### #onLogout(callback: function) 

Adds a logout callback.  The callback will be invoked after
successful logout or immediately if the user is not authenticated.

## Future Development / TODO List

* Front-end-first the build so that `npm run build` runs the front end build and the AEM package build
* Front-end-first deployment so that `npm run deploy` runs the build and deploys the AEM package
* Enable some mechanism to setup a static logout and login path - currently it just uses the site root
* Allow for popup mode for Cordova applications
* Facilitate the refresh token dance
* Enable server-side authentication in AEM (ie, create new users)
* Allow for a non-lock mode for cases where the Auth0 API is to be used directly

