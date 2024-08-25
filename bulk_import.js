//. bulk_import.js
var fs = require( 'fs' );
var axios = require( 'axios' );

require( 'dotenv' ).config();

async function bulk_import( sample_doc ){
  return new Promise( async ( resolve, reject ) => {
    var username = 'USERNAME' in process.env ? process.env.USERNAME : '';
    var password = 'PASSWORD' in process.env ? process.env.PASSWORD : '';
    var base_url = 'BASE_URL' in process.env ? process.env.BASE_URL : '';

    var base64 = btoa( username + ':' + password );

    var r = null;
    var db = sample_doc.db;
    if( db ){
     var config = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Basic ' + base64,
        'Referer': base_url
      }
     };

      //. login
      var r0 = await axios.get( base_url + '/', config );
      //console.log( {r0} );
      if( r0 && r0.status && r0.status == 200 && r0.data ){  //. { ok: true }
        //. create db
        try{
          var r1 = await axios.put( base_url + '/' + db, null, config );
          //.console.log( {r1} );
        }catch( e ){
          //.console.log( {e} );
        }

        if( sample_doc.docs ){
          //. bulk insert
          var r2 = await axios.post( base_url + '/' + db + '/_bulk_docs', { docs: sample_doc.docs }, config );
          //.console.log( {r2} );
        }

        if( sample_doc.design_docs ){
          var design_docs = sample_doc.design_docs;
          Object.keys( design_docs ).forEach( async function( design_name ){
            var design_doc = design_docs[design_name];
            var doc = { language: "javascript" };

            if( design_doc.views_map ){
              var condition = design_doc.views_map.condition;
              var emits = design_doc.views_map.emits;
              var map = "function(doc){ if( " + condition + " ){ emit( doc._id, {";

              var tmp = [];
              for( var i = 0; i < emits.length; i ++ ){
                tmp.push( emits[i] + ":doc." + emits[i] );
              }
              map += tmp.join( ',' );

              map += '} ); } }';

              doc.views = {};
              doc.views[design_name] = {};
              doc.views[design_name].map = map;
            }

            if( design_doc.lists ){
              var external_scripts = design_doc.lists.external_scripts;
              var external_csss = design_doc.lists.external_csss;
              var script = design_doc.lists.script;
              var css = design_doc.lists.css;
              var title = design_doc.lists.title;
              var rows = design_doc.lists.rows;

              var lists = "function(head,row){ start( { 'headers': { 'content-type': 'text/html; charset=utf-8' } } ); send( '<!DOCTYPE html><html><head><title>" + title + "</title>";

              if( external_scripts && external_scripts.length > 0 ){
                for( var i = 0; i < external_scripts.length; i ++ ){
                  lists += '<script src="' + external_scripts[i] + '"></script>';
                }
              }
              if( external_csss && external_csss.length > 0 ){
                for( var i = 0; i < external_csss.length; i ++ ){
                  lists += '<link href="' + external_csss[i] + '" rel="stylesheet"/>';
                }
              }
              if( script ){
                lists += '<script>' + script + '</script>';
              }
              if( css ){
                lists += '<style>' + css + '</style>';
              }
              lists += '</head><body>';

              if( rows && rows.length > 0 ){
                var table = '<table border="1"><tr>';
                for( var i = 0; i < rows.length; i ++ ){
                  table += '<th>' + rows[i] + '</th>';
                }
                table += '</tr>';
                lists += table;
              }
              lists += "' ); var row; while( row = getRow() ){  var url = '../../_show/" + design_name + "/';  send( ' <tr data-href=\"' + url + row.id + '\">";
              if( rows && rows.length > 0 ){
                for( var i = 0; i < rows.length; i ++ ){
                  lists += "<td><a href=\"' + url + row.id + '\">' + row.value." + rows[i] + " + '</a></td>";
                }
              }
              lists += "</tr>' ); } send( '</table></body></html>' );}";

              doc.lists = {};
              doc.lists[design_name] = lists;
            }

            if( design_doc.shows ){
              var external_scripts = design_doc.shows.external_scripts;
              var external_csss = design_doc.shows.external_csss;
              var script = design_doc.shows.script;
              var css = design_doc.shows.css;
              var title = design_doc.shows.title;
              var body = design_doc.shows.body;

              var shows = "(function(doc,req){ if( doc ){ start( {'headers':{'content-type':'text/html; charset=utf-8'}} ); var str = '<!DOCTYPE html><html><head><title>" + title + "</title>";
              if( external_scripts && external_scripts.length > 0 ){
                for( var i = 0; i < external_scripts.length; i ++ ){
                  shows += '<script src="' + external_scripts[i] + '"></script>';
                }
              }
              if( external_csss && external_csss.length > 0 ){
                for( var i = 0; i < external_csss.length; i ++ ){
                  shows += '<link href="' + external_csss[i] + '" rel="stylesheet"/>';
                }
              }
              if( script ){
                shows += '<script>' + script + '</script>';
              }
              if( css ){
                shows += '<style>' + css + '</style>';
              }
              shows += '</head><body>';

              shows += body;

              shows += "</body></html>'; return str; }else{ return 'empty'; }})";

              doc.shows = {};
              doc.shows[design_name] = shows;
            }
            //console.log( {doc} );

            //. create design doc
            var doc_id = '_design/' + design_name;
            doc._id = doc_id;
            axios.get( base_url + '/' + db + '/' + doc_id, config ).then( async function( r3 ){
              doc._rev = r3.data._rev;
              var r4 = await axios.put( base_url + '/' + db + '/' + doc_id + '?rev=' + doc._rev, doc, config );
              //console.log( {r4} );
              r = { status: true, result: 'successfully updated design documents.' };
              resolve( r );
            }).catch( async function( e ){
              var r4 = await axios.put( base_url + '/' + db + '/' + doc_id, doc, config );
              //console.log( {r4} );
              r = { status: true, result: 'successfully created design documents.' };
              resolve( r );
            });
          });
        }
      }else{
        console.log( 'failed to access to couchdb.' );
        r = { status: false, error: 'failed to access to couchdb.' };
        resolve( r );
      }
    }else{
      console.log( 'no db specified in specified JSON file.' );
      r = { status: false, error: 'no db specified in specified JSON file.' };
      resolve( r );
    }
  });
}

if( process.argv.length < 3 ){
  console.log( 'Usage: $ node bulk_import sample.json' );
  process.exit( -1 );
}else{
  var filepath = process.argv[2];

  var sample = fs.readFileSync( filepath, 'utf-8' );
  if( typeof sample == 'string' ){
    sample = JSON.parse( sample );
  }

  if( sample ){
    bulk_import( sample ).then( function( result ){
      console.log( 'done.', {result} );
    });
  }else{
    console.log( 'No docs found in ' + filepath );
    process.exit( -1 );
  }
}
