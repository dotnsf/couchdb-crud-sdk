var cdb = null;
function login( no_ui ){
  var username = $('#db_username').val();
  var password = $('#db_password').val();
  var base_url = $('#db_base_url').val();

  cdb = new CouchDB_CRUD_SDK( username, password, base_url );

  cdb.readAllDbs().then( function( r ){
    if( r && r.status ){
      var dbs = r.result;
      //.console.log( {dbs} );
      if( dbs.length >= 0 ){
        $('#nav-bar').css( 'display', 'none' );

        if( !no_ui ){
          var dbs_list = '<table class="table">'
            + '<tr><th>'
            + '<button class="btn btn-xs btn-secondary" onClick="reload_db()">Reload</button>'
            + '<button class="btn btn-xs btn-primary" onClick="create_db()">Create DB</button>'
            + '</th></tr>';
          for( var i = 0; i < dbs.length; i ++ ){
            dbs_list += '<tr><td class="dbname dbname-' + dbs[i] + '"><a href="#" onClick="get_docs(\'' + dbs[i] + '\')">' + dbs[i] + '</a></td></tr>';
          }
          dbs_list += '</table>';
          $('#dbs_list').html( dbs_list );
        }
      }
    }else{
      if( !no_ui ){
        $('#dbs_list').html( '' );
      }
    }
  });
}

function reload_db(){
  $('#dbs_list').html( '' );
  $('#docs_list').html( '' );

  login();
}

async function create_db(){
  var dbname = prompt( '新たに追加するデータベース名を入力してください', '' );
  if( dbname ){
    var r = await cdb.createDb( dbname );  //. { ok: true }
    if( r && r.status ){
      reload_db();
    }
  }
}

async function delete_db( db ){
  if( confirm( 'データベース: '+ db + 'を本当に削除しますか？' ) ){
    var r = await cdb.deleteDb( db );  //. { ok: true }
    if( r && r.status ){
      reload_db();
    }
  }
}

async function create_doc( db ){
  $('#edit_db').val( db );
  $('#edit_doc_id').val( '' );
  $('#edit_subject').val( '' );
  $('#edit_username').val( '' );
  $('#edit_body').val( '' );
  $('#editModal').modal();
}

async function get_docs( db ){
  $('.dbname').removeClass( 'selected' );
  $('.dbname-' + db).addClass( 'selected' );

  var r = await cdb.readAllDocs( db );
  if( r && r.status ){
    var docs = r.result;
    var docs_list = '<table class="table">'
      + '<tr>'
      + '<td>subject</td>'
      + '<td>username</td>'
      + '<td>timestamp</td>'
      + '<td>'
      + '<button class="btn btn-danger" onClick="delete_db(\'' + db + '\')">Delete DB</button>'
      + '<button class="btn btn-primary" onClick="create_doc(\'' + db + '\')">Create File</button>'
      + '</td>'
      + '</tr>';
    for( var i = 0; i < docs.length; i ++ ){
      docs_list += '<tr>'
        + '<td>' + docs[i].subject + '</td>'
        + '<td>' + docs[i].username + '</td>'
        + '<td>' + timestamp2yyyymmdd( docs[i].timestamp ) + '</td>'
        + '<td>'
        + '<button class="btn btn-success" onClick="get_doc(\'' + db + '\', \'' + docs[i]._id + '\')">Show File</button>'
        + '<button class="btn btn-warning" onClick="edit_doc(\'' + db + '\',\'' + docs[i]._id + '\')">Edit File</button>'
        + '<button class="btn btn-danger" onClick="delete_doc(\'' + db + '\',\'' + docs[i]._id + '\',\'' + docs[i]._rev + '\')">Delete File</button>'
        + '</td>'
        + '</tr>';
      //console.log( docs[i] );
    }
    docs_list += '</table>';
    $('#docs_list').html( docs_list );
  }
}

async function get_doc( db, doc_id ){
  $('#doc_revs').html( '' );
  var r = await cdb.readAllRevisions( db, doc_id );
  if( r && r.status ){
    $('#view_db').val( db );
    $('#view_doc_id').val( doc_id );
    $('#view_subject').html( '' );
    $('#view_username').html( '' );
    $('#view_body').html( '' );
    $('#view_timestamp').html( '' );

    var revs = r.result;
    for( var i = 0; i < revs.length; i ++ ){
      //var opt = '<option value="' + revs[i] + '"' + ( i == 0 ? ' selected' : '' ) +  '>' + revs[i] + '</option>';
      var opt = '<option value="' + revs[i] + '">' + revs[i] + '</option>';
      $('#doc_revs').append( opt );
    }
    if( revs.length > 0 ){
      $('#doc_revs').val( revs[0] ).trigger( 'change' );  //. change() イベントを発火
    }

    $('#viewModal').modal();
  }
}

async function edit_doc( db, doc_id ){
  var r = await cdb.readDoc( db, doc_id );
  if( r && r.status ){
    var doc = r.result;
    $('#edit_db').val( db );
    $('#edit_doc_id').val( doc_id );
    $('#edit_subject').val( doc.subject );
    $('#edit_username').val( doc.username );
    $('#edit_body').val( doc.body );
    $('#editModal').modal();
  }
}

async function delete_doc( db, doc_id, doc_rev ){
  if( confirm( 'データベース: ' + db + ' から _id = ' + doc_id + ', _rev = ' + doc_rev + ' のファイルを本当に削除しますか？' ) ){
    var r = await cdb.deleteDoc( db, doc_id, doc_rev );  //. { ok: true }
    get_docs( db );
  }
}

$(function(){
  $('#doc_revs').change( async function(){
    var db = $('#view_db').val();
    var doc_id = $('#view_doc_id').val();
    var doc_rev = $('#doc_revs option:selected').val();
    var r = await cdb.readDoc( db, doc_id, doc_rev );
    if( r && r.status ){
      var doc = r.result;
      $('#view_subject').html( doc.subject );
      $('#view_username').html( doc.username );
      $('#view_body').html( '<pre>' + doc.body + '</pre>' );
      $('#view_timestamp').html( timestamp2yyyymmdd( doc.timestamp ) );
    }
  });
});

//. 編集モーダルを閉じた時（ラベル以外の方法で新規か既存かを識別する必要がある）
async function save_doc(){
  var db = $('#edit_db').val();
  var doc_id = $('#edit_doc_id').val();

  if( !doc_id ){
    var doc = { type: 'file' };
    doc.subject = $('#edit_subject').val();
    doc.username = $('#edit_username').val();
    doc.body = $('#edit_body').val();
    doc.timestamp = ( new Date() ).getTime();
    cdb.createDoc( db, doc ).then( function( r ){
      $('#editModal').modal( 'hide' );
      get_docs( db );
    });
  }else{
    var r = await cdb.readDoc( db, doc_id );
    if( r && r.status ){
      var doc = r.result;
      doc.subject = $('#edit_subject').val();
      doc.username = $('#edit_username').val();
      doc.body = $('#edit_body').val();
      doc.timestamp = ( new Date() ).getTime();
      cdb.updateDoc( db, doc_id, doc ).then( function( r ){
        $('#editModal').modal( 'hide' );
        get_docs( db );
      });
    }
  }
}

function timestamp2yyyymmdd( t ){
  if( typeof t == 'string' ){
    t = parseInt( t );
  }

  var dt = new Date();
  dt.setTime( t );
  var yyyy = dt.getFullYear();
  var mm = dt.getMonth() + 1;
  var dd = dt.getDate();
  var hh = dt.getHours();
  var nn = dt.getMinutes();
  var ss = dt.getSeconds();

  var yyyymmdd = yyyy
    + '-' + ( mm < 10 ? '0' : '' ) + mm
    + '-' + ( dd < 10 ? '0' : '' ) + dd
    + ' ' + ( hh < 10 ? '0' : '' ) + hh
    + ':' + ( nn < 10 ? '0' : '' ) + nn
    + ':' + ( ss < 10 ? '0' : '' ) + ss;

  return yyyymmdd;
}
