# FileTool - File Operations Application

FileTool is an application built in Node.js using the Express framework and TypeScript. The main purpose of this application is to allow users to perform various operations on individual files or collections of files, including ZIP files. The application also utilizes the well-known Knuth-Morris-Pratt (KMP) algorithm for text searching.

### Features

- Provides an endpoint /tool, allowing the execution of various operations on a single file.
- Offers an /tool/zip endpoint, enabling operations on files within a ZIP archive.

### 🚀 Technologies

- Node.js
- Express.js
- TypeScript
- Zod
- Multer
- jszip
- pdf-lib
- jest

### Allowed actions

- Deleting a phrase from a file - a status is returned upon a successful deletion.
- Updating a phrase in a file - a status is returned upon a successful update.
- Finding a phrase in a file - the count of found phrases is returned as a result.

### Utilized Algorithm

FileTool employs the Knuth-Morris-Pratt (KMP) algorithm to efficiently search for phrases in text. This algorithm is used to identify occurrences of phrases in the text and can be adapted to various search modes.

### ✅ Requirements

Before starting, you need to have Git and Node installed.

### Run locally - backend

```bash
# Clone the project
$ git clone https://github.com/Kamgre7/file-tool.git

# Go to the project directory
$ cd file-tool-app

# Install dependencies
$ npm install

# Start the server
$ npm run start
```
