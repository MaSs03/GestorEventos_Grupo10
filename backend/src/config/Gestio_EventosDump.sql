-- Active: 1762316675815@@127.0.0.1@3306@gestion_eventos
-- MySQL dump 10.13  Distrib 9.6.0, for Win64 (x86_64)
--
-- Host: localhost    Database: gestion_eventos
-- ------------------------------------------------------
-- Server version	9.6.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ 'b6eb920e-055d-11f1-8df2-0a002700000f:1-46';

--
-- Table structure for table `evento_recursos`
--

DROP TABLE IF EXISTS `evento_recursos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `evento_recursos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `evento_id` int NOT NULL,
  `recurso_id` int NOT NULL,
  `cantidad` int NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_evento_recurso` (`evento_id`,`recurso_id`),
  KEY `fk_er_recurso` (`recurso_id`),
  CONSTRAINT `fk_er_evento` FOREIGN KEY (`evento_id`) REFERENCES `eventos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_er_recurso` FOREIGN KEY (`recurso_id`) REFERENCES `recursos` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evento_recursos`
--

LOCK TABLES `evento_recursos` WRITE;
/*!40000 ALTER TABLE `evento_recursos` DISABLE KEYS */;
INSERT INTO `evento_recursos` VALUES (1,1,12,1,'2026-02-09 08:29:41'),(2,1,6,1,'2026-02-10 03:50:10'),(3,1,1,1,'2026-02-10 03:50:17'),(5,1,2,1,'2026-02-10 03:50:46');
/*!40000 ALTER TABLE `evento_recursos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `eventos`
--

DROP TABLE IF EXISTS `eventos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `eventos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(160) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `ubicacion` varchar(160) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_inicio` datetime NOT NULL,
  `fecha_fin` datetime NOT NULL,
  `cupo` int NOT NULL DEFAULT '0',
  `estado` enum('ACTIVO','CANCELADO') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVO',
  `created_by` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_eventos_created_by` (`created_by`),
  KEY `idx_eventos_fechas` (`fecha_inicio`,`fecha_fin`),
  KEY `idx_eventos_estado` (`estado`),
  CONSTRAINT `fk_eventos_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `eventos`
--

LOCK TABLES `eventos` WRITE;
/*!40000 ALTER TABLE `eventos` DISABLE KEYS */;
INSERT INTO `eventos` VALUES (1,'Conferencia TI','Evento académico','Auditorio','2026-02-20 10:00:00','2026-02-20 12:00:00',50,'ACTIVO',1,'2026-02-09 05:08:57');
/*!40000 ALTER TABLE `eventos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inscripciones`
--

DROP TABLE IF EXISTS `inscripciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inscripciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `evento_id` int NOT NULL,
  `estado` enum('ACTIVA','CANCELADA') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVA',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_evento` (`user_id`,`evento_id`),
  KEY `idx_insc_evento` (`evento_id`),
  KEY `idx_insc_user` (`user_id`),
  CONSTRAINT `fk_insc_evento` FOREIGN KEY (`evento_id`) REFERENCES `eventos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_insc_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inscripciones`
--

LOCK TABLES `inscripciones` WRITE;
/*!40000 ALTER TABLE `inscripciones` DISABLE KEYS */;
INSERT INTO `inscripciones` VALUES (1,5,1,'ACTIVA','2026-02-09 05:15:05'),(2,6,1,'ACTIVA','2026-02-09 07:41:27'),(3,7,1,'ACTIVA','2026-02-09 21:23:41'),(4,8,1,'ACTIVA','2026-02-10 03:42:30');
/*!40000 ALTER TABLE `inscripciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recursos`
--

DROP TABLE IF EXISTS `recursos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recursos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado` enum('DISPONIBLE','NO_DISPONIBLE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DISPONIBLE',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recursos`
--

LOCK TABLES `recursos` WRITE;
/*!40000 ALTER TABLE `recursos` DISABLE KEYS */;
INSERT INTO `recursos` VALUES (1,'Proyector Epson X200','Multimedia',NULL,'DISPONIBLE','2026-02-09 08:24:24'),(2,'Pantalla de proyección','Multimedia',NULL,'DISPONIBLE','2026-02-09 08:27:46'),(3,'Sistema de sonido básico','Multimedia',NULL,'DISPONIBLE','2026-02-09 08:27:55'),(4,'Micrófono inalámbrico','Multimedia',NULL,'DISPONIBLE','2026-02-09 08:28:03'),(5,'Consola de audio','Multimedia',NULL,'DISPONIBLE','2026-02-09 08:28:12'),(6,'Laptop de presentación','Multimedia',NULL,'DISPONIBLE','2026-02-09 08:28:25'),(7,'Salón A','Infraestructura',NULL,'DISPONIBLE','2026-02-09 08:28:38'),(8,'Salón B','Infraestructura',NULL,'DISPONIBLE','2026-02-09 08:28:47'),(9,'Auditorio principal','Infraestructura',NULL,'DISPONIBLE','2026-02-09 08:28:57'),(10,'Aula 101','Infraestructura',NULL,'DISPONIBLE','2026-02-09 08:29:07'),(11,'Mesa plegable','Infraestructura',NULL,'DISPONIBLE','2026-02-09 08:29:15'),(12,'Sillas adicionales','Infraestructura',NULL,'DISPONIBLE','2026-02-09 08:29:31');
/*!40000 ALTER TABLE `recursos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(160) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rol` enum('ADMIN','CLIENTE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CLIENTE',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Administrador','admin@eventos.com','$2b$10$NRYCrzGYew1zwiwKb6N3Yezt8DfkrNyPEXtBSxlgeKE1B1jytITI.','ADMIN','2026-02-09 04:48:04'),(2,'Juan Perez','juan@test.com','$2b$10$nwGgNiz6HD22wz5VKIEoYuxE5tub7niYMCc1wFpbrKkQZxt7Wn7eu','CLIENTE','2026-02-09 04:52:31'),(3,'Admin','daniel@gmail.com','$2b$10$bnOvkRLfHTXa7nZjUwLjmu.FBygSYmwf9zXcdTw0cN7Txb4cKZA8.','ADMIN','2026-02-09 05:01:45'),(4,'Admin','daniel@test.com','$2b$10$/NMfO1mohdgZMTRxRZZi8Oak8MfiQ1Vb68fKe6gwuDaCbMlmKandW','ADMIN','2026-02-09 05:02:06'),(5,'Cliente 1','cliente1@eventos.com','$2b$10$TPKXuL.vj3TILqKUgXtNI.U3pRFyO4GyLitMUFTJgkgfny2XG1yHu','CLIENTE','2026-02-09 05:11:24'),(6,'jonathan','jona@gmail.com','$2b$10$4/jMoADZOCyG73VK.KeybO/Go0KkH7vtU.k5ugFujtmEsdhtDmJle','CLIENTE','2026-02-09 07:41:12'),(7,'Angela Cheryl','cherry@gmail.com','$2b$10$lP07NUxZo/DRlUZDan53BO0UGCZ9X/3cP701FRTIFjTT1h/nZnMxa','CLIENTE','2026-02-09 21:23:27'),(8,'Victor Hulse','hulstor@gmail.com','$2b$10$KiArQrLL2eb5Vtj8vTtYj.pRC/T9L515/dX3jm7qa1pPdLR/.sKF6','CLIENTE','2026-02-10 03:42:17');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES 'users';
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-09 21:59:07
