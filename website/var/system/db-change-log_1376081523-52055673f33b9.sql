DROP TABLE IF EXISTS `session`;

/*--NEXT--*/

CREATE TABLE `session` (
  `id` char(32) NOT NULL DEFAULT '',
  `modified` int(11) DEFAULT NULL,
  `lifetime` int(11) DEFAULT NULL,
  `data` text,
  PRIMARY KEY (`id`)
) DEFAULT CHARSET=utf8;

/*--NEXT--*/

