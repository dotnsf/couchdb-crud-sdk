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
  - Create/Update documents
    - `var r = await cdb.saveDocs( 'db', [ { name: 'name01', price: 100 }, .. ] );` or
    - `cdb.saveDocs( 'db', [ { name: 'name01', price: 100 }, .. ] ).then( function( r ){`
    - `  :`
    - `});`
  - Read document
    - `var r = await cdb.readDoc( 'db', 'doc_id', 'doc_rev as option' );` or
    - `cdb.readDoc( 'db', 'doc_id', 'doc_rev as option' ).then( function( r ){`
    - `  :`
    - `});`
  - Read all documents
    - `var r = await cdb.readAllDocs( 'db' );` or
    - `cdb.readAllDocs( 'db' ).then( function( r ){`
    - `  :`
    - `});`
  - Read all document revisions
    - `var r = await cdb.readAllRevisions( 'db', 'doc_id' );` or
    - `cdb.readAllRevisions( 'db', 'doc_id' ).then( function( r ){`
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

- APIs for design document
  - Create/Update design document
    - `var r = await cdb.saveDesignDoc( 'db', 'design_name', design_doc );` or
    - `cdb.saveDesignDoc( 'db', 'design_name', design_doc ).then( function( r ){`
    - `  :`
    - `});`
    - `design_doc` should be formed like followings:
      - After created design document with this sample, you can browse (with basic authentication) ..
        - `https://(base_url)/(db)/_design/design_name/_list/design_name/design_name` for doc list
        - `https://(base_url)/(db)/_design/design_name/_show/design_name/(_id)` for doc

```(design_doc)
design_doc = {
  language: "javascript",
  views: {
    design_name: {
      map: "function(doc){ if( doc.type == 'item' ){ emit( doc._id, {name:doc.name,price:doc.price} ); } }"
    }
  },
  lists: {
    design_name: "function(head,row){ start( { 'headers': { 'content-type': 'text/html; charset=utf-8' } } ); send( '<!DOCTYPE html><html><head><title>List</title></head><body><h1>Items</h1><table border=\"1\"><tr><th>name</th><th>price</th></tr>' ); var row; while( row = getRow() ){  var url = '../../_show/design_name/';  send( ' <tr data-href=\"' + url + row.id + '\"><td><a href=\"' + url + row.id + '\">' + row.value.name + '</a></td><td><a href=\"' + url + row.id + '\">' + row.value.price + '</a></td></tr>' ); } send( '</table></html>' );}"
  },
  shows: {
    design_name: "(function(doc,req){ if( doc ){ start( {'headers':{'content-type':'text/html; charset=utf-8'}} ); var str = '<!DOCTYPE html><html><head><title>' + doc.name + '</title></head><body><h2>' + doc.name + '</h2><h3>' + doc.price + '</h3></body></html>'; return str; }else{ return 'empty'; }})"
  }
}
```

  - Read design document
    - `var r = await cdb.readDesignDoc( 'db', 'design_name' );` or
    - `cdb.readDesignDoc( 'db', 'design_name' ).then( function( r ){`
    - `  :`
    - `});`
  - Read all design documents
    - `var r = await cdb.readAllDesignDocs( 'db' );` or
    - `cdb.readAllDesignDocs( 'db' ).then( function( r ){`
    - `  :`
    - `});`
  - Delete design document
    - `var r = await cdb.deleteDesignDoc( 'db', 'design_name' );` or
    - `cdb.deleteDesignDoc( 'db', 'design_name' ).then( function( r ){`
    - `  :`
    - `});`

- APIs for attached file(s)
  - document have to be created before following APIs
  - Create/Update file into document
    - `var r = await cdb.saveFile( 'db', 'doc_id', 'selector', 'filename' );` or
    - `cdb.saveFile( 'db', 'doc_id', 'selector', 'filename' ).then( function( r ){`
    - `  :`
    - `});`
  - Read file from document
    - `var r = await cdb.readFile( 'db', 'doc_id', 'doc_rev', 'filename' );` or
    - `cdb.readFile( 'db', 'doc_id', 'doc_rev', 'filename' ).then( function( r ){`
    - `  :`
    - `});`
  - Delete file from document
    - `var r = await cdb.deleteFile( 'db', 'doc_id', 'filename' );` or
    - `cdb.deleteFile( 'db', 'doc_id', 'filename' ).then( function( r ){`
    - `  :`
    - `});`
  - Just Read attached Text file
    - `var r = await cdb.readTextLocalFile( 'selector', 'utf-8' );` or
    - `cdb.readTextLocalFile( 'selector', 'utf-8' ).then( function( r ){`
    - `  :`
    - `});`

- APIs for etc..
  - Sanitize text for displaying in HTML
    - `var sanitized_text = cdb.sanitize( text );`


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

[Sample web application](https://dotnsf.github.io/couchdb-crud-sdk/viewer.html)


## Extras

- `bulk_import.js` and `sample_blogdoc.json`
  - `bulk_import.js` is standalone node.js application which generates a db, docs, and a design document for HTML for _lists and _shows, based on `sample_blogdoc.json` template.
  - After executing `$ node bulk_import sample_blogdoc.json`, it generates db named `blogs`, and you can view `https://(base_url)/blogs/_design/myblog/_list/myblog/myblog` for those contents in HTML.
  - You can edit(CRUD) those contents in above [Sample web application](https://dotnsf.github.io/couchdb-crud-sdk/) as CMS.


## References

- Apache CouchDB API Refernece
  - https://docs.couchdb.org/en/stable/api/index.html
  
- JavaScriptのメソッドで自身のクラスの他のメソッドを呼び出したい
  - https://sierra-kilo.hatenablog.jp/entry/2016/10/26/235959

## Licensing

This code is licensed under MIT.


## Copyright

2024  [K.Kimura @ Juge.Me](https://github.com/dotnsf) all rights reserved.
