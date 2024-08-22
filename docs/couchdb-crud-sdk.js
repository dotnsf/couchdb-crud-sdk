//. couchdb-crud-sdk.js
class CouchDB_CRUD_SDK{
  constructor( username, password, base_url ){
    if( username, password, base_url ){
      this.username = username;
      this.password = password;

      this.base64 = btoa( username + ':' + password );

      this.base_url = base_url;
    }
  }


  //. Login
  login = async function( db ){
    return new Promise( async ( resolve, reject ) => {
      var r = null;
      try{
        var result = await fetch( this.base_url + '/', {
          headers: {
            'Authorization': 'Basic ' + this.base64
          }
        });
        var json = await result.json();  //. { ok: true }
        r = { status: true, result: json };
      }catch( e ){
        r = { status: false, error: e };
        console.log( e );
      }

      resolve( r );
    });
  }


  //. DB
  createDb = async function( db ){
    return new Promise( async ( resolve, reject ) => {
      var r = null;
      try{
        var result = await fetch( this.base_url + '/' + db, {
          method: 'put',
          headers: {
            'Authorization': 'Basic ' + this.base64
          }
        });
        var json = await result.json();  //. { ok: true }
        r = { status: true, result: json };
      }catch( e ){
        r = { status: false, error: e };
        console.log( e );
      }

      resolve( r );
    });
  }

  readAllDbs = async function(){
    return new Promise( async ( resolve, reject ) => {
      var r = null;
      try{
        var result = await fetch( this.base_url + '/_all_dbs', {
          headers: {
            'Authorization': 'Basic ' + this.base64
          }
        });
        var json = await result.json();  //. [ 'db0', 'db1', 'db2', .. ]
        r = { status: true, result: json };
      }catch( e ){
        r = { status: false, error: e };
        console.log( e );
      }

      resolve( r );
    });
  }

  deleteDb = async function( db ){
    return new Promise( async ( resolve, reject ) => {
      var r = null;
      try{
        var result = await fetch( this.base_url + '/' + db, {
          method: 'delete',
          headers: {
            'Authorization': 'Basic ' + this.base64
          }
        });
        var json = await result.json();  //. { ok: true }
        r = { status: true, result: json };
      }catch( e ){
        r = { status: false, error: e };
        console.log( e );
      }

      resolve( r );
    });
  }


  //. DOC
  createDoc = async function( db, doc ){
    return new Promise( async ( resolve, reject ) => {
      var r = null;
      try{
        var result = await fetch( this.base_url + '/' + db, {
          method: 'POST',
          body: JSON.stringify( doc ),
          headers: {
            'Authorization': 'Basic ' + this.base64,
            'Content-Type': 'application/json' 
          }
        });
        var json = await result.json();  //. { ok: true, id: 'xxx', rev: 'yyy' }
        r = { status: true, result: json };
      }catch( e ){
        r = { status: false, error: e };
        console.log( e );
      }

      resolve( r );
    });
  }

  readDoc = async function( db, doc_id ){
    return new Promise( async ( resolve, reject ) => {
      var r = null;
      try{
        var result = await fetch( this.base_url + '/' + db + '/' + doc_id /* + '?include_docs=true'*/, {
          headers: {
            'Authorization': 'Basic ' + this.base64,
            'Content-Type': 'application/json' 
          }
        });
        var json = await result.json();  //. { _id: 'xxx', _rev: 'yyy', name: '****', .. }
        r = { status: true, result: json };
      }catch( e ){
        r = { status: false, error: e };
        console.log( e );
      }

      resolve( r );
    });
  }

  readAllDocs( db ){
    return new Promise( async ( resolve, reject ) => {
      var r = null;
      try{
        var result = await fetch( this.base_url + '/' + db + '/_all_docs?include_docs=true', {
          headers: {
            'Authorization': 'Basic ' + this.base64
          }
        });
        var json = await result.json();
        var docs = [];
        for( var i = 0; i < json.rows.length; i ++ ){
          docs.push( json.rows[i].doc );
        }
        r = { status: true, result: docs };
      }catch( e ){
        r = { status: false, error: e };
        console.log( e );
      }

      resolve( r );
    });
  }

  readAllDesignDocs( db ){
    return new Promise( async ( resolve, reject ) => {
      var r = null;
      try{
        var result = await fetch( this.base_url + '/' + db + '/_design_docs?include_docs=true', {
          headers: {
            'Authorization': 'Basic ' + this.base64
          }
        });
        var json = await result.json();
        var design_docs = [];
        for( var i = 0; i < json.rows.length; i ++ ){
          design_docs.push( json.rows[i].doc );
        }   //. [ { _id: '_design/library', _rev: 'y-yyy', views: [..] } ]
        r = { status: true, result: design_docs };
      }catch( e ){
        r = { status: false, error: e };
        console.log( e );
      }

      resolve( r );  
    });
  }

  searchDocs( db, body ){
    return new Promise( async ( resolve, reject ) => {
      var r = null;
      try{
        var result = await fetch( this.base_url + '/' + db + '/_find', {
          method: 'post',
          body: JSON.stringify( body ),
          headers: {
            'Authorization': 'Basic ' + this.base64,
            'Content-Type': 'application/json'  //. 必須
          }
        });
        var json = await result.json();  //. { bookmark: 'xxx', docs: [ .. ] }
        r = { status: true, result: json.docs };
      }catch( e ){
        r = { status: false, error: e };
        console.log( e );
      }

      resolve( r );
    });
  }

  updateDoc = async function( db, doc_id, doc ){
    return new Promise( async ( resolve, reject ) => {
      var r = null;
      try{
        doc._id = doc_id;
        var result = await fetch( this.base_url + '/' + db + '/' + doc_id, {
          method: 'put',
          body: JSON.stringify( doc ),
          headers: {
            'Authorization': 'Basic ' + this.base64,
            'Content-Type': 'application/json' 
          }
        });
        var json = await result.json();  //. { _id: 'xxx', _rev: 'yyy', name: '****', .. }
        r = { status: true, result: json };
      }catch( e ){
        r = { status: false, error: e };
        console.log( e );
      }

      resolve( r );
    });
  }

  deleteDoc = async function( db, doc_id, doc_rev ){
    return new Promise( async ( resolve, reject ) => {
      var r = null;
      try{
        var result = await fetch( this.base_url + '/' + db + '/' + doc_id + '?rev=' + doc_rev, {
          method: 'delete',
          headers: {
            'Authorization': 'Basic ' + this.base64,
            'Content-Type': 'application/json' 
          }
        });
        var json = await result.json();  //. { ok: true, id: 'xxx', rev: 'yyy' }
        r = { status: true, result: json };
      }catch( e ){
        r = { status: false, error: e };
        console.log( e );
      }

      resolve( r );
    });
  }


  //. #1 add/update _attachments
  updateFile = async function( db, doc_id, selector ){
    return new Promise( async ( resolve, reject ) => {
      var self = this;
      var r = null;
      try{
        r = await self.readDoc( db, doc_id );
        if( r && r.status ){
          if( selector ){
            var file = document.querySelector( selector ).files[0];
            var name = file.name;
            var doc = r.result;
            if( doc ){
              var reader = new FileReader();
              reader.addEventListener( 'load', function( e ){
                //console.log( reader.result );  //. data:image/png;base64,xxxxxxx..
                var data = reader.result;
                var tmp = data.split( ',' );
                if( tmp.length == 2 ){
                  var base64 = tmp[1];
                  data = tmp[0];
                  tmp = data.split( ';' );
                  if( tmp.length == 2 ){
                    data = tmp[0];
                    tmp = data.split( ':' );
                    if( tmp.length == 2 ){
                      if( !doc._attachments ){
                        doc._attachments = {};
                      }
                      doc._attachments[name] = {};
                      doc._attachments[name].content_type = tmp[1];
                      doc._attachments[name].data = base64;
  
                      self.updateDoc( db, doc_id, doc ).then( function( r ){
                        resolve( r );
                      });
                    }else{
                      r = { status: false, error: 'file data(format) would be something wrong.' };
                      resolve( r );
                    }
                  }else{
                    r = { status: false, error: 'file data(format) would be something wrong.' };
                    resolve( r );
                  }
                }else{
                  r = { status: false, error: 'file data(format) would be something wrong.' };
                  resolve( r );
                }
              });
              reader.readAsDataURL( file );
            }else{
              r = { status: false, error: 'no document found for _id = ' + doc_id };
              resolve( r );
            }
          }else{
            r = { status: false, error: 'no selector specified.' };
            resolve( r );
          }
        }else{
          r = { status: false, error: r.error };
          resolve( r );
        }
      }catch( e ){
        r = { status: false, error: e };
        console.log( e );
        resolve( r );
      }
    });
  }

  //. #1 delete _attachments
  deleteFile = async function( db, doc_id, name ){
    return new Promise( async ( resolve, reject ) => {
      var self = this;
      var r = null;
      try{
        r = await self.readDoc( db, doc_id );
        if( r && r.status ){
          if( name ){
            var doc = r.result;
            if( doc._attachments && doc._attachments[name] ){
              delete doc._attachments[name];
  
              r = await self.updateDoc( db, doc_id, doc );
              resolve( r );
            }else{
              r = { status: false, error: 'no attachment for name = ' + name };
              resolve( r );
            }
          }else{
            r = { status: false, error: 'attachment name has something wrong.' };
            resolve( r );
          }
        }else{
          r = { status: false, error: r.error };
          resolve( r );
        }
      }catch( e ){
        r = { status: false, error: e };
        console.log( e );
        resolve( r );
      }
    });
  }
}

if( typeof module === 'object' ){
  module.exports = CouchDB_CRUD_SDK;
}
