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

## Options
```
   -p, --package     Compile package name for ST3.  [process.cwd()]
   -d, --directory   Source directory where snippets are located
   -md, --markdown   Markdown filename  [README]
   -o, --output      Directory to output generate files to. [process.cwd()]
   -t, --title       Title to include in markdown file  [Snippets for Sublime Text]
   --nopackage       Do not create ST3 package
   --nomd            Do not create markdown file
```
## Usage

    ```
    compilesnippets --d 'SnippetsDirectory' --o 'OutputDirectory' --md 'MarkdownFilename' --p 'PackageName' --t 'MarkdownTitle'
    ```

###Note

All flags are optional,
Excluding the directory flag will presume you mean to use the current directory.
MD filename and Package filename do not require an extension.
