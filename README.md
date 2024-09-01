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


## How to use JavaScript library and SDKs

[SDK Reference](https://dotnsf.github.io/couchdb-crud-sdk/SDK.md)


## Sample

[Sample web application](https://dotnsf.github.io/couchdb-crud-sdk/viewer.html)


## Extras

- `bulk_import.js` and `sample_blogdoc.json`
  - `bulk_import.js` is standalone node.js application which generates a db, docs, and a design document for HTML for _lists and _shows, based on `sample_blogdoc.json` template.
  - After executing `$ node bulk_import sample_blogdoc.json`, it generates db named `blogs`, and you can view `https://(base_url)/blogs/_design/myblog/_list/myblog/myblog` for those contents in HTML.
  - You can edit(CRUD) those contents in above [Sample web application](https://dotnsf.github.io/couchdb-crud-sdk/viewer.html) as CMS.


## References

- Apache CouchDB API Refernece
  - https://docs.couchdb.org/en/stable/api/index.html
  
- JavaScriptのメソッドで自身のクラスの他のメソッドを呼び出したい
  - https://sierra-kilo.hatenablog.jp/entry/2016/10/26/235959


## Licensing

This code is licensed under MIT.


## Copyright

2024  [K.Kimura @ Juge.Me](https://github.com/dotnsf) all rights reserved.
