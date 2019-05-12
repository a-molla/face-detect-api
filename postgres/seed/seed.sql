BEGIN TRANSACTION;
INSERT INTO users (name, email, entries, joined) values ('am','am@am.com',5,'2018-01-01');
INSERT INTO login (hash,email) values ('$2a$10$cCCIOrRmECKmnNZsc8xfXOmxSdaUnBwden5PlTB.jknldK13H6emm','am@am.com');

COMMIT;