// collab-controller.js
const mongoose = require('mongoose');

// Define a schema and model for the document
const documentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  data: { type: Buffer, required: true },
});

const DocumentModel = mongoose.model('Document', documentSchema);

// Retrieve a document by name and return its data as a Uint8Array
async function getDocument(documentName) {
  const document = await DocumentModel.findOne({ name: documentName });
  return document ? new Uint8Array(document.data) : new Uint8Array();
}

// Update or insert a document with a given name and state
async function storeDocument(documentName, state) {
  await DocumentModel.updateOne(
    { name: documentName },
    { $set: { data: state } },
    { upsert: true }
  );
}

module.exports = { getDocument, storeDocument };
