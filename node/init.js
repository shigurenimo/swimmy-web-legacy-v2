const admin = require('firebase-admin')

const config = require('../functions/config.json')

const projectId = process.env.GCLOUD_PROJECT || 'swimmy-171720'

const { serviceAccount } = config[projectId]

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})
