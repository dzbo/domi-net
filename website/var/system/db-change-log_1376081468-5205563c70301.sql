DROP TABLE IF EXISTS `cache`;

/*--NEXT--*/

CREATE TABLE `cache` (
  `id` varchar(165) NOT NULL DEFAULT '',
  `data` longtext,
  `mtime` bigint(20) DEFAULT NULL,
  `expire` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) DEFAULT CHARSET=utf8;

/*--NEXT--*/

