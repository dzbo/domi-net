ALTER TABLE translations_website CHANGE `date` `creationDate` BIGINT(20) UNSIGNED NULL DEFAULT NULL


ALTER TABLE translations_website ADD `modificationDate` BIGINT(20) UNSIGNED NULL DEFAULT NULL


ALTER TABLE translations_admin CHANGE `date` `creationDate` BIGINT(20) UNSIGNED NULL DEFAULT NULL


ALTER TABLE translations_admin ADD `modificationDate` BIGINT(20) UNSIGNED NULL DEFAULT NULL


