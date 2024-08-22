# CouchDB CRUD SDK


## Overview

CouchDB/Cloudant CRUD SDK for JavaScript

This front-end application would access to (CORS-enabled)CouchDB/Cloudant with REST APIs, and enables CRUD operations.


## Pre-requisites

- Your CouchDB/Cloudant has to be ..

  - CORS enabled

    - In CouchDB/Cloudant dashboard, you need to enabled CORS and your domain have to be in Origin Domains:

    - ![CORS enabled](https://dotnsf.github.io/couchdb-crud-sdk/img_00.png)

  - accessible by username and password.


## How to use JavaScript library

- 1. Import `couchdb-crud-sdk.js` in HTML
  - `<script src="https://dotnsf.github.io/couchdb-crud-sdk/couchdb-crud-sdk.js"></script>`

- 2. Initialize `CoubhDB_CRUD_SDK` object with (basic authentication)username, password, and base_url of CouchDB(like `http://localhost:5984`).
  - `var cdb = new CouchDB_CRUD_SDK( username, password, base_url );`

- 3. Use following APIs


## APIs

- APIs for database
  - Login
    - `var r = await cdb.login();` or
    - `cdb.createDb().then( function( r ){`
    - `  :`
    - `});`
  - Create database
    - `var r = await cdb.createDb( 'db' );` or
    - `cdb.createDb( 'db' ).then( function( r ){`
    - `  :`
    - `});`
  - Read all databases
    - `var r = await cdb.readAllDbs();` or
    - `cdb.readAllDbs().then( function( r ){`
    - `  :`
    - `});`
  - Delete database
    - `var r = await cdb.deleteDb( 'db' );` or
    - `cdb.deleteDb( 'db' ).then( function( r ){`
    - `  :`
    - `});`

- APIs for document(s)
  - Create document
    - `var r = await cdb.createDoc( 'db', { name: 'name01', price: 100 } );` or
    - `cdb.createDoc( 'db', { name: 'name01', price: 100 } ).then( function( r ){`
    - `  :`
    - `});`
  - Read document
    - `var r = await cdb.readDoc( 'db', 'doc_id' );` or
    - `cdb.readDoc( 'db', 'doc_id' ).then( function( r ){`
    - `  :`
    - `});`
  - Read all documents
    - `var r = await cdb.readAllDocs( 'db' );` or
    - `cdb.readAllDocs( 'db' ).then( function( r ){`
    - `  :`
    - `});`
  - Read all design documents
    - `var r = await cdb.readAllDesignDocs( 'db' );` or
    - `cdb.readAllDesignDocs( 'db' ).then( function( r ){`
    - `  :`
    - `});`
  - Search documents
    - `var r = await cdb.searchDocs( 'db', { selector: { type: { '$eq': 'type-0' } }, fields: [ '_id', '_rev', 'name', 'type' ] } );` or
    - `cdb.searchDocs( 'db', { selector: { type: { '$eq': 'type-0' } }, fields: [ '_id', '_rev', 'name', 'type' ] } ).then( function( r ){`
    - `  :`
    - `});`
  - Update document
    - `var r = await cdb.updateDoc( 'db', 'xxx', { _id: 'xxx', _rev: 'yyy', name: 'name01', price: 110 } );` or
    - `cdb.updateDoc( 'db', 'xxx', { _id: 'xxx', _rev: 'yyy', name: 'name01', price: 110 } ).then( function( r ){`
    - `  :`
    - `});`
  - Delete document
    - `var r = await cdb.deleteDoc( 'db', 'doc_id', 'doc_rev' );` or
    - `cdb.deleteDoc( 'db', 'doc_id', 'doc_rev' ).then( function( r ){`
    - `  :`
    - `});`

- APIs for attached file(s)
  - document have to be created before following APIs
  - Add/Update file into document
    - `var r = await cdb.updateFile( 'db', 'doc_id', 'selector' );` or
    - `cdb.updateFile( 'db', 'doc_id', 'selector' ).then( function( r ){`
    - `  :`
    - `});`
  - Delete file from document
    - `var r = await cdb.deleteFile( 'db', 'doc_id', 'selector' );` or
    - `cdb.deleteFile( 'db', 'doc_id', 'selector' ).then( function( r ){`
    - `  :`
    - `});`


## Returned value

- Login API, for example
  - `var r = await cdb.login();`

- JSON structure of `r`:
  - `{`
  - `  status: true/false,`   - true:success, false:failed
  - `  result: ...`           - successed result( only for `status: true` case )
  - `  error: ...`            - failed error( only for `status: false` case )
  - `}`


## Sample

[Sample web application](https://dotnsf.github.io/couchdb-crud-sdk/)


## References

- Apache CouchDB API Refernece
  - https://docs.couchdb.org/en/stable/api/index.html
  
- JavaScriptのメソッドで自身のクラスの他のメソッドを呼び出したい
  - https://sierra-kilo.hatenablog.jp/entry/2016/10/26/235959

## Licensing

This code is licensed under MIT.


## Copyright

2024  [K.Kimura @ Juge.Me](https://github.com/dotnsf) all rights reserved.
