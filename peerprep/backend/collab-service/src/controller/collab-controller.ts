import mongoose from 'mongoose';                       

// Define a schema and model for the document
const documentSchema = new mongoose.Schema({      
  name: { type: String, required: true },         
  data: { type: Buffer, required: true },         
});

const DocumentModel = mongoose.model('Document', documentSchema);

// Asynchronous function to retrieve a document by name and return its `data` as a Uint8Array.
export async function getDocument(documentName: string): Promise<Uint8Array> {
  const document = await DocumentModel.findOne({ name: documentName }); // Searches for a document in MongoDB with a `name` field matching `documentName`.
  return document ? (document.data as Uint8Array) : new Uint8Array();  // If the document is found, it returns `document.data` cast to `Uint8Array`; otherwise, returns an empty `Uint8Array`.
}

// Asynchronous function to update or insert a document with a given name and state.
export async function storeDocument(documentName: string, state: Uint8Array): Promise<void> {
  await DocumentModel.updateOne(
    { name: documentName }, // Finds a document with `name` equal to `documentName`.
    { $set: { data: state } }, // Sets the `data` field to the provided `state` (Uint8Array).
    { upsert: true } // If no document matches `documentName`, inserts a new document.
  );
}
