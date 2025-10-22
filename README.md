# MongoDB Week 1 Assignment - Submission

## Assignment Overview
This repository contains the complete implementation of MongoDB Fundamentals Week 1 assignment, demonstrating proficiency in CRUD operations, advanced queries, aggregation pipelines, and indexing.

## Files Submitted
- `insert_books.js` - Database population script with environment validation
- `queries.js` - All MongoDB operations and queries with debugging
- `package.json` - Dependencies configuration (includes dotenv)
- `.env` - Environment variables (create this file with your credentials)
- `.gitignore` - Git ignore file (protects .env from being committed)
- `README.md` - This documentation

## How to Run This Assignment

### Prerequisites
- Node.js (v18 or higher) installed
- MongoDB Atlas account or local MongoDB installation
- Git (to clone the repository)

### Step 1: Clone and Setup
```bash
git clone <repository-url>
cd mongodb-data-layer-fundamentals-and-advanced-techniques-kipkoec77
npm install
```

### Step 2: Configure Environment Variables
Create a `.env` file in the project root directory with your MongoDB connection details:



### Step 3: Populate the Database
Run the script to insert sample book data:

```bash
npm start
# or
node insert_books.js
```

**Expected Output:**
```
Environment check:
MONGODB_URI exists: true
DB_NAME: plp_bookstore
Connected to MongoDB server
12 books were successfully inserted into the database
```

### Step 4: Execute All Assignment Queries
Run all MongoDB operations to demonstrate assignment completion:

```bash
npm run queries
# or
node queries.js
```

**Expected Output:** Detailed execution of all 5 assignment tasks with results and performance metrics.

## Assignment Tasks Completed

### ✅ Task 1: MongoDB Setup
- Connected to MongoDB Atlas cluster
- Created `plp_bookstore` database
- Created `books` collection
- Populated with 12 sample book documents

### ✅ Task 2: Basic CRUD Operations
- Find all books in a specific genre
- Find books published after a certain year
- Find books by a specific author
- Update the price of a specific book
- Delete a book by its title

### ✅ Task 3: Advanced Queries
- Find books that are both in stock and published after 2010
- Use projection to return only title, author, and price fields
- Implement sorting by price (ascending and descending)
- Use `limit` and `skip` methods for pagination (5 books per page)

### ✅ Task 4: Aggregation Pipeline
- Calculate average price of books by genre
- Find the author with the most books in the collection
- Group books by publication decade and count them

### ✅ Task 5: Indexing
- Create an index on the `title` field for faster searches
- Create a compound index on `author` and `published_year`
- Use `explain()` method to demonstrate performance improvements

## Verification Steps for Examiner

1. **Environment Setup:** Verify `.env` file is created with valid MongoDB connection
2. **Database Population:** Run `npm start` and confirm 12 books are inserted
3. **Query Execution:** Run `npm run queries` and verify all tasks execute successfully
4. **Output Validation:** Check that all 5 assignment tasks show proper results
5. **Performance Analysis:** Confirm indexing examples show execution statistics

## Troubleshooting for Examiner

### Environment Variables Not Found
```
MONGODB_URI exists: false
```
**Solution:** Ensure `.env` file exists in project root with correct format

### Connection Issues
**Solutions:**
- Verify MongoDB Atlas connection string in `.env` file
- Ensure IP is whitelisted in Atlas
- Check username and password are correct
- Confirm cluster is running

### File Creation Issues
**Solutions:**
- Use PowerShell: `@""@ | Out-File -FilePath ".env" -Encoding utf8`
- Ensure no spaces around `=` in `.env` file
- Don't wrap values in quotes

## Security Features Implemented
- ✅ Environment variables protect credentials
- ✅ `.env` file is ignored by Git (won't be committed)
- ✅ Debug validation shows if environment variables are loaded
- ✅ Error handling prevents crashes with helpful messages

## Expected Database Schema
The `plp_bookstore.books` collection contains documents with:
```javascript
{
  title: String,           // Book title
  author: String,          // Author name
  genre: String,           // Book genre
  published_year: Number, // Publication year
  price: Number,          // Book price
  in_stock: Boolean,      // Availability status
  pages: Number,          // Number of pages
  publisher: String       // Publisher name
}
```

## Assignment Completion Verification
All required MongoDB operations are implemented and functional. The scripts demonstrate:
- Proper MongoDB connection and error handling
- Complete CRUD operations
- Advanced query techniques
- Aggregation pipeline usage
- Indexing strategies with performance analysis

**Ready for grading and review.**
