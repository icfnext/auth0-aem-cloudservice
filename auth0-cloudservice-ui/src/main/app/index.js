import Auth0Lock from 'auth0-lock';

//TODO: Refactor into an options object
const Auth0Manager = function( clientId, domain, redirectUrl, returnUrl ) {

    const logoutReturnUrlStorageKey = 'com.icfolson.aem.auth0service.Auth0Manager.returnUrl';
    let logoutReturnUrl = sessionStorage.getItem( logoutReturnUrlStorageKey );

    if ( logoutReturnUrl ) {
        sessionStorage.removeItem( logoutReturnUrlStorageKey );
        return window.location.replace( logoutReturnUrl );
    }

    let eventCallbacks = {
        authenticated: [],
        logout: []
    };

    let authOptions = {
        sso: false,
        redirect: !!redirectUrl,
        responseType: "token"
    };

    if ( authOptions[ 'redirect' ] ) {
        authOptions[ 'redirectUrl' ] = redirectUrl;
    }

    if ( returnUrl ) {
        authOptions.state = returnUrl;
    }



    let lock = new Auth0Lock( clientId, domain, { auth: authOptions } );

    lock.on( 'authenticated', ( authResult ) => {
        lock.getUserInfo( authResult.accessToken, function ( error, profile ) {
            if ( error ) {
                //TODO: Handle error
                console.error( error );
                return;
            }

            authenticatedInformation = {
                accessToken: authResult.accessToken,
                profile: profile
            };
            persist();

            if ( authResult.state ) {
                window.location.replace( authResult.state );
                //TODO: decide if callbacks should be called even if we are redirecting somewhere
                return;
            }

            eventCallbacks.authenticated.forEach( callback => {
                callback( authenticatedInformation );
            } );
        } );
    } );

    let authenticatedInformation = JSON.parse( localStorage.getItem( 'com.icfolson.aem.auth0service.authenticationinfo' ) ) || {};

    let persist = function() {
        localStorage.setItem( 'com.icfolson.aem.auth0service.authenticationinfo', JSON.stringify( authenticatedInformation ) );
    };

    this.isAuthenticated = function() {
        return Promise.resolve( !!authenticatedInformation.accessToken );
    };

    this.getProfile = function() {
        return this.isAuthenticated()
            .then( authenticated => {
                if ( !authenticated ) {
                    throw new Error( 'User not authenticated' );
                }

                return authenticatedInformation.profile;
            } );
    };

    this.login = function() {
        return this.isAuthenticated()
            .then( authenticated => {

                if ( authenticated ) {
                    throw new Error('User already authenticated');
                }

                lock.show();

                return true;
            } );
    };

    this.logout = function() {
        authenticatedInformation = {};
        persist();

        let logoutOptions = {};

        if ( returnUrl ) {
            logoutOptions.returnTo = returnUrl;
        }

        //TODO: Allow for a separately configured URL
        sessionStorage.setItem( logoutReturnUrlStorageKey, window.location.href );

        lock.logout( {
            returnTo: redirectUrl
        } );

        return Promise.resolve();
    };

    this.onAuthenticated = function( callback ) {
        eventCallbacks.authenticated.push( callback );

        this.isAuthenticated()
            .then( authenticated => {
                if ( authenticated ) {
                    callback( authenticatedInformation );
                }
            } );

    };

    this.onLogout = function( callback ) {
        eventCallbacks.logout.push( callback );

        this.isAuthenticated()
            .then( authenticated => {
                if ( !authenticated ) {
                    callback();
                }
            } );
    }
};

window.Auth0Service = {
    Auth0Manager
};
