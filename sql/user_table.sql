CREATE DATABASE IF NOT EXISTS ehealth;

USE ehealth;

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `serialnumber` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(200) NOT NULL,
  `name` varchar(50) NOT NULL,
  `surname` varchar(50) NOT NULL,
  `phone` varchar(100) NOT NULL,
  `address` varchar(50) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`serialNumber`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;