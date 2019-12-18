-- MySQL dump 10.13  Distrib 5.7.27, for Linux (x86_64)
--
-- Host: localhost    Database: gm_screen
-- ------------------------------------------------------
-- Server version	5.7.27-0ubuntu0.18.04.1

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
-- Table structure for table `images`
--

DROP TABLE IF EXISTS `images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `images` (
  `imageId` int(11) NOT NULL AUTO_INCREMENT,
  `fileName` varchar(200) CHARACTER SET latin1 NOT NULL,
  `userGivenName` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`imageId`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `images`
--

LOCK TABLES `images` WRITE;
/*!40000 ALTER TABLE `images` DISABLE KEYS */;
INSERT INTO `images` VALUES (25,'2f75c236-97f2-4e85-a56e-c9ca502b2c3e..jpg','Rodian','Secondary'),(26,'9841ffcb-7aba-49e8-b0f6-809b8438b381..jpg','Wolf dude','Secondary'),(27,'85b0ec7c-ff9f-4811-a316-215b0b4b04c1..png','Heavy Blaster Rifle','Secondary'),(28,'3d0e382a-7376-4802-9984-f936f4d04fbf..jpg','Ship Interior','Environment'),(29,'0a4b011b-ae30-4245-a43f-1f75bf1cccae..jpg','Dark Village','Environment'),(32,'ec1442ff-dbcb-4372-8e13-8bd1f982c2d0..png','Twilek','Secondary'),(33,'9c0c9b02-131a-43f5-9162-ae1b9afd747f..jpg','DK Landing Pad','Environment'),(34,'239545de-9078-4309-b1c7-82795a9b2785..jpg','DK Landing Pad','Environment'),(35,'a05f02cf-722f-4be5-a96f-2f729ddbbfcf..jpg','SK Spaceport','Environment'),(36,'269f3226-c7f3-4fc0-a3c5-741d3ea3b526..jpg','DK Approach','Environment'),(37,'fbddd7b2-b8c6-4931-bee7-4b6e6087f61d..jpg','DK Cantina Interior','Environment'),(38,'e9033d3b-c3a4-4e74-993f-7e631eea4df8..jpg','Dark Ship Interior','Environment'),(39,'cb5d2e3a-7dea-4155-8685-f31c44824c25..jpg','Imperial Officer','Secondary'),(40,'83e7f9dc-2d56-427b-99e1-9074fbda742e..jpg','SH Hangar','Environment'),(41,'3161101f-cf67-4d6b-b9bb-840e7fb6b1cb..jpg','SH Hall','Environment'),(42,'ac808be0-530d-4df8-8927-026019eca024..jfif','Cody','Secondary'),(43,'90711f28-b569-48b6-98dc-08f6096a0129..png','B-1','Secondary'),(44,'9c98c081-98ef-473d-bcc6-bf0b0db6a8e9..png','Mando','Secondary'),(45,'438618e8-e071-4670-b345-5d6e6848d581..png','Fat Imperial Officer','Secondary'),(46,'365b615a-5160-47dd-8059-2189ae33c5ca..png','Duros','Secondary'),(47,'aa7a6c7e-bc51-419f-9f1d-0d207a11d49b..jpg','Rainy Village Street','Environment');
/*!40000 ALTER TABLE `images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessionImages`
--

DROP TABLE IF EXISTS `sessionImages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessionImages` (
  `sessionImageId` int(11) NOT NULL AUTO_INCREMENT,
  `sessionId` int(11) NOT NULL,
  `imageId` int(11) NOT NULL,
  PRIMARY KEY (`sessionImageId`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessionImages`
--

LOCK TABLES `sessionImages` WRITE;
/*!40000 ALTER TABLE `sessionImages` DISABLE KEYS */;
INSERT INTO `sessionImages` VALUES (5,1,25),(6,1,26),(7,1,27),(8,1,28),(9,1,29),(10,1,30),(12,1,32),(13,1,33),(14,1,34),(15,1,35),(16,1,36),(17,1,37),(18,1,38),(19,1,39),(20,1,40),(21,1,41),(22,1,42),(23,1,43),(24,1,44),(25,1,45),(26,1,46),(27,1,47);
/*!40000 ALTER TABLE `sessionImages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `sessionId` int(11) NOT NULL AUTO_INCREMENT,
  `sessionName` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sessionGM` int(11) NOT NULL,
  PRIMARY KEY (`sessionId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES (1,'Landing on Nar Shadda',1);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `userId` int(11) NOT NULL AUTO_INCREMENT,
  `userName` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admiral Ackbar'),(2,'Gold One');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-12-18 12:40:47
