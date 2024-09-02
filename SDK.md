# CouchDB CRUD SDK Reference


## Pre-requisite 

- Prepare CoubhDB/Cloudant server.

  - If you would use Docker, use following command to create CouchDB server:
    - `$ docker run -d --name couchdb -p 5984:5984 -e COUCHDB_USER=user -e COUCHDB_PASSWORD=pass couchdb`
      - Login ID: user, Login PASSWORD: pass
    - Go to `http://localhost:5984/_utils` for CouchDB dashboard with browser

- Your CouchDB/Cloudant has to be ..

  - CORS enabled
    - In CouchDB/Cloudant dashboard, you need to enabled CORS and your domain have to be in Origin Domains:
    - ![CORS enabled](https://dotnsf.github.io/couchdb-crud-sdk/img_00.png)

  - and accessible by username and password(Basic Authentication enabled).


## Initialize

### Load `couchdb-crud-sdk.js` in HTML

```
<script src="https://dotnsf.github.io/couchdb-crud-sdk/couchdb-crud-sdk.js"></script>
```


### Initialize `CoubhDB_CRUD_SDK` object with (basic authentication)username, password, and base_url of CouchDB(like `http://localhost:5984`).

```
var cdb = new CouchDB_CRUD_SDK( username, password, base_url );
```

- Use initialized object in following SDKs


## Login

### Login

```
var r = await cdb.login();
```

- Parameter/Result
  - Parameter

  - Result
    - Success
      - `{ status: true, result: { ok: true } }`
    - Failed
      - `{ status: false, error: (error_reason) }`


## Database(s)

### Create database

```
var r = await cdb.createDb( 'db' );
```

- Parameter/Result
  - Parameter
    - 'db'
      - name of database

  - Result
    - Success
      - `{ status: true, result: { ok: true } }`
    - Failed
      - `{ status: false, error: (error_reason) }`


### Read all databases

```
var r = await cdb.readAllDbs();
```

- Parameter/Result
  - Parameter

  - Result
    - Success
      - `{ status: true, result: [ 'db0', 'db1', 'db2', .. ] }`
    - Failed
      - `{ status: false, error: (error_reason) }`


### Delete database

```
var r = await cdb.deleteDb( 'db' );
```

- Parameter/Result
  - Parameter
    - 'db'
      - name of database

  - Result
    - Success
      - `{ status: true, result: { ok: true } }`
    - Failed
      - `{ status: false, error: (error_reason) }`


## Document(s)

### Create document

```
var r = await cdb.createDoc( 'db', doc );
```

- Parameter/Result
  - Parameter
    - 'db'
      - name of database
    - doc
      - JSON document, for example `{ name: 'name00', price: 1000 }`

  - Result
    - Success
      - `{ status: true, result: { ok: true, id: 'id', rev: 'revision' } }`
    - Failed
      - `{ status: false, error: (error_reason) }`


### Create/Update documents

```
var r = await cdb.saveDocs( 'db', docs );
```

- Parameter/Result
  - Parameter
    - 'db'
      - name of database
    - docs
      - array of JSON document, for example `[ { name: 'name00', price: 1000 }, { name: 'name01', price: 2000 }, .. ]`

  - Result
    - Success
      - `{ status: true, result: [ { ok: true, id: 'id', rev: 'revision' }, .. ] }`
    - Failed
      - `{ status: false, error: (error_reason) }`


### Read document

```
var r = await cdb.readDoc( 'db', 'doc_id', 'doc_rev as option' );
```

- Parameter/Result
  - Parameter
    - 'db'
      - name of database
    - 'doc_id'
      - document id
    - 'doc_rev as option'
      - document revision, null for latest revision

  - Result
    - Success
      - `{ status: true, result: { _id: 'doc_id', _rev: 'doc_rev', name: 'xxxx', .. } }`
    - Failed
      - `{ status: false, error: (error_reason) }`


### Read all documents

```
var r = await cdb.readAllDocs( 'db' );
```

- Parameter/Result
  - Parameter
    - 'db'
      - name of database

  - Result
    - Success
      - `{ status: true, result: [ { _id: 'doc_id', _rev: 'doc_rev', name: 'xxxx', .. }, .. ] }`
    - Failed
      - `{ status: false, error: (error_reason) }`


### Read all document revisions

```
var r = await cdb.readAllRevisions( 'db', 'doc_id' );
```

- Parameter/Result
  - Parameter
    - 'db'
      - name of database
    - 'doc_id'
      - id of document

  - Result
    - Success
      - `{ status: true, result: [ '3-doc_rev', '2-doc_rev', '1-doc_rev' ] }`
    - Failed
      - `{ status: false, error: (error_reason) }`


### Search documents

```
var r = await cdb.searchDocs( 'db', { selector: { type: { '$eq': 'type-0' } }, fields: [ '_id', '_rev', 'name', 'type' ] } );
```

- Parameter/Result
  - Parameter
    - 'db'
      - name of database
    - selector
      - search selector, for example ..

```(design_doc)
{
  selector: {
    type: {
      '$eq': 'type-0'
    }
  },
  fields: [ '_id', '_rev', 'name', 'type' ]
}
```

  - Result
    - Success
      - `{ status: true, result: { bookmark: 'xxxx', docs: [ { _id: '_id', _rev: '_rev', name: 'name', type: 'type' }, .. ] } }`
    - Failed
      - `{ status: false, error: (error_reason) }`


### Update document

```
var r = await cdb.updateDoc( 'db', 'doc_id', doc );
```

- Parameter/Result
  - Parameter
    - 'db'
      - name of database
    - 'doc_id'
      - id of current document
    - doc
      - new document 

  - Result
    - Success
      - `{ status: true, result: { _id: 'doc_id', _rev: 'doc_rev', name: 'xxxx', .. } }`
    - Failed
      - `{ status: false, error: (error_reason) }`


### Delete document

```
var r = await cdb.deleteDoc( 'db', 'doc_id', 'doc_rev' );
```

- Parameter/Result
  - Parameter
    - 'db'
      - name of database
    - 'doc_id'
      - id of document
    - 'doc_rev'
      - revision of document 

  - Result
    - Success
      - `{ status: true, result: { ok: true, id: 'doc_id', rev: 'doc_rev' } }`
    - Failed
      - `{ status: false, error: (error_reason) }`


## Design Document(s)

### Create/Update design document

```
var r = await cdb.saveDesignDoc( 'db', 'design_name', design_doc );
```

- Parameter/Result
  - Parameter
    - 'db'
      - name of database
    - 'design_name'
      - name of design
    - design_doc
      - JSON document, for example ..

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

  - Result
    - Success
      - `{ status: true, result: { ok: true, id: '_design/' + design_name, rev: 'revision' } }`
    - Failed
      - `{ status: false, error: (error_reason) }`


### Read design document

```
var r = await cdb.readDesignDoc( 'db', 'design_name' );
```

- Parameter/Result
  - Parameter
    - 'db'
      - name of database
    - 'design_name'
      - name of design

  - Result
    - Success
      - `{ status: true, result: { _id: '_design/' + design_name, _rev: 'revision', .. } }`
    - Failed
      - `{ status: false, error: (error_reason) }`


### Read all design documents

```
var r = await cdb.readAllDesignDocs( 'db' );
```

- Parameter/Result
  - Parameter
    - 'db'
      - name of database

  - Result
    - Success
      - `{ status: true, result: { _id: '_design/' + design_name, _rev: 'revision', views: { .. }, lists: { .. }, shows: { .. } } }`
    - Failed
      - `{ status: false, error: (error_reason) }`


### Delete design document

```
var r = await cdb.deleteDesignDoc( 'db', 'design_name' );
```

- Parameter/Result
  - Parameter
    - 'db'
      - name of database
    - 'design_name'
      - name of design

  - Result
    - Success
      - `{ status: true, result: { ok: true, id: '_design/' + design_name, rev: 'revision' } }`
    - Failed
      - `{ status: false, error: (error_reason) }`


## Attached file(s)

- document have to be created before following APIs

### Create/Update file into document

```
var r = await cdb.saveFile( 'db', 'doc_id', 'selector', 'filename' );
```

- Parameter/Result
  - Parameter
    - 'db'
      - name of database
    - 'doc_id'
      - document id
    - 'selector'
      - element selector `<input type="file" id="file1"/>`, for example "#file1" in this case.
    - 'filename'
      - name of attached file(doesn't have to be real file name)

  - Result
    - Success
      - `{ status: true, result: { _id: 'doc_id', _rev: 'doc_rev', name: 'xxxx', .. , _attachments: { filename: { .. } } } }`
    - Failed
      - `{ status: false, error: (error_reason) }`


### Create/Update document (with/without file)

```
var r = await cdb.saveDoc( 'db', 'doc_id', doc, 'selector', 'filename' );
```

- Parameter/Result
  - Parameter
    - 'db'
      - name of database
    - 'doc_id'
      - document id
      - null for new document
    - doc
      - document to be uploaded
    - 'selector'
      - element selector `<input type="file" id="file1"/>`, for example "#file1" in this case.
      - null if not file have to be attached.
    - 'filename'
      - name of attached file(doesn't have to be real file name)
      - null if not file have to be attached.

  - Result
    - Success
      - `{ status: true, result: { _id: 'doc_id', _rev: 'doc_rev', name: 'xxxx', .. , _attachments: { filename: { .. } } } }`
    - Failed
      - `{ status: false, error: (error_reason) }`

### Read file from document

```
var r = await cdb.readFile( 'db', 'doc_id', 'doc_rev', 'filename' );
```

- Parameter/Result
  - Parameter
    - 'db'
      - name of database
    - 'doc_id'
      - document id
    - 'doc_rev'
      - document revision, null for latest revision
    - 'filename'
      - name of attached file

  - Result
    - Success
      - `{ status: true, result: { type: 'image/png', size: 50667, .. } }`
    - Failed
      - `{ status: false, error: (error_reason) }`


### Delete file from document

```
var r = await cdb.deleteFile( 'db', 'doc_id', 'filename' );
```

- Parameter/Result
  - Parameter
    - 'db'
      - name of database
    - 'doc_id'
      - document id
    - 'filename'
      - name of attached file

  - Result
    - Success
      - `{ status: true, result: { _id: 'doc_id', _rev: 'doc_rev', name: 'xxxx', .. , _attachments: { .. } } }`
    - Failed
      - `{ status: false, error: (error_reason) }`


### Just Read attached Text file

```
var r = await cdb.readTextLocalFile( 'selector', 'code' );
```

- Parameter/Result
  - Parameter
    - 'selector'
      - element selector `<input type="file" id="file1"/>`, for example "#file1" in this case.
    - 'code'
      - encode string, for example, 'utf-8'.

  - Result
    - Success
      - `{ status: true, result: { name: 'filename', text: 'xxxxxxxxxxxxxxxxxxx' } }`
    - Failed
      - `{ status: false, error: (error_reason) }`


## etc

### Sanitize text for displaying in HTML

```
var sanitized_text = cdb.sanitize( 'text' );
```

- Parameter/Result
  - Parameter
    - 'text'
      - raw text before sanitize

  - Result
    - sanitized_text 
      - sanitized text

