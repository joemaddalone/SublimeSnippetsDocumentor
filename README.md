# Sublime Snippets Documentor / Packager

## Summary
This package generates a README.md file by iterating through your snippets directories and files
It can also generate a *.sublime-package file from your snippets for use with ST3

## Requirements
[Node.js](http://nodejs.org)

[Sublime Text](http://www.sublimetext.com/)

## Installation

    npm install compilesnippets -g

## Test

    npm test

## Usage

    compilesnippets --d "SnippetsDirectory" --md "MD Filename" --p "Package name"

###Note

All flags are optional,
Excluding the directory flag will presume you mean to use the current directory.
MD filename and Package filename do not require an extension.
