var cdb = null;
function login(){
  var username = $('#db_username').val();
  var password = $('#db_password').val();
  var base_url = $('#db_base_url').val();

  cdb = new CouchDB_Viewer( username, password, base_url );

  cdb.readAllDbs().then( function( r ){
    if( r && r.status ){
      var dbs = r.result;
      //console.log( {dbs} );
      if( dbs.length >= 0 ){
        $('.db_login').prop( 'disabled', true );

        var dbs_list = '<table class="table">'
          + '<tr><th><button class="btn btn-primary" onClick="create_db()">Create DB</button></th></tr>';
        for( var i = 0; i < dbs.length; i ++ ){
          dbs_list += '<tr><td class="dbname dbname-' + dbs[i] + '"><a href="#" onClick="get_docs(\'' + dbs[i] + '\')">' + dbs[i] + '</a></td></tr>';
        }
        dbs_list += '</table>';
        $('#dbs_list').html( dbs_list );
      }
    }else{
        $('#dbs_list').html( '' );
    }
  });
}

async function create_db(){
  var dbname = prompt( '新たに追加するデータベース名を入力してください', '' );
  if( dbname ){
    var r = await cdb.createDb( dbname );  //. { ok: true }
    if( r && r.status ){
      $('#dbs_list').html( '' );
      $('#docs_list').html( '' );

      login();
    }
  }
}

async function delete_db( db ){
  if( confirm( 'データベース: '+ db + 'を本当に削除しますか？' ) ){
    var r = await __base_obj.deleteDb( db );  //. { ok: true }
    if( r && r.status ){
      $('#dbs_list').html( '' );
      $('#docs_list').html( '' );

      login();
    }
  }
}

async function create_doc( db ){
  var sample_json = { name: 'name' };
  var textarea_html = JSON.stringify( sample_json, null, 2 );
  $('#editModalLabel').html( db + ' - createDoc' );
  $('#editModal_textarea').html( textarea_html );
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
      + '<td>_id</td>'
      + '<td>'
      + '<button class="btn btn-danger" onClick="delete_db(\'' + db + '\')">Delete DB</button>'
      + '<button class="btn btn-primary" onClick="create_doc(\'' + db + '\')">Create Doc</button>'
      + '</td>'
      + '</tr>';
    for( var i = 0; i < docs.length; i ++ ){
      docs_list += '<tr>'
        + '<td>' + docs[i]._id + '</td>'
        + '<td>'
        + '<button class="btn btn-success" onClick="get_doc(\'' + db + '\', \'' + docs[i]._id + '\')">Show Doc</button>'
        + '<button class="btn btn-warning" onClick="edit_doc(\'' + db + '\',\'' + docs[i]._id + '\')">Edit Doc</button>'
        + '<button class="btn btn-danger" onClick="delete_doc(\'' + db + '\',\'' + docs[i]._id + '\',\'' + docs[i]._rev + '\')">Delete Doc</button>'
        + '</td>'
        + '</tr>';
      //console.log( docs[i] );
    }
    docs_list += '</table>';
    $('#docs_list').html( docs_list );
  }
}

async function get_doc( db, doc_id ){
  var r = await cdb.readDoc( db, doc_id );
  if( r && r.status ){
    var doc = r.result;
    var body = '<pre>'
      + JSON.stringify( doc, null, 2 )
      + '</pre>';
    $('#docModalLabel').html( db + ' - ' + doc_id + ' - readDoc' );
    $('#docmodal-body').html( body );
    $('#docModal').modal();
  }
}

async function edit_doc( db, doc_id ){
  var r = await cdb.readDoc( db, doc_id );
  if( r && r.status ){
    var doc = r.result;
    var textarea_html = JSON.stringify( doc, null, 2 );
    $('#editModalLabel').html( db + ' - ' + doc._id + ' - updateDoc' );
    $('#editModal_textarea').html( textarea_html );
    $('#editModal').modal();
  }
}

async function delete_doc( db, doc_id, doc_rev ){
  if( confirm( 'データベース: ' + db + ' から _id = ' + doc_id + ', _rev = ' + doc_rev + ' のドキュメントを本当に削除しますか？' ) ){
    var r = await cdb.deleteDoc( db, doc_id, doc_rev );  //. { ok: true }
    get_docs( db );
  }
}

$(function(){
});

//. 編集モーダルを閉じた時
function save_doc(){
  var modal_label = $('#editModalLabel').html();
  var doc_json = JSON.parse( $('#editModal_textarea').val() );

  var tmp = modal_label.split( ' - ' );
  if( tmp.length == 2 && tmp[1] == "createDoc" ){
    cdb.createDoc( tmp[0], doc_json ).then( function( r ){
      $('#editModal').modal( 'hide' );
      get_docs( tmp[0] );
    });
  }else if( tmp.length == 3 && tmp[2] == "updateDoc" ){
    cdb.updateDoc( tmp[0], tmp[1], doc_json ).then( function( doc ){
      $('#editModal').modal( 'hide' );
      get_docs( tmp[0] );
    });
  }
}
