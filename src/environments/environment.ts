export const environment = {
  name: 'default',
  production: false,
  hmr: true,
  firebase: {
    apiKey: 'AIzaSyBmZ8J8ThdpIlxGirqm9bTZocT-s9pqVMs',
    authDomain: 'swimmy-171720.firebaseapp.com',
    databaseURL: 'https://swimmy-171720.firebaseio.com',
    projectId: 'swimmy-171720',
    storageBucket: 'swimmy-171720.appspot.com',
    messagingSenderId: '105044844269'
  },
  algolia: {
    applicationId: 'XRBNOKQFEJ',
    apiKey: '241fe0713faa216eddcc12a06fab6a1e'
  },
  function: 'https://us-central1-swimmy-171720.cloudfunctions.net',
  graphql: 'https://us-central1-swimmy-171720.cloudfunctions.net/graphql/',
  enablePersistence: false
};
