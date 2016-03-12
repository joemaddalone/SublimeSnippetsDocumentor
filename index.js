#!/usr/bin/env node

'use strict';

var nomnom      = require( 'nomnom' ),
    fs          = require( 'fs' ),
    xml2js      = require( 'xml2js' ),
    easyzip     = require( 'easy-zip' ).EasyZip;

var parser = new xml2js.Parser(),
    ARGS = nomnom
    .option('package', {
      abbr: 'p',
      help: 'Compile package name for ST3.  [process.cwd()]'
    } )
    .option('directory', {
      abbr: 'd',
      help: 'Source directory where snippets are located'
    } )
    .option('markdown', {
      abbr: 'md',
      default: 'README',
      help: 'Markdown filename'
    } )
    .option('output', {
      abbr: 'o',
      help: 'Directory to output generate files to. [process.cwd()]'
    } )
    .option('title', {
      abbr: 't',
      default: 'Snippets for Sublime Text',
      help: 'Title to include in markdown file'
    } )
    .option('nopackage', {
      flag: true,
      help: 'Do not create ST3 package'
    })
    .parse(),
    sourceDirectory = process.cwd(),
    outputDirectory = process.cwd();

if(ARGS.directory){
  sourceDirectory = sourceDirectory + '/' + ARGS.directory;
}

if(ARGS.output){
  outputDirectory = outputDirectory + '/' + ARGS.output;
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




console.log('Compiling %s', sourceDirectory);
if(!ARGS.nopackage){
  if( ARGS.package ){
    var zip = new easyzip();
    zip.zipFolder( sourceDirectory, function(){
      zip.writeToFile( outputDirectory + '/' + ARGS.package + '.sublime-package' );
      console.log( 'Rendered Package' );
    } );
  }
}



fs.writeFile( outputDirectory + '/' + ARGS.markdown + '.md', ARGS.title +
  '\n=================================\n' +
  'Trigger | Description\n' +
  ':------- | :-------\n'
);

walker(sourceDirectory, outputDirectory + '/' + ARGS.markdown);
