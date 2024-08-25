//. bulk_import.js
var fs = require( 'fs' );
var axiosBase = require( 'axios' );

require( 'dotenv' ).config();

async function bulk_import( sample_doc ){
  return new Promise( async ( resolve, reject ) => {
    var username = 'USERNAME' in process.env ? process.env.USERNAME : '';
    var password = 'PASSWORD' in process.env ? process.env.PASSWORD : '';
    var base_url = 'BASE_URL' in process.env ? process.env.BASE_URL : '';

    //var cdb = new COUCHDB_CRUD_SDK( username, password, base_url );
    //var r = await cdb.login();
    //console.log( {r} );
    var r = null;
    var db = sample_doc.db;
    if( db ){
      var axios = axiosBase.create({
        baseURL: base_url,
        responseType: 'json',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
    }else{
      console.log( 'no db specified in specified JSON file.' );
    }

    resolve( r );
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

    });
  }else{
    console.log( 'No docs found in ' + filepath );
    process.exit( -1 );
  }
}
