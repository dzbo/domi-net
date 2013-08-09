RENAME TABLE `targeting` TO `targeting_rules`;

/*--NEXT--*/

DROP TABLE IF EXISTS `targeting_personas`;

/*--NEXT--*/

CREATE TABLE `targeting_personas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL DEFAULT '',
  `description` text,
  `conditions` longtext,
  PRIMARY KEY (`id`)
) DEFAULT CHARSET=utf8;

/*--NEXT--*/

