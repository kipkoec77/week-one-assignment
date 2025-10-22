// queries.js - MongoDB Queries for Week 1 Assignment
// This file contains all the required MongoDB operations for the PLP Bookstore assignment

const { MongoClient } = require('mongodb');
require('dotenv').config();

// Connection URI from environment variables
const uri = process.env.MONGODB_URI;

// Debug: Check if environment variables are loaded
console.log('Environment check:');
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('DB_NAME:', process.env.DB_NAME || 'plp_bookstore');

// Validate connection string
if (!uri) {
  console.error(' Error: MONGODB_URI not found in environment variables');
  console.error('Please make sure you have a .env file with MONGODB_URI defined');
  process.exit(1);
}

// Database and collection names from environment variables
const dbName = process.env.DB_NAME || 'plp_bookstore';
const collectionName = process.env.COLLECTION_NAME || 'books';

// Create MongoDB client
const client = new MongoClient(uri);

// Task 2: Basic CRUD Operations
async function basicCRUDOperations() {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    console.log('\n=== TASK 2: BASIC CRUD OPERATIONS ===\n');

    // 1. Find all books in a specific genre
    console.log('1. Finding all Fiction books:');
    const fictionBooks = await collection.find({ genre: 'Fiction' }).toArray();
    fictionBooks.forEach(book => {
      console.log(`   - "${book.title}" by ${book.author} (${book.published_year})`);
    });

    // 2. Find books published after a certain year
    console.log('\n2. Finding books published after 1950:');
    const recentBooks = await collection.find({ published_year: { $gt: 1950 } }).toArray();
    recentBooks.forEach(book => {
      console.log(`   - "${book.title}" by ${book.author} (${book.published_year})`);
    });

    // 3. Find books by a specific author
    console.log('\n3. Finding books by George Orwell:');
    const orwellBooks = await collection.find({ author: 'George Orwell' }).toArray();
    orwellBooks.forEach(book => {
      console.log(`   - "${book.title}" (${book.published_year}) - $${book.price}`);
    });

    // 4. Update the price of a specific book
    console.log('\n4. Updating price of "The Great Gatsby":');
    const updateResult = await collection.updateOne(
      { title: 'The Great Gatsby' },
      { $set: { price: 15.99 } }
    );
    console.log(`   Updated ${updateResult.modifiedCount} document(s)`);
    
    // Verify the update
    const updatedBook = await collection.findOne({ title: 'The Great Gatsby' });
    console.log(`   New price: $${updatedBook.price}`);

    // 5. Delete a book by its title
    console.log('\n5. Deleting "Moby Dick":');
    const deleteResult = await collection.deleteOne({ title: 'Moby Dick' });
    console.log(`   Deleted ${deleteResult.deletedCount} document(s)`);

  } catch (error) {
    console.error('Error in basic CRUD operations:', error);
  }
}

// Task 3: Advanced Queries
async function advancedQueries() {
  try {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    console.log('\n=== TASK 3: ADVANCED QUERIES ===\n');

    // 1. Find books that are both in stock and published after 2010
    console.log('1. Books in stock AND published after 2010:');
    const inStockRecentBooks = await collection.find({
      in_stock: true,
      published_year: { $gt: 2010 }
    }).toArray();
    
    if (inStockRecentBooks.length === 0) {
      console.log('   No books found matching criteria');
    } else {
      inStockRecentBooks.forEach(book => {
        console.log(`   - "${book.title}" by ${book.author} (${book.published_year})`);
      });
    }

    // 2. Use projection to return only title, author, and price fields
    console.log('\n2. Books with projection (title, author, price only):');
    const projectedBooks = await collection.find({}, {
      projection: { title: 1, author: 1, price: 1, _id: 0 }
    }).limit(5).toArray();
    
    projectedBooks.forEach(book => {
      console.log(`   - "${book.title}" by ${book.author} - $${book.price}`);
    });

    // 3. Sorting by price (ascending)
    console.log('\n3. Books sorted by price (ascending):');
    const booksAscending = await collection.find({}).sort({ price: 1 }).limit(5).toArray();
    booksAscending.forEach(book => {
      console.log(`   - "${book.title}" - $${book.price}`);
    });

    // 4. Sorting by price (descending)
    console.log('\n4. Books sorted by price (descending):');
    const booksDescending = await collection.find({}).sort({ price: -1 }).limit(5).toArray();
    booksDescending.forEach(book => {
      console.log(`   - "${book.title}" - $${book.price}`);
    });

    // 5. Pagination (5 books per page)
    console.log('\n5. Pagination - Page 1 (first 5 books):');
    const page1 = await collection.find({}).skip(0).limit(5).toArray();
    page1.forEach((book, index) => {
      console.log(`   ${index + 1}. "${book.title}" by ${book.author}`);
    });

    console.log('\n   Pagination - Page 2 (next 5 books):');
    const page2 = await collection.find({}).skip(5).limit(5).toArray();
    page2.forEach((book, index) => {
      console.log(`   ${index + 1}. "${book.title}" by ${book.author}`);
    });

  } catch (error) {
    console.error('Error in advanced queries:', error);
  }
}

// Task 4: Aggregation Pipeline
async function aggregationPipelines() {
  try {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    console.log('\n=== TASK 4: AGGREGATION PIPELINES ===\n');

    // 1. Calculate average price by genre
    console.log('1. Average price by genre:');
    const avgPriceByGenre = await collection.aggregate([
      {
        $group: {
          _id: '$genre',
          averagePrice: { $avg: '$price' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { averagePrice: -1 }
      }
    ]).toArray();

    avgPriceByGenre.forEach(genre => {
      console.log(`   ${genre._id}: $${genre.averagePrice.toFixed(2)} (${genre.count} books)`);
    });

    // 2. Find the author with the most books
    console.log('\n2. Author with the most books:');
    const authorWithMostBooks = await collection.aggregate([
      {
        $group: {
          _id: '$author',
          bookCount: { $sum: 1 },
          books: { $push: '$title' }
        }
      },
      {
        $sort: { bookCount: -1 }
      },
      {
        $limit: 1
      }
    ]).toArray();

    if (authorWithMostBooks.length > 0) {
      const author = authorWithMostBooks[0];
      console.log(`   ${author._id}: ${author.bookCount} books`);
      console.log(`   Books: ${author.books.join(', ')}`);
    }

    // 3. Group books by publication decade and count them
    console.log('\n3. Books grouped by publication decade:');
    const booksByDecade = await collection.aggregate([
      {
        $addFields: {
          decade: {
            $multiply: [
              { $floor: { $divide: ['$published_year', 10] } },
              10
            ]
          }
        }
      },
      {
        $group: {
          _id: '$decade',
          count: { $sum: 1 },
          books: { $push: { title: '$title', author: '$author', year: '$published_year' } }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]).toArray();

    booksByDecade.forEach(decade => {
      console.log(`   ${decade._id}s: ${decade.count} books`);
      decade.books.forEach(book => {
        console.log(`     - "${book.title}" by ${book.author} (${book.year})`);
      });
    });

  } catch (error) {
    console.error('Error in aggregation pipelines:', error);
  }
}

// Task 5: Indexing
async function indexingOperations() {
  try {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    console.log('\n=== TASK 5: INDEXING ===\n');

    // 1. Create an index on the title field
    console.log('1. Creating index on title field:');
    try {
      await collection.createIndex({ title: 1 });
      console.log('   ✓ Index created on title field');
    } catch (error) {
      if (error.code === 85) {
        console.log('   ✓ Index on title field already exists');
      } else {
        console.log('   Error creating title index:', error.message);
      }
    }

    // 2. Create a compound index on author and published_year
    console.log('\n2. Creating compound index on author and published_year:');
    try {
      await collection.createIndex({ author: 1, published_year: 1 });
      console.log('   ✓ Compound index created on author and published_year');
    } catch (error) {
      if (error.code === 85) {
        console.log('   ✓ Compound index on author and published_year already exists');
      } else {
        console.log('   Error creating compound index:', error.message);
      }
    }

    // 3. Use explain() to demonstrate performance improvement
    console.log('\n3. Performance analysis with explain():');
    
    // Query without index (on genre field which has no index)
    console.log('\n   Query on genre field (no index):');
    const genreExplain = await collection.find({ genre: 'Fiction' }).explain('executionStats');
    console.log(`   - Execution time: ${genreExplain.executionStats.executionTimeMillis}ms`);
    console.log(`   - Documents examined: ${genreExplain.executionStats.totalDocsExamined}`);
    console.log(`   - Documents returned: ${genreExplain.executionStats.totalDocsReturned}`);

    // Query with index (on title field which has an index)
    console.log('\n   Query on title field (with index):');
    const titleExplain = await collection.find({ title: 'The Great Gatsby' }).explain('executionStats');
    console.log(`   - Execution time: ${titleExplain.executionStats.executionTimeMillis}ms`);
    console.log(`   - Documents examined: ${titleExplain.executionStats.totalDocsExamined}`);
    console.log(`   - Documents returned: ${titleExplain.executionStats.totalDocsReturned}`);

    // Query with compound index
    console.log('\n   Query using compound index (author + published_year):');
    const compoundExplain = await collection.find({ 
      author: 'George Orwell', 
      published_year: { $gt: 1940 } 
    }).explain('executionStats');
    console.log(`   - Execution time: ${compoundExplain.executionStats.executionTimeMillis}ms`);
    console.log(`   - Documents examined: ${compoundExplain.executionStats.totalDocsExamined}`);
    console.log(`   - Documents returned: ${compoundExplain.executionStats.totalDocsReturned}`);

    // List all indexes
    console.log('\n4. Current indexes on the collection:');
    const indexes = await collection.indexes();
    indexes.forEach((index, i) => {
      console.log(`   ${i + 1}. ${index.name}: ${JSON.stringify(index.key)}`);
    });

  } catch (error) {
    console.error('Error in indexing operations:', error);
  }
}

// Main function to run all tasks
async function runAllQueries() {
  try {
    console.log('🚀 Starting MongoDB Queries for Week 1 Assignment');
    console.log('=' .repeat(60));
    
    await basicCRUDOperations();
    await advancedQueries();
    await aggregationPipelines();
    await indexingOperations();
    
    console.log('\n' + '=' .repeat(60));
    console.log('✅ All MongoDB queries completed successfully!');
    
  } catch (error) {
    console.error('Error running queries:', error);
  } finally {
    await client.close();
    console.log('🔌 MongoDB connection closed');
  }
}

// Export functions for individual testing
module.exports = {
  basicCRUDOperations,
  advancedQueries,
  aggregationPipelines,
  indexingOperations,
  runAllQueries
};

// Run all queries if this file is executed directly
if (require.main === module) {
  runAllQueries().catch(console.error);
}
