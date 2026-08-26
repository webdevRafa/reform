import { randomUUID } from 'node:crypto'
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { FieldValue, getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(scriptDirectory, '..')
const argumentValue = (name) => {
  const index = process.argv.indexOf(name)
  return index >= 0 ? process.argv[index + 1] : undefined
}

const serviceAccountPath = argumentValue('--service-account') || process.env.GOOGLE_APPLICATION_CREDENTIALS
const dryRun = process.argv.includes('--dry-run')

if (!serviceAccountPath) {
  throw new Error('Provide --service-account <path> or set GOOGLE_APPLICATION_CREDENTIALS.')
}
if (!existsSync(serviceAccountPath)) {
  throw new Error(`Service account file was not found: ${serviceAccountPath}`)
}

const serviceAccount = JSON.parse(await readFile(serviceAccountPath, 'utf8'))
const envPath = path.join(projectRoot, '.env.local')
const envText = existsSync(envPath) ? await readFile(envPath, 'utf8') : ''
const env = Object.fromEntries(envText.split(/\r?\n/).map((line) => line.match(/^\s*([^#=]+)=(.*)$/)).filter(Boolean).map((match) => [match[1].trim(), match[2].trim().replace(/^['"]|['"]$/g, '')]))
const bucketName = env.VITE_FIREBASE_STORAGE_BUCKET || `${serviceAccount.project_id}.firebasestorage.app`

const app = getApps()[0] ?? initializeApp({ credential: cert(serviceAccount), storageBucket: bucketName })
const db = getFirestore(app)
const bucket = getStorage(app).bucket(bucketName)
const programsPath = path.join(scriptDirectory, 'seed-data', 'programs.json')
const programs = JSON.parse(await readFile(programsPath, 'utf8'))

console.log(`Preparing ${programs.length} program records for project ${serviceAccount.project_id}.`)
console.log(`Storage bucket: ${bucketName}`)

const localAssets = [...new Set(programs.flatMap((program) => [program.image, ...program.lessons.map((lesson) => lesson.thumbnail)]).filter((value) => value?.startsWith('/programs/')))]
const uploadedUrls = new Map()

for (const assetPath of localAssets) {
  const sourcePath = path.join(projectRoot, 'public', assetPath.replace(/^\//, ''))
  if (!existsSync(sourcePath)) throw new Error(`Seed asset is missing: ${sourcePath}`)
  const destination = `program-covers/${path.basename(sourcePath)}`
  const token = randomUUID()
  if (!dryRun) {
    await bucket.upload(sourcePath, {
      destination,
      resumable: false,
      metadata: {
        contentType: 'image/png',
        cacheControl: 'public,max-age=31536000,immutable',
        metadata: { firebaseStorageDownloadTokens: token },
      },
    })
  }
  const url = `https://firebasestorage.googleapis.com/v0/b/${encodeURIComponent(bucketName)}/o/${encodeURIComponent(destination)}?alt=media&token=${token}`
  uploadedUrls.set(assetPath, url)
  console.log(`${dryRun ? 'Would upload' : 'Uploaded'} ${assetPath} -> ${destination}`)
}

if (!dryRun) {
  const batch = db.batch()
  for (const program of programs) {
    const hydrated = {
      ...program,
      image: uploadedUrls.get(program.image) || program.image,
      lessons: program.lessons.map((lesson) => ({ ...lesson, thumbnail: uploadedUrls.get(lesson.thumbnail) || lesson.thumbnail })),
      seededAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    }
    batch.set(db.collection('programs').doc(program.id), hydrated, { merge: true })
  }
  batch.set(db.collection('system').doc('catalog'), {
    version: 1,
    programCount: programs.length,
    source: 'scripts/seed-data/programs.json',
    updatedAt: FieldValue.serverTimestamp(),
  }, { merge: true })
  await batch.commit()
  console.log(`Seed complete: ${programs.length} Firestore records and ${localAssets.length} Storage assets.`)
} else {
  console.log(`Dry run complete: ${programs.length} Firestore records and ${localAssets.length} Storage assets would be written.`)
}
