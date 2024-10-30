import { db } from '../../config/db';

export async function getDocument(documentName: string): Promise<Uint8Array> {
  const document = await db.findOne({ name: documentName });
  return document ? (document.data as Uint8Array) : new Uint8Array();
}

export async function storeDocument(documentName: string, state: Uint8Array): Promise<void> {
  await db.updateOne(
    { name: documentName },
    { $set: { data: state } },
    { upsert: true }  // Insert if not exists
  );
}
