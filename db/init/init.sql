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

CREATE TABLE Crash_Error (
  error_id 		 	    INT 	 NOT NULL,
  error_msg 		    text 	 NOT NULL,
  error_stacktrace  text 	 NOT NULL,
  PRIMARY KEY (error_id)
);

CREATE TABLE Crash_Steps (
  step_id 		 INT 	   NOT NULL,
  method 			 text 	 NOT NULL,
  class 			 text 	 NOT NULL,
  PRIMARY KEY (step_id)
);

CREATE TABLE Error_Reports (
  id 				       INT 	 	     NOT NULL,
  user_id 		 	   INT 	 	     DEFAULT NULL,
  status 			     bit(1)  	   NOT NULL,
  created_at 		   timestamp 	 NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at 		   timestamp 	 NULL DEFAULT NULL,
  os_version 		   varchar(45) DEFAULT NULL,
  release_version  varchar(45) DEFAULT NULL,
  platform 		 	   text,
  model 			     text,
  error_id 		 	   INT 	 	     DEFAULT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE User_Crash_Steps (
  report_id 	 INT  	  NOT NULL,
  step_id 		 INT  	  NOT NULL,
  actionOn 		 text,
  date 			   datetime DEFAULT NULL,
  id 			     INT  	  NOT NULL,
  description  text,
  PRIMARY KEY (id),
  CONSTRAINT fk_User_Crash_Steps_1 FOREIGN KEY (report_id) REFERENCES Error_Reports (id)    ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT fk_User_Crash_Steps_2 FOREIGN KEY (step_id)   REFERENCES Crash_Steps (step_id) ON DELETE NO ACTION ON UPDATE NO ACTION
);