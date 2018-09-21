CREATE DATABASE crashreporter;
GRANT ALL PRIVILEGES ON crashreporter.* TO 'myuser'@'%' IDENTIFIED BY 'mysql';
GRANT ALL PRIVILEGES ON crashreporter.* TO 'myuser'@'localhost' IDENTIFIED BY 'mysql';
USE crashreporter;

CREATE TABLE Web_App_Users (
  user_id 	INT 	  	   NOT NULL,
  password 	varchar(255) NOT NULL,
  name      varchar(255) NOT NULL,
  email 		varchar(255) NOT NULL,
  dob 			varchar(12)  DEFAULT NULL,
  image_url varchar(255) DEFAULT NULL,
  PRIMARY KEY (user_id)
);

CREATE TABLE Crash_Error 
(error_id INTEGER NOT NULL auto_increment,
 error_msg TEXT NOT NULL,
 error_stacktrace VARCHAR(255) NOT NULL,
 created_at DATETIME NOT NULL, 
 updated_at DATETIME NOT NULL, 
 PRIMARY KEY (error_id)) ENGINE=InnoDB;

CREATE TABLE Crash_Steps 
(step_id INTEGER NOT NULL auto_increment , 
 method TEXT NOT NULL, 
 class VARCHAR(255) NOT NULL, 
 created_at DATETIME NOT NULL, 
 updated_at DATETIME NOT NULL, 
 PRIMARY KEY (step_id)) ENGINE=InnoDB;

CREATE TABLE Error_Reports 
(id INTEGER NOT NULL auto_increment ,
 user_id INTEGER, 
 os_version VARCHAR(255), 
 release_version VARCHAR(255), 
 platform TEXT, 
 model TEXT, 
 error_id INTEGER, 
 manufacturer VARCHAR(255), 
 date DATETIME, 
 error_type VARCHAR(255), 
 status INTEGER DEFAULT 0, 
 created_at DATETIME NOT NULL, 
 updated_at DATETIME NOT NULL, 
 PRIMARY KEY (id)) ENGINE=InnoDB;

  CREATE TABLE User_Crash_Steps 
  (report_id INTEGER NOT NULL, 
  step_id INTEGER NOT NULL, 
  actionOn TEXT, 
  date DATETIME, 
  id INTEGER NOT NULL auto_increment , 
  description TEXT, 
  created_at DATETIME NOT NULL, 
  updated_at DATETIME NOT NULL, 
  PRIMARY KEY (id)) ENGINE=InnoDB;