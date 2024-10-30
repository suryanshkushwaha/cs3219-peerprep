import mongoose from 'mongoose';

// Define a schema and model for the document
const documentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  data: { type: Buffer, required: true },
});

const DocumentModel = mongoose.model('Document', documentSchema);

export async function getDocument(documentName: string): Promise<Uint8Array> {
  const document = await DocumentModel.findOne({ name: documentName });
  return document ? (document.data as Uint8Array) : new Uint8Array();
}

export async function storeDocument(documentName: string, state: Uint8Array): Promise<void> {
  await DocumentModel.updateOne(
    { name: documentName },
    { $set: { data: state } },
    { upsert: true }  // Insert if it doesn't exist
  );
}
