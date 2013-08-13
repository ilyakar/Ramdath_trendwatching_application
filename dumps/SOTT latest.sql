-- CREATE DATABASE  IF NOT EXISTS `SOTT` /*!40100 DEFAULT CHARACTER SET latin1 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES (1,'ilyakar','Ilya','Karnaukhov','1994-04-17','male','184c87a246338443bc78ba0fb7ca5b11','ilyakar@biggo.org','Utrecht','The Netherlands','6G89cMRfKKu4caP9MdNWrIhMF.jpeg','1,2'),(5,'Doeie','John','Doe','1994-17-17','male','184c87a246338443bc78ba0fb7ca5b11','ilyakar','Almaty','Kazakhstan',NULL,NULL),(6,'Jamesy','James','Johnson','1994-17-17','male','184c87a246338443bc78ba0fb7ca5b11','johnson@hotmail.com','Cardiff','Wales',NULL,NULL),(7,'asd','asd','asd','1223-12-12','male','7815696ecbf1c96e6894b779456d330e','asda','asd','asd',NULL,NULL),(8,'dfg','dfg','dfg','1231-12-12','male','bf22a1d0acfca4af517e1417a80e92d1','asdf','sdf','sdf',NULL,NULL),(9,'ilyakar','Ilya','Karnaukhov','','male','e7e3f43a12acbc22cb0d689389412f3a','','Almaty','Kazakhstan','',''),(10,'asd','asd','asd','2221-12-12','male','7815696ecbf1c96e6894b779456d330e','asd','asd','asd',NULL,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (1,61,1,'asda','1/8/2013 at 10:48AM'),(2,61,1,'asdaaaa','5/8/2013 at 8:42AM'),(5,11,1,'Test+comment....','7/8/2013 at 4:16PM'),(6,17,9,'test','8/8/2013 at 10:16AM'),(7,3,10,'cool','8/8/2013 at 10:43AM'),(8,3,1,'wat+een+leuke+post+zeg','8/8/2013 at 1:53PM');
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rater`
--

LOCK TABLES `rater` WRITE;
/*!40000 ALTER TABLE `rater` DISABLE KEYS */;
INSERT INTO `rater` VALUES (1,'1',NULL,NULL,NULL),(51,'2',NULL,NULL,NULL),(52,'3','4','1','10'),(53,'4',NULL,NULL,NULL),(54,'5',NULL,NULL,NULL),(55,'6',NULL,NULL,NULL),(56,'7',NULL,NULL,NULL),(57,'8',NULL,NULL,NULL),(58,'9',NULL,NULL,NULL),(59,'10','9','2','1,'),(60,'11','4','1','1'),(61,'12',NULL,NULL,NULL),(62,'13',NULL,NULL,NULL),(63,'14',NULL,NULL,NULL),(64,'15',NULL,NULL,NULL),(65,'16','5','1','1'),(66,'17','5','1','9'),(67,'18',NULL,NULL,NULL),(68,'19',NULL,NULL,NULL),(69,'20',NULL,NULL,NULL),(70,'21','5','1','9');
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
INSERT INTO `research_projects` VALUES (1,'asda'),(2,'tesco');
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
  `user_id` varchar(45) DEFAULT NULL,
  `images` text,
  `title` text,
  `description` text,
  `tags` text,
  `categories` text,
  `location` varchar(45) DEFAULT NULL,
  `research_project` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trends`
--

LOCK TABLES `trends` WRITE;
/*!40000 ALTER TABLE `trends` DISABLE KEYS */;
INSERT INTO `trends` VALUES (2,'1','dUsPH6oqJnGOi0nLiBCMFJXd3.jpg,d89Hk4WAkT2AWXBlVSwGSw8AI.jpg,mob3KRJWrzdtdEBky5n29vrSF.jpg,AfJraG4zPhgnOtNAm6ER1CTdI.jpg,ieu3dlsDFNZULqXv3apsSIv1R.jpg,qXXqyjOh06XjSnemAXtkj8N2D.jpg','This+is+a+test+trend','<p>Integer+posuere+erat+a+ante+venenatis+dapibus+posuere+velit+aliquet.+Etiam+porta+sem+malesuada+magna+mollis+euismod.+Aenean+lacinia+bibendum+nulla+sed+consectetur.+Etiam+porta+sem+malesuada+magna+mollis+euismod.%0A%0AInteger+posuere+erat+a+ante+venenatis+dapibus+posuere+velit+aliquet.+Cras+justo+odio%2C+dapibus+ac+facilisis+in%2C+egestas+eget+quam.+Vestibulum+id+ligula+porta+felis+euismod+semper.+Praesent+commodo+cursus+magna%2C+vel+scelerisque+nisl+consectetur+et.+Nullam+quis+risus+eget+urna+mollis+ornare+vel+eu+leo.+Donec+ullamcorper+nulla+non+metus+auctor+fringilla.+Donec+sed+odio+dui.%0A%0ACurabitur+blandit+tempus+porttitor.+Praesent+commodo+cursus+magna%2C+vel+scelerisque+nisl+consectetur+et.+Maecenas+sed+diam+eget+risus+varius+blandit+sit+amet+non+magna.+Nulla+vitae+elit+libero%2C+a+pharetra+augue.</p>','test%2520trend%2Cfor%2520sure%2Cyup%2Cdef','Automotive%2CCity%2CDigital%2CEntertainment%2CFood%2CHome%2CMobility%2CTechnology','Utrecht%2C+The+Netherlands','1'),(3,'1','pB7NaSuEAdgKJR9aW3GZQxJ0U.jpg,rSL4iLiKIiFHoLV17OElAr4SS.jpg,ehx2HcUuu6gfRBxMl4fwCjmB0.jpg,cxpK2k9qojrYP0GaRf2kQLwGw.jpg','Justo+Sollicitudin+Dolor+Adipiscing','<p>Fusce+dapibus%2C+tellus+ac+cursus+commodo%2C+tortor+mauris+condimentum+nibh%2C+ut+fermentum+massa+justo+sit+amet+risus.+Donec+id+elit+non+mi+porta+gravida+at+eget+metus.+Donec+sed+odio+dui.+Fusce+dapibus%2C+tellus+ac+cursus+commodo%2C+tortor+mauris+condimentum+nibh%2C+ut+fermentum+massa+justo+sit+amet+risus.+Praesent+commodo+cursus+magna%2C+vel+scelerisque+nisl+consectetur+et.+Maecenas+faucibus+mollis+interdum.+Cras+justo+odio%2C+dapibus+ac+facilisis+in%2C+egestas+eget+quam.%0A%0AAenean+lacinia+bibendum+nulla+sed+consectetur.+Morbi+leo+risus%2C+porta+ac+consectetur+ac%2C+vestibulum+at+eros.+Integer+posuere+erat+a+ante+venenatis+dapibus+posuere+velit+aliquet.+Curabitur+blandit+tempus+porttitor.+Morbi+leo+risus%2C+porta+ac+consectetur+ac%2C+vestibulum+at+eros.+Praesent+commodo+cursus+magna%2C+vel+scelerisque+nisl+consectetur+et.+Curabitur+blandit+tempus+porttitor.</p>','Tortor%2CPurus%2CAdipiscing%2CPuruso','Design%2CDigital%2CEducation%2CFashion%2CGadgets%2CHealth%2CHospitality%2CPolitics','Utrecht%2C+The+Netherlands','1'),(4,'1','RGFJREH4jqAmpHaqH4T35uzcy.jpg,cmsFOGUkiHnJfKJ16S6kjcMIO.jpg,Lywifix3LMCey6ebpfXFhD0fL.jpg,Vdl918lbyjo1t934Wa9TktUQw.jpg','Purus+Purus+Purus','<p>Donec+id+elit+non+mi+porta+gravida+at+eget+metus.+Cum+sociis+natoque+penatibus+et+magnis+dis+parturient+montes%2C+nascetur+ridiculus+mus.+Fusce+dapibus%2C+tellus+ac+cursus+commodo%2C+tortor+mauris+condimentum+nibh%2C+ut+fermentum+massa+justo+sit+amet+risus.+Integer+posuere+erat+a+ante+venenatis+dapibus+posuere+velit+aliquet.+Curabitur+blandit+tempus+porttitor.%0A%0APraesent+commodo+cursus+magna%2C+vel+scelerisque+nisl+consectetur+et.+Nullam+id+dolor+id+nibh+ultricies+vehicula+ut+id+elit.+Donec+ullamcorper+nulla+non+metus+auctor+fringilla.+Curabitur+blandit+tempus+porttitor.+Etiam+porta+sem+malesuada+magna+mollis+euismod.+Donec+sed+odio+dui.</p>','Nibh%2CVulputate%2CPorta','Advertising%2CArchitecture%2CArt%2CAutomotive%2CBeauty%2CCity%2CCosmetics%2CDesign%2CDigital%2CEducation%2CEntertainment%2CFashion%2CFinancial%2CFood%2CGadgets%2CGames%2CHealth%2CHome%2CHospitality%2CLuxury%2CMarketing%2CMedia%2CMobile%2CMobility%2CMusic%2CNews%2COther%2CPolitics%2CRetail%2CSex%2CSports%2CSustainability%2CTechnology%2CTravel%2CWellness','Siberia%2C+Russia',NULL),(5,'1','gGDLvlRn5ozT0buynctwfOWtV.jpg,TbTsY4TG5IPBKOSflwt2pcsF3.jpg,IzNTYvYAQs5Li34IPygWeQq8m.jpg,qsNmwcwmXO09oyZnT8jaQ8Kkt.jpg,Ber11Z6vSKBIub2ilmfisDbdj.jpg,T8vGnAqm4VmgmdMMDIgWxXqxu.jpg,Dz7obv1FFoWyyYRat0YdqW8dm.jpg,YIv5JX5EjfQzCRGuFKjwbh8Bd.jpg,wRqR4nHcUjkYKRqsjlcxeVDaP.jpg,8lHkKKD2hnui41K96sQqRHxzd.jpg,u3BklazAb1FBLYs9PM7RUdQbs.jpg,h4byW5seFyGE2ZN67LhEMhp5r.jpg,cfS5zsXPsztA4bcDm2VUQm3KH.jpg,On0njTIVamKE3VgOX3c5vycLL.jpg,sUF2AlS5sIFvtt0dnFqtocGku.jpg,LZ4f8QPZ096zprCRB00JFvT4E.jpg','Lorem+Ipsum+Dolor+Sit+Consectetur','<p>Nullam+id+dolor+id+nibh+ultricies+vehicula+ut+id+elit.+Donec+id+elit+non+mi+porta+gravida+at+eget+metus.+Aenean+eu+leo+quam.+Pellentesque+ornare+sem+lacinia+quam+venenatis+vestibulum.+Aenean+eu+leo+quam.+Pellentesque+ornare+sem+lacinia+quam+venenatis+vestibulum.+Duis+mollis%2C+est+non+commodo+luctus%2C+nisi+erat+porttitor+ligula%2C+eget+lacinia+odio+sem+nec+elit.%0A%0AAenean+lacinia+bibendum+nulla+sed+consectetur.+Vestibulum+id+ligula+porta+felis+euismod+semper.+Cras+justo+odio%2C+dapibus+ac+facilisis+in%2C+egestas+eget+quam.+Lorem+ipsum+dolor+sit+amet%2C+consectetur+adipiscing+elit.+Fusce+dapibus%2C+tellus+ac+cursus+commodo%2C+tortor+mauris+condimentum+nibh%2C+ut+fermentum+massa+justo+sit+amet+risus.+Aenean+eu+leo+quam.+Pellentesque+ornare+sem+lacinia+quam+venenatis+vestibulum.%0A%0ACurabitur+blandit+tempus+porttitor.+Aenean+lacinia+bibendum+nulla+sed+consectetur.+Lorem+ipsum+dolor+sit+amet%2C+consectetur+adipiscing+elit.+Nullam+id+dolor+id+nibh+ultricies+vehicula+ut+id+elit.+Aenean+lacinia+bibendum+nulla+sed+consectetur.+Etiam+porta+sem+malesuada+magna+mollis+euismod.%0A%0ALorem+ipsum+dolor+sit+amet%2C+consectetur+adipiscing+elit.+Sed+posuere+consectetur+est+at+lobortis.+Aenean+lacinia+bibendum+nulla+sed+consectetur.+Etiam+porta+sem+malesuada+magna+mollis+euismod.+Duis+mollis%2C+est+non+commodo+luctus%2C+nisi+erat+porttitor+ligula%2C+eget+lacinia+odio+sem+nec+elit.+Nullam+quis+risus+eget+urna+mollis+ornare+vel+eu+leo.</p>','Cras%2CAmet%2CElit%2CVenenatis','Advertising%2CArchitecture%2CFinancial%2CGadgets%2CHealth%2CMobility%2CPolitics%2CSex%2CTravel','Georgia%2C+United+States',NULL),(10,'1','24DJIjD8ilDo69IXPz2LWb9vl.jpg,59GRcr8Yndpnw6EfFzkZjbIcW.jpg,cRWjAywzdoHb3jwhlETbESDzR.jpg','Lorem+ipsum+dolor+sit+amet%2C+consectetur+adipiscing+elit','<p>Donec+sed+odio+dui.+Cras+justo+odio%2C+dapibus+ac+facilisis+in%2C+egestas+eget+quam.+Aenean+lacinia+bibendum+nulla+sed+consectetur.+Cras+mattis+consectetur+purus+sit+amet+fermentum.+Aenean+lacinia+bibendum+nulla+sed+consectetur.+Duis+mollis%2C+est+non+commodo+luctus%2C+nisi+erat+porttitor+ligula%2C+eget+lacinia+odio+sem+nec+elit.+Donec+id+elit+non+mi+porta+gravida+at+eget+metus.%0A%0AVestibulum+id+ligula+porta+felis+euismod+semper.+Aenean+lacinia+bibendum+nulla+sed+consectetur.+Lorem+ipsum+dolor+sit+amet%2C+consectetur+adipiscing+elit.+Maecenas+sed+diam+eget+risus+varius+blandit+sit+amet+non+magna.+Nulla+vitae+elit+libero%2C+a+pharetra+augue.</p>','Tellus%2CVenenatis%2CIpsum%2CUltricies','Art%2CDigital%2CHome%2CHospitality%2CMusic%2CPolitics','Utrecht%2C+The+Netherlands',NULL),(12,'1','KkDkEKsh6qKphkjibPOLY6bTS.jpg,6KWDc0jaLCV4wtTbEmFNYrHDx.jpg','Malesuada+Dapibus+Venenatis+Mollis','<p>Duis+mollis%2C+est+non+commodo+luctus%2C+nisi+erat+porttitor+ligula%2C+eget+lacinia+odio+sem+nec+elit.+Nullam+id+dolor+id+nibh+ultricies+vehicula+ut+id+elit.+Praesent+commodo+cursus+magna%2C+vel+scelerisque+nisl+consectetur+et.+Fusce+dapibus%2C+tellus+ac+cursus+commodo%2C+tortor+mauris+condimentum+nibh%2C+ut+fermentum+massa+justo+sit+amet+risus.%0A%0AEtiam+porta+sem+malesuada+magna+mollis+euismod.+Praesent+commodo+cursus+magna%2C+vel+scelerisque+nisl+consectetur+et.+Nullam+quis+risus+eget+urna+mollis+ornare+vel+eu+leo.+Donec+id+elit+non+mi+porta+gravida+at+eget+metus.%0A%0ADonec+sed+odio+dui.+Nullam+quis+risus+eget+urna+mollis+ornare+vel+eu+leo.+Lorem+ipsum+dolor+sit+amet%2C+consectetur+adipiscing+elit.+Aenean+lacinia+bibendum+nulla+sed+consectetur.+Lorem+ipsum+dolor+sit+amet%2C+consectetur+adipiscing+elit.%0A%0AVestibulum+id+ligula+porta+felis+euismod+semper.+Integer+posuere+erat+a+ante+venenatis+dapibus+posuere+velit+aliquet.+Donec+sed+odio+dui.+Integer+posuere+erat+a+ante+venenatis+dapibus+posuere+velit+aliquet.+Vivamus+sagittis+lacus+vel+augue+laoreet+rutrum+faucibus+dolor+auctor.+Aenean+eu+leo+quam.+Pellentesque+ornare+sem+lacinia+quam+venenatis+vestibulum.</p>','Id%2Cligula%2Cporta%2Cfelis','Design%2CEducation%2CFashion%2CGadgets%2CHome%2CHospitality%2CMobile%2CMobility','Utrecht%2C+The+Netherlands',NULL),(13,'1','3vIQO09wBrFRf24nEYQIBwFov.jpg,7htL4yLEHdlRdn9xyPiJBI4Qx.jpg','Sem+Consectetur+Egestas+Tortor','<p>Cras+mattis+consectetur+purus+sit+amet+fermentum.+Lorem+ipsum+dolor+sit+amet%2C+consectetur+adipiscing+elit.+Praesent+commodo+cursus+magna%2C+vel+scelerisque+nisl+consectetur+et.+Etiam+porta+sem+malesuada+magna+mollis+euismod.</p>','Cras%2Cmattis','Architecture%2CAutomotive','Utrecht%2C+Netherlands',NULL),(14,'1','XEIbTHw5qtQmaFVD9302hGIvw.jpg,KsQVtj6TMLpSETpNLlWRkgM7m.jpg,aYkljsgCjoQIVmkNKvlXKJR3m.jpg,CahVjIzaRgUqyLvOIBIzyT4jb.jpg','asda','<p>asda</p>','asda','Advertising','asda',NULL),(15,'1','5xsbkoCr95KOX47QlVC19FtId.jpg,gD26vUZVAIfnNnM6KuAcFxcY3.jpg,4enw4HUUB6BUGP3THk7mCVIA4.jpg','Magna+Vulputate+Nullam+Tristique+Ornare','<p>Donec+id+elit+non+mi+porta+gravida+at+eget+metus.+Nullam+id+dolor+id+nibh+ultricies+vehicula+ut+id+elit.+Cras+justo+odio%2C+dapibus+ac+facilisis+in%2C+egestas+eget+quam.+Donec+sed+odio+dui.%0A%0ACum+sociis+natoque+penatibus+et+magnis+dis+parturient+montes%2C+nascetur+ridiculus+mus.+Vestibulum+id+ligula+porta+felis+euismod+semper.+Nulla+vitae+elit+libero%2C+a+pharetra+augue.+Nullam+id+dolor+id+nibh+ultricies+vehicula+ut+id+elit.</p>','Magna%2CVulputate%2CNullam','Art%2CCosmetics%2CEntertainment%2CFinancial%2CFood%2CHome%2CMobility%2CSex%2CTravel','Utrecht%2C+The+Netherlands',NULL),(16,'1','9V3TZ3prBqjmPRngmC3MaR9DV.jpg,dlKpQ0F7GPvmDkmz8nxL3B5fp.jpg,RkxTdNfpeLMitSDLPQ2DkyZ6k.jpg,CYQqHego60StFXDu6CUCxB1D2.jpg','Cum+sociis+natoque+penatibus+et+magnis+dis+parturient+montes%2C+nascetur+ridiculus+mus.','<p>asdfasfs</p>','asfsd%2C%255Dsad%2Cfs%2Cdf%2Cdssd%2Csdf','Art%2CAutomotive%2CEducation%2CLuxury','Utrecht%2C+The+n',NULL),(17,'9','rWaBifq1LsteXYrfi5NdH04Tw.jpg,8Snl92nPFw8TD4FnvSgp5afI2.jpg,DGNVMT6ss9YPgYCdL2XvGHt97.jpg,ZKjPoetyOzlnbqeKTfD9rysgj.jpg,DKqpmFSUwOlAxdvVmbMw7OxE6.jpg,02KNyiYjFxhze6MUBIjTXhaSg.jpg,9Ed3Kz8Yo5oRllbglCkySWAI8.jpg,cDxWTFbunaMXBQrmntBqLBIHI.jpg,xtQ7lxrTCkUimTWEC7TPOy9mz.jpg,TRpObhXk2IHBxrR2grZ11agkF.jpg','Ornare+Commodo+Fermentum+Adipiscing','<p>Etiam+porta+sem+malesuada+magna+mollis+euismod.+Cras+mattis+consectetur+purus+sit+amet+fermentum.+Fusce+dapibus%2C+tellus+ac+cursus+commodo%2C+tortor+mauris+condimentum+nibh%2C+ut+fermentum+massa+justo+sit+amet+risus.+Etiam+porta+sem+malesuada+magna+mollis+euismod.+Nullam+id+dolor+id+nibh+ultricies+vehicula+ut+id+elit.%0A%0ALorem+ipsum+dolor+sit+amet%2C+consectetur+adipiscing+elit.+Donec+id+elit+non+mi+porta+gravida+at+eget+metus.+Morbi+leo+risus%2C+porta+ac+consectetur+ac%2C+vestibulum+at+eros.+Vivamus+sagittis+lacus+vel+augue+laoreet+rutrum+faucibus+dolor+auctor.+Nullam+id+dolor+id+nibh+ultricies+vehicula+ut+id+elit.+Duis+mollis%2C+est+non+commodo+luctus%2C+nisi+erat+porttitor+ligula%2C+eget+lacinia+odio+sem+nec+elit.+Morbi+leo+risus%2C+porta+ac+consectetur+ac%2C+vestibulum+at+eros.%0A%0AVestibulum+id+ligula+porta+felis+euismod+semper.+Nullam+id+dolor+id+nibh+ultricies+vehicula+ut+id+elit.+Curabitur+blandit+tempus+porttitor.+Maecenas+sed+diam+eget+risus+varius+blandit+sit+amet+non+magna.+Integer+posuere+erat+a+ante+venenatis+dapibus+posuere+velit+aliquet.+Vestibulum+id+ligula+porta+felis+euismod+semper.</p>','asda%2Ctesco%2Clidl','Art%2CEducation%2CFashion%2CFinancial%2CFood','Utrecht%2C+The+Netherlands',NULL),(18,'10','Ap11ZwsZNPFXcesN7yJk5vBgp.jpg,BE9twdN17zMHp2Z5p7sLNJ869.jpg,YevvDfDBAQbW7Hb0wNgqlo0Un.jpg,4vcNx6DyI0CZoaiV4iZZmQkFh.jpg,66ND8mXHysVO3035ZIEKv2Iza.jpg,gZ5sDcfSDalP67JaZ7qjFx6BV.jpg','cool','<p>kort</p>','check%2Ccool%2Cproberen','Advertising%2CEntertainment','utrecht',NULL),(19,'1','jUCjnoxiy1op842iJHCQ1rqP1.jpg,ruep9cA5Pgo8tSHCacOQe6J2c.jpg,bGGcHcJOM9CzI0Rn7DTWb800K.jpg','cool+2','<p>check</p>','fiets%2Cmet%2520spatie%2520is%2520bewust%2Cfsdf%2Csdf%2Csdfdasf%2Csdfsdf%2Casdf%2Csad%2Cfsda%2Cfsa%2Cdf%2Csda%2Cfs%2Csd%2Csfd%2Cdfs%2Csdffdsdf%2Cs','Architecture%2CArt%2CPolitics','utrecht',NULL),(20,'1','8QLhsLXe8g6TfwsVNfy5zU0b1.jpg','dfdsf','<p>fssfs</p>','fiets%2Cmet%2520spatie%2520is%2520bewust%2Cfsdf%2Csdf%2Csdfdasf%2Csdfsdf%2Casdf%2Csad%2Cfsda%2Cfsa%2Cdf%2Csda%2Cfs%2Csd%2Csfd%2Cdfs%2Csdffdsdf%2Cs','Architecture%2COther','fs',NULL),(21,'9','mpTEbECD9CYX5tjz1wUHb9sWY.jpg,8lSlY6IyPtklUPe9UIFtbjGCS.jpg','test','<p>dbajl%3Bfja%3Bjd%3Bfj%3Bladfjf%3Bldjjad%3Bj</p>','trend','Art%2CFinancial','utrecht%2C+the+netherlands',NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=latin1;
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

-- Dump completed on 2013-08-08 17:15:35
