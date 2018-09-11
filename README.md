## Crashlyzer
Dashboard tool to analyze the reported crashes from the [React Native Crash Reporter](https://github.com/SystangoTechnologies/rn-crash-reporter) library.


## Technology

- **Hapi**      - Server side framework
- **Handlebar** - HTML templating engine
- **MySql**     - Mysql database
- **SASS**      - CSS preprocessor 
- **Gulp**      - Javascript tasks automation
- **WebPack**   - Asset pipeline
- **Docker**    - Containerisation platform


## Application Structure

```
|
| -- app
|   |-- controllers        // Controllers are organised by module names
|   |   |-- <module_name>  // Each controller defines config and handler for that route
|   |
|   |-- helpers            // Helper functions used across application
|   |-- models             // All mongoose models are defined here
|   |-- routes             // All app routes are defined here
|   |   |-- <route_plugin> // Route module is a hapi plugin and can be toggled from config/manifest.js
|   |
|   `-- templates          // All server-rendered handlebar templates, partials and helpers
|       |-- <module_name>  // Templates are organised by module names
|   
|-- assets                 // Contains all static resources 
|   |-- fonts              // Fonts used in application
|   |-- images             // Images used in application
|   |-- misc               // Misc resources used in application
|   |-- scripts            // Client javscripts files which are then packed by webpack
|   |-- styles             // All SASS stylesheets
|   |   |-- <module_name>  // Styles are organised by module names
|   
|-- config                 // Contains all app configurations
|   |-- assets.js          // Assets configuration file
|   |-- config.js          // Application configuration file which stores all passwords etc. (gitignore)
|   |-- manifest.js        // App manifest file listing all plugins and load order
|   |-- meta.js            // App metadata file
|   
| -- db
|   |-- data               // Mysql Data directory
|   |   |-- <mysql-dir>    // Mysql Data files
|   |-- init               // Mysql Initialisation Scripts
|   |   |-- init.sql       // Table definitions
|   |   |-- insert.sql     // Initial data
|
|-- lib                    // Core application lib/plugins 
|-- tasks                  // Contains all gulp tasks 
|
|-- gulpfile.js            // Gulp entry file 
|-- index.js               // Application starting point
|-- package.js             // Package configuration file
|-- server.js              // Main server file
|-- Dockerfile             // Dockerfile containing the build information
|-- docker-compose.yml     // Docker-Compose file containing the web and db services information

```

## Code Style 

We're using semi-colons and comma-last. No rhyme or reason; and some of the hapi [code convention guidelines](http://hapijs.com/styleguide). All client-side js code is also in commonJS pattern packs using webpack. Check out `.editorconfig`, `.jsbeautifyrc`, `.eslintrc` for additional code conventions used.

## Dockerised Startup
Please execute the following command at the root of the project to boot the database and web-app containers
```
Docker-Compose up
```

## Entity Relationship Diagram
![ERD](https://github.com/sytango-technologies/rn-crash-viewer/blob/master/ERD.png)

## Contributors
[Arpit Khandelwal](https://www.linkedin.com/in/arpitkhandelwal1984/)
