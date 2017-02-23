## CRG
Crash Report Generator


## Technology

- **Hapi** - Server side framework
- **Handlebar** - HTML templating engine
- **MySql** - Mysql database
- **SASS** - CSS preprocessor 
- **Gulp** - Javascript tasks automation
- **WebPack** - Asset pipeline


## Application Structure

```
|
| -- app
|   |-- controllers        // Controllers are organised by module names
|   |   |-- <module_name>  // Each controller defines config and handler for that route.
|   |
|   |-- helpers            // Helper functions used across application
|   |-- models             // All mongoose models are defined here
|   |-- routes             // All app routes are defined here
|   |   |-- <route_plugin> // Route module is a hapi plugin and can be toggled from config/manifest.js
|   |
|   `-- templates          // All server-rendered handlebar templates, partials and helpers
|       |-- <module_name>  // Templates are organised by module names.
|   
|-- assets                 // Contains all static resources 
|   |-- fonts              // Fonts used in application
|   |-- images             // Images used in application
|   |-- misc               // Misc resources used in application
|   |-- scripts            // Client javscripts files which are then packed by webpack
|   |-- styles             // All SASS stylesheets
|   |   |-- <module_name>  // Styles are organised by module names.
|   
|-- config                 // Contains all app configurations
|   |-- assets.js          // Assets configuration file
|   |-- config.js          // Application configuration file which stores all passwords etc. (gitignore).
|   |-- manifest.js        // App manifest file listing all plugins and load order. 
|   |-- meta.js            // App metadata file. 
|   
|-- lib                    // Core application lib/plugins 
|-- tasks                  // Contains all gulp tasks 
|-- tests                  // Code tests
|
|-- gulpfile.js            // Gulp entry file 
|-- index.js               // Application starting point
|-- package.js             // Package configuration file
|-- server.js              // Main server file
```

## Code

We're using semi-colons and comma-last. No rhyme or reason; and some of the hapi [code convention guidelines](http://hapijs.com/styleguide). All client-side js code is also in commonJS pattern packs using webpack. Check out `.editorconfig`, `.jsbeautifyrc`, `.eslintrc` for additional code conventions used.

## Configuration and Running the server locally

1) Install Mysql.(use password = root)
    
    Follow the link to isntall Mysql on Mac
    `https://dev.mysql.com/downloads/mysql/`

    OR

    You can install mysql on sierra from
    `https://gist.github.com/nrollr/3f57fc15ded7dddddcc4e82fe137b58e`


2) Install node.

    `brew install node`

3) Install gulp.

    `npm install --global gulp-cli`

6) Create database skeleton using mysql dump file from location : rn-crash-viewer/sqldump.sql 
   Use below command to import dump :


    and then run

   `$ mysql -u root -p`
   `$ Enter password: root (** you can edit the passowrd and database name in config/config.js > mysql json > $default)`
   `$ Create database report;`
   `$ exit`
   `$ mysql -u root -p report < sqldump.sql;`
   `$ Enter password: root`


- Go to folder $(ROOT)/rn-crash-viewer on terminal and run these commands

```sh
# Install dependencies 
    `$ npm install`

# Run the application
    `$ gulp`

```
The server should be running at [localhost:8000](https://localhost:8000). or http://127.0.0.1:8000


## Contributers

Systango
