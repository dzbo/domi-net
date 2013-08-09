CREATE TABLE IF NOT EXISTS `uuids` (
  `uuid` CHAR(36) NOT NULL,
  `itemId` BIGINT(20) UNSIGNED NOT NULL,
  `type` VARCHAR(25) NOT NULL,
  `subType` VARCHAR(20) NULL DEFAULT NULL,
  `instanceIdentifier` VARCHAR(50) NOT NULL,
  UNIQUE INDEX `itemId_type_uuid` (`itemId`, `type`, `uuid`)
) DEFAULT CHARSET=utf8;

/*--NEXT--*/

