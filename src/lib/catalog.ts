import { collection, deleteDoc, doc, onSnapshot, serverTimestamp, setDoc, writeBatch } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { starterPrograms } from '../data/programs'
import type { Program } from '../types'
import { db, storage } from './firebase'

const catalogRef = collection(db, 'programs')

export function subscribeToPrograms(onData: (programs: Program[]) => void, onError: (error: Error) => void) {
  return onSnapshot(catalogRef, (snapshot) => {
    const programs = snapshot.docs.map((item) => ({ ...item.data(), id: item.id }) as Program)
    onData(programs.length ? programs : starterPrograms)
  }, onError)
}

export async function saveProgram(program: Program) {
  await setDoc(doc(db, 'programs', program.id), {
    ...program,
    updatedAt: serverTimestamp(),
    createdAt: program.createdAt ?? serverTimestamp(),
  }, { merge: true })
}

export async function removeProgram(programId: string) {
  await deleteDoc(doc(db, 'programs', programId))
}

export async function publishStarterCatalog() {
  const batch = writeBatch(db)
  starterPrograms.forEach((program) => {
    batch.set(doc(db, 'programs', program.id), { ...program, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
  })
  await batch.commit()
}

export async function uploadProgramAsset(file: File, folder = 'program-assets') {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-')
  const fileRef = ref(storage, `${folder}/${crypto.randomUUID()}-${safeName}`)
  const result = await uploadBytes(fileRef, file, { contentType: file.type })
  return getDownloadURL(result.ref)
}
