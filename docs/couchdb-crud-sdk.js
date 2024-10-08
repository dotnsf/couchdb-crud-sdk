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

  //. sanitize
  sanitize = function( text ){
    text = text.split( '&' ).join( '&amp;' );
    text = text.split( '<' ).join( '&lt;' );
    text = text.split( '>' ).join( '&gt;' );
    text = text.split( '"' ).join( '&quot;' );
    text = text.split( "'" ).join( '&#039;' );

    return text;
  }

  //. Login
  login = async function(){
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

  //. #3 create/update design docucment
  saveDesignDoc = async function( db, design_name, design_doc ){
    return new Promise( async ( resolve, reject ) => {
      var self = this;
      var r = null;
      try{
        var doc_id = '_design/' + design_name;
        var url = this.base_url + '/' + db + '/' + doc_id;
        r = await self.readDoc( db, doc_id );
        console.log( {r} );
        if( r && r.status && r.result && r.result._id ){
          //. update
          var doc = r.result;
          design_doc._rev = doc._rev;
          url += '?rev=' + doc._rev;
        }else{
          //. create
          design_doc._id = doc_id;
        }

        var result = await fetch( url, {
          method: 'PUT',
          body: JSON.stringify( design_doc ),
          headers: {
            'Authorization': 'Basic ' + this.base64,
            'Content-Type': 'application/json' 
          }
        });
        var json = await result.json();
        r = { status: true, result: json };
      }catch( e ){
        r = { status: false, error: e };
        console.log( e );
      }
      resolve( r );
    });
  }

  //. #4 bulk insert/update
  saveDocs = async function( db, docs ){
    return new Promise( async ( resolve, reject ) => {
      var r = null;
      try{
        var result = await fetch( this.base_url + '/' + db + '/_bulk_docs', {
          method: 'POST',
          body: JSON.stringify( { docs: docs } ),
          headers: {
            'Authorization': 'Basic ' + this.base64,
            'Content-Type': 'application/json' 
          }
        });
        var json = await result.json();  //. [ { ok: true, id: 'id0', rev: 'rev0' }, .. ]
        r = { status: true, result: json };
      }catch( e ){
        r = { status: false, error: e };
        console.log( e );
      }
      resolve( r );
    });
  }

  //. #2
  readDoc = async function( db, doc_id, doc_rev ){
    return new Promise( async ( resolve, reject ) => {
      var r = null;
      try{
        var url = this.base_url + '/' + db + '/' + doc_id + '?include_docs=true';
        if( doc_rev ){
          url += '&rev=' + doc_rev;
        }

        var result = await fetch( url, {
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

  readAllDocs = async function( db ){
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

  readDesignDoc = async function( db, design_name ){
    return new Promise( async ( resolve, reject ) => {
      var self = this;
      var r = null;
      try{
        var doc_id = '_design/' + design_name;
        r = await self.readDoc( db, doc_id );
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

  //. #2
  readAllRevisions = async function( db, doc_id ){
    return new Promise( async ( resolve, reject ) => {
      var r = null;
      try{
        var result = await fetch( this.base_url + '/' + db + '/' + doc_id + '?revs=true', {
          headers: {
            'Authorization': 'Basic ' + this.base64,
            'Content-Type': 'application/json' 
          }
        });
        var json = await result.json();  //. { _id: 'xxx', _rev: 'yyy', _revisions: { ids: [ .. ], .. }, .. }
        if( json && json._revisions && json._revisions['ids'] ){
          var ids = json._revisions['ids'];
          for( var i = 0; i < ids.length; i ++ ){
            ids[i] = ( ids.length - i ) + '-' + ids[i];
          }
          r = { status: true, result: ids };
        }else{
          r = { status: false, error: e };
        }
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

  deleteDesignDoc = async function( db, design_name ){
    return new Promise( async ( resolve, reject ) => {
      var self = this;
      var r = null;
      try{
        var doc_id = '_design/' + design_name;
        r = await self.deleteDoc( db, doc_id );
      }catch( e ){
        r = { status: false, error: e };
        console.log( e );
      }

      resolve( r );
    });
  }


  //. #1 add/update _attachments
  saveFile = async function( db, doc_id, selector, filename ){
    return new Promise( async ( resolve, reject ) => {
      var self = this;
      var r = null;
      try{
        r = await self.readDoc( db, doc_id );
        if( r && r.status ){
          if( selector ){
            var sel = document.querySelector( selector );
            if( sel && sel.files && sel.files.length >= 0 && sel.files[0] ){
              var file = sel.files[0];
              var name = filename ? filename : file.name;
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
              r = { status: false, error: 'no element found for selector ="' + selector + '".' };
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

  //. #10 : updateDoc + saveFile を１回のリビジョン変更で実施するための関数
  saveDocAndFile = async function( db, doc_id, doc, selector, filename ){
    return new Promise( async ( resolve, reject ) => {
      var self = this;
      var r = null;
      try{
        if( selector ){
          var sel = document.querySelector( selector );
          if( sel && sel.files && sel.files.length >= 0 && sel.files[0] ){
            var file = sel.files[0];
            var name = filename ? filename : file.name;
            //var doc = r.result;
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
            r = { status: false, error: 'no element found for selector = "' + selector + '".' };
            resolve( r );
          }
        }else{
          r = { status: false, error: 'no selector specified.' };
          resolve( r );
        }
      }catch( e ){
        r = { status: false, error: e };
        console.log( e );
        resolve( r );
      }
    });
  }

  //. #16 : #10 を saveDoc として初回保存時にも対応する
  //.       ついでに document.querySelector( selector ).files[0] 時に発生する可能性のあるエラーにも対応する
  saveDoc = async function( db, doc_id, doc, selector, filename ){
    return new Promise( async ( resolve, reject ) => {
      var self = this;
      var r = null;
      try{
        var name = null;
        if( selector ){
          //. 添付ファイルあり
          var sel = document.querySelector( selector );
          if( sel && sel.files && sel.files.length >= 0 && sel.files[0] ){
            var file = sel.files[0];
            name = filename ? filename : file.name;

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

                    if( doc_id ){
                      //. 既存文書＆添付ファイルあり
                      self.updateDoc( db, doc_id, doc ).then( function( r ){
                        resolve( r );
                      });
                    }else{
                      //. 新規文書＆添付ファイルあり
                      self.createDoc( db, doc ).then( function( r ){
                        resolve( r );
                      });
                    }
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
            //. 添付ファイルなし
            //r = { status: false, error: 'no elements found for selector ="' + selector + '".' };
            //resolve( r );
            if( doc_id ){
              //. 既存文書＆添付ファイルなし
              self.updateDoc( db, doc_id, doc ).then( function( r ){
                resolve( r );
              });
            }else{
              //. 新規文書＆添付ファイルなし
              self.createDoc( db, doc ).then( function( r ){
                resolve( r );
              });
            }
          }
        }else{
          //. 添付ファイルなし
          if( doc_id ){
            //. 既存文書＆添付ファイルなし
            self.updateDoc( db, doc_id, doc ).then( function( r ){
              resolve( r );
            });
          }else{
            //. 新規文書＆添付ファイルなし
            self.createDoc( db, doc ).then( function( r ){
              resolve( r );
            });
          }
        }
      }catch( e ){
        r = { status: false, error: e };
        console.log( e );
        resolve( r );
      }
    });
  }

  //. #1 get _attachments
  readFile = async function( db, doc_id, doc_rev, filename ){
    return new Promise( async ( resolve, reject ) => {
      var self = this;
      var r = null;
      try{
        var url = this.base_url + '/' + db + '/' + doc_id + '/' + filename;
        if( doc_rev ){ url += '?rev=' + doc_rev; }
        //var result = await fetch( this.base_url + '/' + db + '/' + doc_id + '?attachments=true', {
        var result = await fetch( url, {
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Basic ' + this.base64,
            'Content-Type': 'application/json' 
          }
        });
        var blob = await result.blob();
        //console.log( {blob} );
        if( blob ){
          r = { status: true, result: blob };  //. { type: 'image/png', size: 50667, .... }
        }else{
          r = { status: false, error: 'no attached file found for name = ' + filename };
        }
      }catch( e ){
        r = { status: false, error: e };
        console.log( e );
      }

      resolve( r );
    });
  }

  //. #1 delete _attachments
  deleteFile = async function( db, doc_id, filename ){
    return new Promise( async ( resolve, reject ) => {
      var self = this;
      var r = null;
      try{
        r = await self.readDoc( db, doc_id );
        if( r && r.status ){
          if( filename ){
            var doc = r.result;
            if( doc._attachments && doc._attachments[filename] ){
              delete doc._attachments[filename];
  
              r = await self.updateDoc( db, doc_id, doc );
              resolve( r );
            }else{
              r = { status: false, error: 'no attachment for name = ' + filename };
              resolve( r );
            }
          }else{
            r = { status: false, error: 'no filename specified.' };
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

  //. #4
  readTextLocalFile = async function( selector, code ){
    return new Promise( async ( resolve, reject ) => {
      var r = null;
      var sel = document.querySelector( selector );
      if( sel && sel.files && sel.files.length >= 0 && sel.files[0] ){
        var file = sel.files[0];
        var name = file.name;
  
        var reader = new FileReader();
        reader.addEventListener( 'load', function( e ){
          //console.log( reader.result );  //. data:application/json;base64,xxxxx...
          var data = reader.result;
          console.log( {data} );
          r = { status: true, result: { name: name, text: data } };
          resolve( r );
        });
        reader.readAsText( file, code );
      }else{
        r = { status: false, error: 'no element found for selecor ="' + selector + '".' };
        resolve( r );
      }
    });
  }
}

if( typeof module === 'object' ){
  module.exports = CouchDB_CRUD_SDK;
}
