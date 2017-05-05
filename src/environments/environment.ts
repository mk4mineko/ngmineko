// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyDLnIMA8CYapT4tcl1XTjOikPn7UBa33QE",
    authDomain: "mineko-db15a.firebaseapp.com",
    databaseURL: "https://mineko-db15a.firebaseio.com",
    projectId: "mineko-db15a",
    storageBucket: "mineko-db15a.appspot.com",
    messagingSenderId: "672676315905"
  },
  baseurl: 'http://localhost:8888/'
};
