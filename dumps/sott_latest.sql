-- CREATE DATABASE  IF NOT EXISTS `SOTT` !40100 DEFAULT CHARACTER SET latin1 ;
-- USE `SOTT`;
-- MySQL dump 10.13  Distrib 5.6.10, for osx10.7 (i386)
--
-- Host: localhost    Database: SOTT
-- ------------------------------------------------------
-- Server version	5.6.10

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
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `accounts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(45) DEFAULT NULL,
  `first_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) DEFAULT NULL,
  `date_of_birth` varchar(45) DEFAULT NULL,
  `gender` enum('male','female') DEFAULT NULL,
  `password` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `city` varchar(45) DEFAULT NULL,
  `country` varchar(45) DEFAULT NULL,
  `profile_image` varchar(45) DEFAULT NULL,
  `project_ids` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES (1,'ilyakar','Ilya','Karnaukhov','1994-04-17','male','184c87a246338443bc78ba0fb7ca5b11','ilya@ramdath.com','Utrecht','The Netherlands','udmv07lQBw7IlJYDiAbLZUxVd.jpg','1,2'),(5,'Doeie','John','Doe','1994-17-17','male','184c87a246338443bc78ba0fb7ca5b11','ilyakar','Almaty','Kazakhstan',NULL,NULL),(6,'Jamesy','James','Johnson','1994-17-17','male','184c87a246338443bc78ba0fb7ca5b11','johnson@hotmail.com','Cardiff','Wales',NULL,NULL),(7,'asd','asd','asd','1223-12-12','male','7815696ecbf1c96e6894b779456d330e','asda','asd','asd',NULL,NULL),(8,'dfg','dfg','dfg','1231-12-12','male','bf22a1d0acfca4af517e1417a80e92d1','asdf','sdf','sdf',NULL,NULL),(9,'ilyakar','Ilya','Karnaukhov','','male','e7e3f43a12acbc22cb0d689389412f3a','','Almaty','Kazakhstan','',''),(10,'asd','asd','asd','2221-12-12','male','7815696ecbf1c96e6894b779456d330e','asd','asd','asd',NULL,NULL),(11,'johnnysmithyy','Johnnnyyyy','Smittthyyy','1994-17-17','male','184c87a246338443bc78ba0fb7ca5b11','ilya@ramdath.com','Utrecht','The Netherlands',NULL,NULL),(12,'stijn','Stijn','van Arendonk','1987-01-01','male','e2aff55eddad1379a067e2de08b2be7f','stijnvanarendonk@gmail.com','Eindhoven','Holland',NULL,NULL);
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Advertising'),(2,'Architecture'),(3,'Art'),(4,'Automotive'),(5,'Beauty'),(6,'City'),(7,'Cosmetics'),(8,'Design'),(9,'Digital'),(10,'Education'),(11,'Entertainment'),(12,'Fashion'),(13,'Financial'),(14,'Food'),(15,'Gadgets'),(16,'Games'),(17,'Health'),(18,'Home'),(19,'Hospitality'),(20,'Luxury'),(21,'Marketing'),(22,'Media'),(23,'Mobile'),(24,'Mobility'),(25,'Music'),(26,'News'),(27,'Other'),(28,'Politics'),(29,'Retail'),(30,'Sex'),(31,'Sports'),(32,'Sustainability'),(33,'Technology'),(34,'Travel'),(35,'Wellness');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `trend_id` int(11) DEFAULT NULL,
  `author_id` int(11) DEFAULT NULL,
  `comment` text,
  `date_time` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (1,61,1,'asda','1/8/2013 at 10:48AM'),(2,61,1,'asdaaaa','5/8/2013 at 8:42AM'),(5,11,1,'Test+comment....','7/8/2013 at 4:16PM'),(6,17,9,'test','8/8/2013 at 10:16AM'),(7,3,10,'cool','8/8/2013 at 10:43AM'),(8,3,1,'wat+een+leuke+post+zeg','8/8/2013 at 1:53PM'),(9,29,1,'jgjhjhj','14/8/2013 at 1:47PM'),(10,26,1,'asadaaaaa','15/8/2013 at 9:45AM');
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mentality_trends`
--

DROP TABLE IF EXISTS `mentality_trends`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mentality_trends` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mentality_trends`
--

LOCK TABLES `mentality_trends` WRITE;
/*!40000 ALTER TABLE `mentality_trends` DISABLE KEYS */;
INSERT INTO `mentality_trends` VALUES (1,'Anger, Distrust and Cynicism'),(2,'Cool Compassion'),(3,'Cool Hope'),(4,'Cool Nostalgia'),(5,'Deep Eco'),(6,'Filtering Instantaneous Information Overload'),(7,'Give Us Narratives'),(8,'Sane Recession'),(9,'Social Web Continued'),(10,'Stress Society'),(11,'Tender Urbanity'),(12,'Urban Nomads'),(13,'Virtuality & Involvement');
/*!40000 ALTER TABLE `mentality_trends` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rater`
--

DROP TABLE IF EXISTS `rater`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rater` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `trend_id` varchar(45) DEFAULT NULL,
  `value` varchar(45) DEFAULT NULL,
  `votes` varchar(45) DEFAULT NULL,
  `user_ids` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=98 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rater`
--

LOCK TABLES `rater` WRITE;
/*!40000 ALTER TABLE `rater` DISABLE KEYS */;
INSERT INTO `rater` VALUES (1,'1',NULL,NULL,NULL),(51,'2',NULL,NULL,NULL),(52,'3','4','1','10'),(53,'4',NULL,NULL,NULL),(54,'5',NULL,NULL,NULL),(55,'6',NULL,NULL,NULL),(56,'7',NULL,NULL,NULL),(57,'8',NULL,NULL,NULL),(58,'9',NULL,NULL,NULL),(59,'10','9','2','1,'),(60,'11','4','1','1'),(61,'12',NULL,NULL,NULL),(62,'13','9','2',''),(63,'14',NULL,NULL,NULL),(64,'15',NULL,NULL,NULL),(65,'16','5','1','1'),(66,'17','5','1','9'),(67,'18',NULL,NULL,NULL),(68,'19',NULL,NULL,NULL),(69,'20',NULL,NULL,NULL),(70,'21','5','1','9'),(71,'22',NULL,NULL,NULL),(72,'23',NULL,NULL,NULL),(73,'24',NULL,NULL,NULL),(74,'25','4','1','1'),(75,'26','4','1','12'),(76,'27','4','1','1'),(77,'28',NULL,NULL,NULL),(78,'29',NULL,NULL,NULL),(79,'30',NULL,NULL,NULL),(80,'31',NULL,NULL,NULL),(81,'32',NULL,NULL,NULL),(82,'33',NULL,NULL,NULL),(83,'34',NULL,NULL,NULL),(84,'35',NULL,NULL,NULL),(85,'36',NULL,NULL,NULL),(86,'37',NULL,NULL,NULL),(87,'38',NULL,NULL,NULL),(88,'39',NULL,NULL,NULL),(89,'40',NULL,NULL,NULL),(90,'41',NULL,NULL,NULL),(91,'42',NULL,NULL,NULL),(92,'43',NULL,NULL,NULL),(93,'44',NULL,NULL,NULL),(94,'45',NULL,NULL,NULL),(95,'46',NULL,NULL,NULL),(96,'47',NULL,NULL,NULL),(97,'48',NULL,NULL,NULL);
/*!40000 ALTER TABLE `rater` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `research_projects`
--

DROP TABLE IF EXISTS `research_projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `research_projects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `research_projects`
--

LOCK TABLES `research_projects` WRITE;
/*!40000 ALTER TABLE `research_projects` DISABLE KEYS */;
INSERT INTO `research_projects` VALUES (1,'Trends 2013'),(2,'Top trend pickers');
/*!40000 ALTER TABLE `research_projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trends`
--

DROP TABLE IF EXISTS `trends`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `trends` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `images` text,
  `title` text,
  `description` text,
  `video` varchar(100) DEFAULT NULL,
  `website` varchar(100) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `tags` text,
  `categories` text,
  `ment_trend` varchar(100) DEFAULT NULL,
  `research_project` int(11) DEFAULT NULL,
  `views` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trends`
--

LOCK TABLES `trends` WRITE;
/*!40000 ALTER TABLE `trends` DISABLE KEYS */;
INSERT INTO `trends` VALUES (25,1,'aOLjNjdUhWNjbQeeORVwbCqer.jpg','Cursus+Bibendum+Lorem+Pharetra+Elit','<p>Cras+mattis+consectetur+purus+sit+amet+fermentum.+Nullam+id+dolor+id+nibh+ultricies+vehicula+ut+id+elit.+Nulla+vitae+elit+libero%2C+a+pharetra+augue.+Cras+justo+odio%2C+dapibus+ac+facilisis+in%2C+egestas+eget+quam.+Maecenas+sed+diam+eget+risus+varius+blandit+sit+amet+non+magna.+Maecenas+faucibus+mollis+interdum.%0A%0ACras+mattis+consectetur+purus+sit+amet+fermentum.+Duis+mollis%2C+est+non+commodo+luctus%2C+nisi+erat+porttitor+ligula%2C+eget+lacinia+odio+sem+nec+elit.+Morbi+leo+risus%2C+porta+ac+consectetur+ac%2C+vestibulum+at+eros.+Cum+sociis+natoque+penatibus+et+magnis+dis+parturient+montes%2C+nascetur+ridiculus+mus.+Cras+justo+odio%2C+dapibus+ac+facilisis+in%2C+egestas+eget+quam.+Aenean+eu+leo+quam.+Pellentesque+ornare+sem+lacinia+quam+venenatis+vestibulum.%0A%0AFusce+dapibus%2C+tellus+ac+cursus+commodo%2C+tortor+mauris+condimentum+nibh%2C+ut+fermentum+massa+justo+sit+amet+risus.+Cras+mattis+consectetur+purus+sit+amet+fermentum.+Duis+mollis%2C+est+non+commodo+luctus%2C+nisi+erat+porttitor+ligula%2C+eget+lacinia+odio+sem+nec+elit.+Donec+id+elit+non+mi+porta+gravida+at+eget+metus.+Cras+justo+odio%2C+dapibus+ac+facilisis+in%2C+egestas+eget+quam.</p>',NULL,NULL,'Utrecht','Amet%2CCondimentum%2CPorta','Architecture%2CArt%2CAutomotive%2CEntertainment%2CHome%2CMedia',NULL,1,6),(26,1,'edCgzUFotfIMLg7997aJNWJms.jpg','Vehicula+Ligula','<p>Donec+id+elit+non+mi+porta+gravida+at+eget+metus.+Etiam+porta+sem+malesuada+magna+mollis+euismod.+Maecenas+faucibus+mollis+interdum.+Aenean+eu+leo+quam.+Pellentesque+ornare+sem+lacinia+quam+venenatis+vestibulum.+Donec+ullamcorper+nulla+non+metus+auctor+fringilla.%0A%0APraesent+commodo+cursus+magna%2C+vel+scelerisque+nisl+consectetur+et.+Praesent+commodo+cursus+magna%2C+vel+scelerisque+nisl+consectetur+et.+Cum+sociis+natoque+penatibus+et+magnis+dis+parturient+montes%2C+nascetur+ridiculus+mus.+Vivamus+sagittis+lacus+vel+augue+laoreet+rutrum+faucibus+dolor+auctor.%0A%0AEtiam+porta+sem+malesuada+magna+mollis+euismod.+Vivamus+sagittis+lacus+vel+augue+laoreet+rutrum+faucibus+dolor+auctor.+Duis+mollis%2C+est+non+commodo+luctus%2C+nisi+erat+porttitor+ligula%2C+eget+lacinia+odio+sem+nec+elit.+Donec+id+elit+non+mi+porta+gravida+at+eget+metus.%0A%0ACras+justo+odio%2C+dapibus+ac+facilisis+in%2C+egestas+eget+quam.+Maecenas+sed+diam+eget+risus+varius+blandit+sit+amet+non+magna.+Morbi+leo+risus%2C+porta+ac+consectetur+ac%2C+vestibulum+at+eros.+Maecenas+sed+diam+eget+risus+varius+blandit+sit+amet+non+magna.+Duis+mollis%2C+est+non+commodo+luctus%2C+nisi+erat+porttitor+ligula%2C+eget+lacinia+odio+sem+nec+elit.</p>',NULL,NULL,'Utrecht','Adis%2CSit%2CAc','Advertising%2CArchitecture%2CAutomotive%2CDesign',NULL,1,8),(27,1,'epjSeC5HBYPIboCOa3Nvpp2Ly.jpg,IgiSVvZOIdqL2i2J8ZBXxBjUh.jpg,hiwJSGqJsFuORuOMiIF25Bh6C.jpg,eweDdEwcfrwv9QPyVWGtjCLLk.jpg','Parturient+Nibh+Vehicula','<p>Nullam+id+dolor+id+nibh+ultricies+vehicula+ut+id+elit.+Integer+posuere+erat+a+ante+venenatis+dapibus+posuere+velit+aliquet.+Aenean+lacinia+bibendum+nulla+sed+consectetur.</p>',NULL,NULL,'Utrecht','Tristique%2CSit%2CVehicula','Automotive%2CDesign%2CDigital%2CFashion%2CFinancial%2CHealth',NULL,2,NULL),(28,1,'WxQq1ohjmmFj5F3JJ6HmwlNxQ.jpg,KvALy6ItYlZTgtEbQM1xWyXex.jpg,OzuZKfaNAlV31qZ7lC9oiBNTH.jpg,DLRGSFub1EHltBzDpHFYK3HR9.jpg','Ornare+Ridiculus+Ullamcorper','<p>Lorem+ipsum+dolor+sit+amet%2C+consectetur+adipiscing+elit.+Nullam+id+dolor+id+nibh+ultricies+vehicula+ut+id+elit.+Nullam+quis+risus+eget+urna+mollis+ornare+vel+eu+leo.+Aenean+lacinia+bibendum+nulla+sed+consectetur.+Cum+sociis+natoque+penatibus+et+magnis+dis+parturient+montes%2C+nascetur+ridiculus+mus.%0A%0AAenean+lacinia+bibendum+nulla+sed+consectetur.+Cras+justo+odio%2C+dapibus+ac+facilisis+in%2C+egestas+eget+quam.+Nulla+vitae+elit+libero%2C+a+pharetra+augue.+Cum+sociis+natoque+penatibus+et+magnis+dis+parturient+montes%2C+nascetur+ridiculus+mus.+Vestibulum+id+ligula+porta+felis+euismod+semper.+Duis+mollis%2C+est+non+commodo+luctus%2C+nisi+erat+porttitor+ligula%2C+eget+lacinia+odio+sem+nec+elit.</p>',NULL,NULL,'Utrecht%2C+The+Netherlands','Ornare%2CMalesuada%2CLigula%2520Adipiscing','Design%2CEntertainment%2CGames%2CMedia%2CMobile%2CWellness',NULL,2,NULL),(29,1,'792eGwAyLpd3RcO0sOjn7jTEL.jpg,fP43FEPghV0Kj1PgP0l2AJB7o.jpg,Q5svnS4V9nx19whvEISRRkaLt.jpg,I8CEklAZK3E5NdKp427Rhn9NG.jpg','Bibendum+Dapibus+Amet+Euismod','<p>Sed+posuere+consectetur+est+at+lobortis.+Nulla+vitae+elit+libero%2C+a+pharetra+augue.+Vestibulum+id+ligula+porta+felis+euismod+semper.+Aenean+eu+leo+quam.+Pellentesque+ornare+sem+lacinia+quam+venenatis+vestibulum.%0A%0AAenean+lacinia+bibendum+nulla+sed+consectetur.+Integer+posuere+erat+a+ante+venenatis+dapibus+posuere+velit+aliquet.+Vestibulum+id+ligula+porta+felis+euismod+semper.+Cras+justo+odio%2C+dapibus+ac+facilisis+in%2C+egestas+eget+quam.+Aenean+eu+leo+quam.+Pellentesque+ornare+sem+lacinia+quam+venenatis+vestibulum.+Donec+sed+odio+dui.+Maecenas+sed+diam+eget+risus+varius+blandit+sit+amet+non+magna.%0A%0AMorbi+leo+risus%2C+porta+ac+consectetur+ac%2C+vestibulum+at+eros.+Maecenas+faucibus+mollis+interdum.+Praesent+commodo+cursus+magna%2C+vel+scelerisque+nisl+consectetur+et.+Maecenas+faucibus+mollis+interdum.</p>',NULL,NULL,'Utrecht%2C+The+Netherlands','Inceptos%2CCras%2CCursus%2CBibendum%2CEgestas','City%2CDesign%2CFood%2CMobile%2CMobility',NULL,1,7),(30,12,'0jvNt7twtNzInAsCWc9hmrKLy.jpg','hallo','<p>test</p>',NULL,NULL,'utrecht','utrecht%2520science%2Cutrecht','',NULL,2,NULL),(31,1,'EjkZf8Md4H0YqpJjFpHOe4nIU.jpg,UCi9AbYtsme78YSpTsl5tvVEA.jpg','Test','<p>testo</p>','http%3A%2F%2Ftest+video+link','http%3A%2F%2Ftest+website+link','Utrecht%2C+The+Netherlands','Cool%2520trend%2CAmazing%2520trend%2Cawesome%2Ccool%2Cyay','Cosmetics%2CEducation%2CFashion%2CGadgets%2CGames%2CHospitality%2CMedia%2COther%2CPolitics','deep+eco',1,NULL),(32,1,'qKtCyso8sUWXerJjPiMALBe1j.jpg,eBRERIy8cBkGSUs23e8bbK5JM.jpg','asda','','asda','asda','Utrecht%2C+The+Netherlands','asda','Architecture%2CArt','cool+nostalgia',1,NULL),(33,1,'n669Djut3LRXdeyLuLJqpGMTx.jpg,8u6TqYncGWhakQ5cGzJpw5oPc.jpg,p7wchDuFFa8wHtnNmCioaI36d.jpg,WEmJYka07vaxAWrTUIyYKyjgc.jpg','Lorem+ipsum','%3Cp%3ENullam+quis+risus+eget+urna+mollis+ornare+vel+eu+leo.+Praesent+commodo+cursus+magna%2C+vel+scelerisque+nisl+consectetur+et.+Donec+id+elit+non+mi+porta+gravida+at+eget+metus.+Maecenas+faucibus+mollis+interdum.+Cras+mattis+consectetur+purus+sit+amet+fermentum.%3C%2Fp%3E%0A%3Cp%3E%26nbsp%3B%3C%2Fp%3E%0A%3Cp%3ECras+mattis+consectetur+purus+sit+amet+fermentum.+Lorem+ipsum+dolor+sit+amet%2C+consectetur+adipiscing+elit.+Nulla+vitae+elit+libero%2C+a+pharetra+augue.+Fusce+dapibus%2C+tellus+ac+cursus+commodo%2C+tortor+mauris+condimentum+nibh%2C+ut+fermentum+massa+justo+sit+amet+risus.+Praesent+commodo+cursus+magna%2C+vel+scelerisque+nisl+consectetur+et.+Duis+mollis%2C+est+non+commodo+luctus%2C+nisi+erat+porttitor+ligula%2C+eget+lacinia+odio+sem+nec+elit.+Nullam+quis+risus+eget+urna+mollis+ornare+vel+eu+leo.%3C%2Fp%3E%0A%3Cp%3E%26nbsp%3B%3C%2Fp%3E%0A%3Cp%3ENulla+vitae+elit+libero%2C+a+pharetra+augue.+Maecenas+faucibus+mollis+interdum.+Praesent+commodo+cursus+magna%2C+vel+scelerisque+nisl+consectetur+et.+Nulla+vitae+elit+libero%2C+a+pharetra+augue.+Donec+id+elit+non+mi+porta+gravida+at+eget+metus.+Cras+mattis+consectetur+purus+sit+amet+fermentum.%3C%2Fp%3E','asda','tesco','Utrecht%2C+The+Netherlands','asda','Design%2CEntertainment%2CGadgets','cool+nostalgia',1,NULL),(34,1,'nAsiFnS8xJLsBX8T4ElQgC1rP.jpg,a1cG6z5LL4ZpV4cWGqSYRIi39.jpg,UQdLAgVpeBwt2lRkduAXoZHRW.jpg','Test','%3Cp%3EVivamus+sagittis+lacus+vel+augue+laoreet+rutrum+faucibus+dolor+auctor.+Duis+mollis%2C+est+non+commodo+luctus%2C+nisi+erat+porttitor+ligula%2C+eget+lacinia+odio+sem+nec+elit.+Maecenas+sed+diam+eget+risus+varius+blandit+sit+amet+non+magna.+Lorem+ipsum+dolor+sit+amet%2C+consectetur+adipiscing+elit.+Aenean+lacinia+bibendum+nulla+sed+consectetur.+Maecenas+sed+diam+eget+risus+varius+blandit+sit+amet+non+magna.%3C%2Fp%3E%0A%3Cp%3E%26nbsp%3B%3C%2Fp%3E%0A%3Cp%3EInteger+posuere+erat+a+ante+venenatis+dapibus+posuere+velit+aliquet.+Aenean+eu+leo+quam.+Pellentesque+ornare+sem+lacinia+quam+venenatis+vestibulum.+Lorem+ipsum+dolor+sit+amet%2C+consectetur+adipiscing+elit.+Fusce+dapibus%2C+tellus+ac+cursus+commodo%2C+tortor+mauris+condimentum+nibh%2C+ut+fermentum+massa+justo+sit+amet+risus.+Praesent+commodo+cursus+magna%2C+vel+scelerisque+nisl+consectetur+et.%3C%2Fp%3E','asda','tesco','asda','asda','Advertising%2CArchitecture%2CArt%2CAutomotive','sane+recession',1,NULL),(35,1,'kIAhsjaoM7fEApKDgAPykwYKH.jpg,RgTp1yxV511BEhhwfgSyrLP0V.jpg,yysTIgyIPYVmQYNqlQXtlaVLe.jpg','asda','%3Cp%3Easda%3C%2Fp%3E','asda','asdsa','Utrecht%2C+The+Netherlands','asda','Architecture%2CArt','deep+eco',2,NULL),(36,1,'ATLNCorg4g2THgeeA1s3txfaj.jpg,kIukf3LblDkCmTMw8jHbLpRVO.jpg,FUWYl3OeATWWXjeFlFMZYXWoe.jpg','asda','%3Cp%3Easda%3C%2Fp%3E','asda','asda','Utrecht%2C+The+Netherlands','asda','Art%2CAutomotive','tender+urbanity',1,NULL),(37,1,'jLH1XPTP6WkFcK5K3Dfpup7Gc.jpg,8rBa27hqBWBNvoOQikApDHPTF.jpg,y57cnGvuAfVP3HNwDWW5QSlwM.jpg,DuG3BGhgpa8ncgtBNkjJoynHa.jpg','asda','%3Cp%3Easda%3C%2Fp%3E','asda','asda','Utrecht%2C+The+Netherlands','asda','Architecture%2CEducation%2CEntertainment','filtering+instantaneous+information+overload',2,NULL),(38,1,'Zx0hMMYRub90aFIs2Ij4nJXZF.jpg,YpDMVdVLMIaVnQcx5MVRkW6GW.jpg,tZMkwVTUi2QVBTnRpjJCIWXtM.jpg,GJUwXM3PeIe2tSCyBnCHZBHQN.jpg','asdaa','%3Cp%3Easdaaa%3C%2Fp%3E','asdasa','safsdfsd','Utrecht%2C+The+Netherlands','sdfsdf','Architecture%2CArt%2CCity','cool+hope',1,NULL),(39,1,'y2L3fYOJjCUfLeU0GUM4lglpX.jpg,QUytTFEMA7mmUeBAvwsof8Q4o.jpg,LvmqeLr46CmKfDgPHnxdSjv9t.jpg,8uGZctph6Qy0u4aMmeyOxhPuc.jpg','asda','%3Cp%3Easds%3C%2Fp%3E','sdf','sdf','Utrecht%2C+The+Netherlands','sdf','Architecture%2CArt','cool+nostalgia',2,NULL),(40,1,'uBcyQii586YL7iJah08eaWBVW.','','','','','Utrecht%2C+The+Netherlands','asd','Advertising%2CArchitecture','deep+eco',2,NULL),(41,1,'78lq29dpz9HAqTalUIWHa0cP8.','','','','','Utrecht%2C+The+Netherlands','asdf','Architecture%2CArt%2CAutomotive','cool+nostalgia',2,NULL),(42,1,'vwZ8JTGRQXGQ1AO0MfDoSDVFT.','','','','','Utrecht%2C+The+Netherlands','asda','Architecture%2CArt%2CAutomotive','deep+eco',2,NULL),(43,1,'31rqO1RdSTH99JtwBFSb07cOq.','','','','','Utrecht%2C+The+Netherlands','asd','Architecture%2CArt','cool+hope',2,NULL),(44,1,'15wn0kqFR7wCHei9Vdq8WZKvz.','','','','','Utrecht%2C+The+Netherlands','asda','Architecture%2CArt','cool+compassion',1,NULL),(45,1,'dqFSzYMGomQlVv8sf1KaLRcBB.','','','','','Utrecht%2C+The+Netherlands','asd','Architecture%2CArt%2CAutomotive','deep+eco',1,NULL),(46,1,'iPhTXDBPvevpTX6hpFgGcJxx1.jpg,pGX5zsqY7irVwTBnT1273X9Xl.jpg,mB1LgBu3xGWiKfbrNasnntBo1.jpg,rlcO8sSnQtTSV6ywNIuuMSsys.jpg','Lorem+ipsum','%3Cp%3EInteger+posuere+erat+a+ante+venenatis+dapibus+posuere+velit+aliquet.+Sed+posuere+consectetur+est+at+lobortis.+Lorem+ipsum+dolor+sit+amet%2C+consectetur+adipiscing+elit.+Nullam+id+dolor+id+nibh+ultricies+vehicula+ut+id+elit.+Sed+posuere+consectetur+est+at+lobortis.+Maecenas+faucibus+mollis+interdum.%3C%2Fp%3E%0A%3Cp%3E%26nbsp%3B%3C%2Fp%3E%0A%3Cp%3ECras+mattis+consectetur+purus+sit+amet+fermentum.+Maecenas+faucibus+mollis+interdum.+Praesent+commodo+cursus+magna%2C+vel+scelerisque+nisl+consectetur+et.+Donec+sed+odio+dui.+Sed+posuere+consectetur+est+at+lobortis.%3C%2Fp%3E%0A%3Cp%3E%26nbsp%3B%3C%2Fp%3E%0A%3Cp%3EAenean+lacinia+bibendum+nulla+sed+consectetur.+Integer+posuere+erat+a+ante+venenatis+dapibus+posuere+velit+aliquet.+Cum+sociis+natoque+penatibus+et+magnis+dis+parturient+montes%2C+nascetur+ridiculus+mus.+Curabitur+blandit+tempus+porttitor.+Aenean+lacinia+bibendum+nulla+sed+consectetur.%3C%2Fp%3E','asda','asda','Utrecht%2C+The+Netherlands','asda','Architecture%2CArt%2CCity%2CCosmetics%2CEntertainment%2CGadgets%2CHospitality%2CLuxury%2CMobility','stress+society',1,NULL),(47,1,'bHWsXzShAxT9XyqwekcnKAAF6.jpg,5zVVU7ZpoN5QEPv8zqpcNvvOs.jpg','Video+trend','%3Cp%3E%3Cstrong%3EWhat+it+is%3C%2Fstrong%3E%3C%2Fp%3E%0A%3Cp%3ECurabitur+blandit+tempus+porttitor.+Maecenas+faucibus+mollis+interdum.+Donec+id+elit+non+mi+porta+gravida+at+eget+metus.+Fusce+dapibus%2C+tellus+ac+cursus+commodo%2C+tortor+mauris+condimentum+nibh%2C+ut+fermentum+massa+justo+sit+amet+risus.+Etiam+porta+sem+malesuada+magna+mollis+euismod.+Etiam+porta+sem+malesuada+magna+mollis+euismod.+Maecenas+faucibus+mollis+interdum.%3C%2Fp%3E%0A%3Cp%3E%26nbsp%3B%3C%2Fp%3E%0A%3Cp%3E%3Cstrong%3EWhy+it+is%3C%2Fstrong%3E%3C%2Fp%3E%0A%3Cp%3EFusce+dapibus%2C+tellus+ac+cursus+commodo%2C+tortor+mauris+condimentum+nibh%2C+ut+fermentum+massa+justo+sit+amet+risus.+Cras+justo+odio%2C+dapibus+ac+facilisis+in%2C+egestas+eget+quam.+Vestibulum+id+ligula+porta+felis+euismod+semper.+Praesent+commodo+cursus+magna%2C+vel+scelerisque+nisl+consectetur+et.%3C%2Fp%3E%0A%3Cp%3E%26nbsp%3B%3C%2Fp%3E%0A%3Cp%3E%3Cstrong%3EAbsolutely%3C%2Fstrong%3E%3C%2Fp%3E%0A%3Cp%3EMorbi+leo+risus%2C+porta+ac+consectetur+ac%2C+vestibulum+at+eros.+Cras+justo+odio%2C+dapibus+ac+facilisis+in%2C+egestas+eget+quam.+Praesent+commodo+cursus+magna%2C+vel+scelerisque+nisl+consectetur+et.+Vivamus+sagittis+lacus+vel+augue+laoreet+rutrum+faucibus+dolor+auctor.+Cras+mattis+consectetur+purus+sit+amet+fermentum.+Sed+posuere+consectetur+est+at+lobortis.+Vivamus+sagittis+lacus+vel+augue+laoreet+rutrum+faucibus+dolor+auctor.%3C%2Fp%3E','http%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D3ceswupiXEc','http%3A%2F%2Fbiggo.org','Utrecht%2C+The+Netherlands','Video%2520tag%2Cdefenitely%2Cawesome%2Camazing%2Cdope%21','Art%2CAutomotive%2CCity%2CFood%2CHospitality%2CMobile%2CMobility%2CSex','stress+society',NULL,NULL),(48,1,'L7XJ7OrMkUKLsaCRO6Rk1oKiu.jpg,egQ52ePMIl68KsOWT2xfPpVD6.jpg,kpUVuaPmCLOIHP2JqTN3AccGB.jpg,bLXbfsfeF8XrsHlU0QoQavKGs.jpg','dsf','%3Cp%3Esdfs%3C%2Fp%3E','sdf','sdf','Utrecht%2C+The+Netherlands','sdfsd','Design%2CEntertainment','stress+society',NULL,NULL);
/*!40000 ALTER TABLE `trends` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trends_trash`
--

DROP TABLE IF EXISTS `trends_trash`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `trends_trash` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(45) DEFAULT NULL,
  `images` text,
  `title` text,
  `description` text,
  `tags` text,
  `categories` text,
  `location` varchar(45) DEFAULT NULL,
  `research_project` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trends_trash`
--

LOCK TABLES `trends_trash` WRITE;
/*!40000 ALTER TABLE `trends_trash` DISABLE KEYS */;
INSERT INTO `trends_trash` VALUES (11,'1','RFZ34fO413BGtS2QzlQj8kd91.jpg,z3QQj5arZuCx6W7rzmBpHyR4p.jpg,8HMn3Q01bx4TkZcqMZTljxEtB.jpg,xm4WoQtDI9khWtVLcNSjwi9vs.jpg,0K6tfd8dADDaFeQ0VaaITsCDM.jpg','Trend','<p>asta+la+vista</p>','test%2Ctag%2Cges%2Ccool','Advertising%2CArchitecture%2CAutomotive%2CHome%2CMobile','Utrecht%2C+Netherlands','1'),(61,'1','Ya623kyfFt4qeBGSnaUA2yaEX.jpg','There+was+a+man...+%27John%27','<p>Best+Summer+Reads+2013%0APeter+H.+Diamandis+and+Steven+Kotler+%E2%80%93+Abundance%0A%0AWhat+it+Is%3A%0AThis+is+a+ravishingly+optimistic%2C+even+happy+book.+Times+might+be+dark+and+filled+with+understandable+anger%2C+distrust+and+cynicism%2C+but+according+to+Diamandis+and+Kotler%2C+the+future+looks+bright%21+Not+so+exclusively%2C+as+a+consequence+of+the+empowering+capacities+of+the+Future+Perfect+Internet.+In+Abundance%2C+Diamandis+and+Kotler+pay+much+attention+to+new+technological+empowering+tools%2C+such+as+the+3D+Makers+Revolution.+More+so%2C+where+the+new+techno+Makers+Revolution+meets+the+Internet+of+Things%2C+the+arguments+for+Abundance+get+seriously+convincing.+%0A%0AWhy+it+is+Cool%3A%0A%E2%80%9CImagine+a+world+of+nine+billion+people+with+clean+water%2C+nutritious+food%2C+affordable+housing%2C+personalized+education%2C+top+tier+medical+care+and+non-polluting%2C+ubiquitous+energy.+Building+this+better+world+is+humanity%E2%80%99s+grandest+challenge.+What+follows+is+the+store+of+how+we+can+rise+to+meet+it.%E2%80%9D%0A%0A%E2%80%9CThe+biggest+opportunity+in+water%2C+isn%E2%80%99t+in+water%3A++it%E2%80%99s+in+information%E2%80%9D.+What+he%E2%80%99s+talking+about+is+waste.+Right+now%2C+in+America%2C+70+percent+of+out+water+is+used+for+agriculture%2C+yet+50+percent+of+the+food+produced+gets+thrown+away.+Five+percent+of+our+energy+goes+to+pump+water%2C+but+20+percent+of+our+water+streams+out+of+holes+into+leaky+pipes.+%E2%80%9CThe+examples+are+endless%2C%E2%80%9D+says+Williams%2C+%E2%80%9Cand+the+bottom+line+is+consistent%3A+show+me+a+water+problem+and+I%E2%80%99ll+show+you+an+information+problem.%E2%80%9D%0A%0AScience+of+the+Time%E2%80%99s+Interpretation%3A%0AWhen+a+person+radiates+an+optimistic%2C+happy+view+on+the+future%2C+many+of+us+get+distrustful.+One+way+or+the+other%2C+we+swallow+negativism+better+as+parents+of+our+worldview+than+blissful+hope.+So+Abundance+will+for+sure+encounter+septicemicism.+The+good+thing+though+is+that+Abundance+can+easily+cope+with+that.+The+book+simply+has+too+many+good+and+strong+arguments+to+bow+for+collective+gloom.+So+read+the+book+and+get+happy.%0A%0AMore+info+about+the+author+here.%0AFind+Abundance+in+our+library.</p>','alpha, beta, charlie, echo','Architecture%2CAutomotive%2CBeauty%2CCosmetics%2CDesign%2CFinancial%2CMobile%2CMobility%2CTechnology%2CTravel','Tilburg','1');
/*!40000 ALTER TABLE `trends_trash` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2013-08-16 11:03:04
