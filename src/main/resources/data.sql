INSERT INTO contentschema.nuggets (type, description) values('noun', '車 (car)'),
('adjective', '速い (fast)'),
('adjective', '頭がいい (bright, smart, clever)' );

INSERT INTO contentschema.facts (type, data, description, nuggetid)
values('english_translation', 'bright', 'Bright', 3),
('english_translation', 'smart', 'Smart', 3),
--('english_translation', 'clever', 'Clever', 'cleverWord'),
('reading', 'あたまがいい', 'kunyomi', 3),
('kanji', '頭', 'kanji', 3),
('writing', '頭がいい', 'preferred writing', 3);