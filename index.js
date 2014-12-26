#!/usr/bin/env node

'use strict';

var nomnom      = require( 'nomnom' ),
    fs          = require( 'fs' ),
    xml2js      = require( 'xml2js' ),
    easyzip     = require( 'easy-zip' ).EasyZip;

var parser = new xml2js.Parser(),
    ARGS       = nomnom.parse(),
    dir        = process.cwd(),  // optional source directory
    md         = ARGS.md || 'README',      // optional markdown filename
    p          = ARGS.p;                   // optional package name

if(ARGS.d){
  dir = dir + '/' + ARGS.d;
}

var walk = function ( dir, done ) {
  var results = [];
  fs.readdir( dir, function ( err, list ) {
    if ( err ) return done( err );
    list.sort( function( a, b ) {
        return a < b ? -1 : 1;
    } );

    var i = 0;

    (function next() {
      var file = list[ i++ ];
      if ( !file ) return done( null, results );
      file = dir + '/' + file;
      fs.stat( file, function ( err, stat ) {
        if ( stat && stat.isDirectory() ) {
          walk( file, function ( err, res ) {
            results = results.concat( res );
            next();
          } );
        } else {
          if( file.indexOf( 'sublime-snippet' ) > -1 ){
            results.push( file );
          }
          next();
        }
      } );
    } )();

  } );
};

var walker = function( dir, md ){
  walk( dir, function ( err, results ) {
    if ( err ) throw err;
    results.map( function ( file ) {
      fs.readFile( file, 'utf-8', function ( err, data ) {
        parser.parseString( data, function ( err, data ) {
          fs.appendFile( md + '.md',
            '**' + data.snippet.tabTrigger + '** | ' +
            data.snippet.description + '\n',
            function ( err ) {
              // do nothing
            } );
        } );
      } );
    } );

    console.log('PROCESS COMPLETED!');

  } );
};



if( dir ) {
  console.log('Compiling %s', dir);
  if( p ){
    var zip = new easyzip();
    zip.zipFolder( dir, function(){
      zip.writeToFile( p + '.sublime-package' );
      console.log( 'Rendered Package' );
    } );
  }


  fs.writeFile( md + '.md', 'Snippets for Sublime Text' +
    '\n=================================\n' +
    'Trigger | Description\n' +
    ':------- | :-------\n'
  );

  walker(dir, md);

} else {
  console.log('yo, you need a directory, son...');
}
