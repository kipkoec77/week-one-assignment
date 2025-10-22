// Basic MongoDB Connection Example
require('dotenv').config();
const { MongoClient } = require('mongodb');

// Connection URI from environment variables
const uri = process.env.MONGODB_URI;

// Database Name from environment variables
const dbName = process.env.DB_NAME;

// Create a new MongoClient
const client = new MongoClient(uri);

async function main() {
  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log('Connected successfully to MongoDB server');
    
    // Get reference to the database
    const db = client.db(dbName);
    
    // Get reference to the books collection
    const booksCollection = db.collection('books');
    
    // Example: Insert a document
    const insertResult = await booksCollection.insertOne({
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      year: 1937,
      pages: 310
    });
    
    console.log('Inserted document:', insertResult);
    
    // Example: Find documents
    const findResult = await booksCollection.find({}).toArray();
    console.log('Found documents:', findResult);
    
  } catch (err) {
    console.error('Error occurred:', err);
  } finally {
    // Close the connection when done
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the main function
main().catch(console.error); 

