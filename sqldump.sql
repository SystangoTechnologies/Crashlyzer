Terminal close -- exit!
trib 5.6.33, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: report1
-- ------------------------------------------------------
-- Server version	5.6.33-0ubuntu0.14.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Crash_Error`
--

DROP TABLE IF EXISTS `Crash_Error`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Crash_Error` (
  `error_id` int(11) NOT NULL,
  `error_msg` text NOT NULL,
  `error_stacktrace` text NOT NULL,
  PRIMARY KEY (`error_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Crash_Error`
--

LOCK TABLES `Crash_Error` WRITE;
/*!40000 ALTER TABLE `Crash_Error` DISABLE KEYS */;
INSERT INTO `Crash_Error` VALUES (1,'undefined is not an object (evaluating \'this.props.route.passProps.superObj.showLoadingEffect\')','');
/*!40000 ALTER TABLE `Crash_Error` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Crash_Steps`
--

DROP TABLE IF EXISTS `Crash_Steps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Crash_Steps` (
  `step_id` int(11) NOT NULL,
  `method` text NOT NULL,
  `class` text NOT NULL,
  PRIMARY KEY (`step_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Crash_Steps`
--

LOCK TABLES `Crash_Steps` WRITE;
/*!40000 ALTER TABLE `Crash_Steps` DISABLE KEYS */;
INSERT INTO `Crash_Steps` VALUES (3,'View + RNListViewCell','CVHomeScreen'),(7,'Image + NavigatorNavigationBar','NavigatorNavigationBar'),(21,'RCTView + RNPlayerDetailCell','CVSearchDetailList'),(22,'Image + CVUserProfile','CVUserProfile'),(23,'=','StaticRenderer'),(24,'RCTView + CVPlayerCard, Image + CVPlayerCard','CVPlayerCard'),(25,' Add as Favorite','CVPlayerCard'),(26,'View + BrowseCell','BrowseYear'),(27,'View + BrowseCell','BrowseTeam'),(28,'STEPHEN DREW','RNPlayerDetailCell'),(29,'View + RNPlayerDetailCell','BrowsePlayer'),(30,'2016','RNPlayerDetailCell'),(31,'View + CVPlayerCard, Image + CVPlayerCard','CVPlayerCard');
/*!40000 ALTER TABLE `Crash_Steps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Error_Reports`
--

DROP TABLE IF EXISTS `Error_Reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Error_Reports` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `status` bit(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `os_version` varchar(45) DEFAULT NULL,
  `release_version` varchar(45) DEFAULT NULL,
  `platform` text,
  `model` text,
  `error_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_Error_Reports_3_idx` (`error_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Error_Reports`
--

LOCK TABLES `Error_Reports` WRITE;
/*!40000 ALTER TABLE `Error_Reports` DISABLE KEYS */;
INSERT INTO `Error_Reports` VALUES (1,NULL,'\0','2017-01-20 04:36:04',NULL,'9.3','1.7.2','ios','Simulator',1);
/*!40000 ALTER TABLE `Error_Reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User_Crash_Steps`
--

DROP TABLE IF EXISTS `User_Crash_Steps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `User_Crash_Steps` (
  `report_id` int(11) NOT NULL,
  `step_id` int(11) NOT NULL,
  `actionOn` text,
  `date` datetime DEFAULT NULL,
  `id` int(11) NOT NULL,
  `description` text,
  PRIMARY KEY (`id`),
  KEY `fk_User_Crash_Steps_2_idx` (`step_id`),
  KEY `fk_User_Crash_Steps_1_idx` (`report_id`),
  CONSTRAINT `fk_User_Crash_Steps_1` FOREIGN KEY (`report_id`) REFERENCES `Error_Reports` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_User_Crash_Steps_2` FOREIGN KEY (`step_id`) REFERENCES `Crash_Steps` (`step_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User_Crash_Steps`
--

LOCK TABLES `User_Crash_Steps` WRITE;
/*!40000 ALTER TABLE `User_Crash_Steps` DISABLE KEYS */;
INSERT INTO `User_Crash_Steps` VALUES (1,3,'BROWSE','2017-01-20 15:02:26',235,'User clicked on View + RNListViewCell in class CVHomeScreen with action on BROWSE'),(1,26,'2016 Daily','2017-01-20 15:02:29',236,'User clicked on View + BrowseCell in class BrowseYear with action on 2016 Daily'),(1,27,NULL,'2017-01-20 15:02:30',237,'User clicked on View + BrowseCell in class BrowseTeam'),(1,29,'Batter: STEPHEN DREW','2017-01-20 15:02:35',238,'User clicked on View + RNPlayerDetailCell in class BrowsePlayer with action on Batter: STEPHEN DREW'),(1,31,NULL,'2017-01-20 15:02:45',239,'User clicked on View + CVPlayerCard, Image + CVPlayerCard in class CVPlayerCard'),(1,29,'Batter: WILMER DIFO','2017-01-20 15:02:47',240,'User clicked on View + RNPlayerDetailCell in class BrowsePlayer with action on Batter: WILMER DIFO'),(1,31,NULL,'2017-01-20 15:02:52',241,'User clicked on View + CVPlayerCard, Image + CVPlayerCard in class CVPlayerCard'),(1,28,NULL,'2017-01-20 15:03:03',242,'User clicked on STEPHEN DREW in class RNPlayerDetailCell'),(1,30,NULL,'2017-01-20 15:03:12',243,'User clicked on 2016 in class RNPlayerDetailCell'),(1,7,NULL,'2017-01-20 15:03:16',244,'User clicked on Image + NavigatorNavigationBar in class NavigatorNavigationBar'),(1,29,'Batter: STEPHEN DREW','2017-01-20 15:03:17',245,'User clicked on View + RNPlayerDetailCell in class BrowsePlayer with action on Batter: STEPHEN DREW');
/*!40000 ALTER TABLE `User_Crash_Steps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Web_App_Users`
--

DROP TABLE IF EXISTS `Web_App_Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Web_App_Users` (
  `user_id` int(11) NOT NULL,
  `password` varchar(255) CHARACTER SET utf8 NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `dob` varchar(12) CHARACTER SET utf8 DEFAULT NULL,
  `image_url` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Web_App_Users`
--

LOCK TABLES `Web_App_Users` WRITE;
/*!40000 ALTER TABLE `Web_App_Users` DISABLE KEYS */;
INSERT INTO `Web_App_Users` VALUES (71866,'MTIzNDU2Nw==','admin','admin@example.com','2017-02-13',NULL);
/*!40000 ALTER TABLE `Web_App_Users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-02-17 15:54:47
