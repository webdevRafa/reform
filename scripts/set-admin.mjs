import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

const argumentValue = (name) => {
  const index = process.argv.indexOf(name)
  return index >= 0 ? process.argv[index + 1] : undefined
}

const serviceAccountPath = argumentValue('--service-account') || process.env.GOOGLE_APPLICATION_CREDENTIALS
const email = argumentValue('--email')
const remove = process.argv.includes('--remove')

if (!serviceAccountPath || !existsSync(serviceAccountPath)) throw new Error('Provide a valid --service-account <path>.')
if (!email) throw new Error('Provide the Google account email with --email <address>.')

const serviceAccount = JSON.parse(await readFile(serviceAccountPath, 'utf8'))
const app = getApps()[0] ?? initializeApp({ credential: cert(serviceAccount) })
const auth = getAuth(app)
const user = await auth.getUserByEmail(email)
const claims = { ...(user.customClaims || {}) }

if (remove) delete claims.admin
else claims.admin = true

await auth.setCustomUserClaims(user.uid, claims)
await auth.revokeRefreshTokens(user.uid)

console.log(`${remove ? 'Removed' : 'Granted'} RE:FORM admin access for ${user.email}.`)
console.log('The user must sign out and sign in again before the role appears in the browser.')
