ALTER TABLE `documents_page` ADD COLUMN `personas` varchar(255) NULL DEFAULT NULL;

/*--NEXT--*/

CREATE TABLE `deployment_packages` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(50) NOT NULL,
  `subType` VARCHAR(50) NOT NULL,
  `creationDate` BIGINT(20) NOT NULL,
  `version` BIGINT(20) NOT NULL,
  PRIMARY KEY (`id`)
) DEFAULT CHARSET=utf8;

/*--NEXT--*/

CREATE TABLE `deployment_target` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `parentId` BIGINT(20) UNSIGNED NOT NULL DEFAULT '0',
  `name` VARCHAR(255) NOT NULL,
  `creationDate` BIGINT(20) UNSIGNED NOT NULL,
  `status` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`)
) DEFAULT CHARSET=utf8;

/*--NEXT--*/

