-- --------------------------------------------------------
-- Хост:                         127.0.0.1
-- Версия сервера:               10.1.22-MariaDB - mariadb.org binary distribution
-- Операционная система:         Win64
-- HeidiSQL Версия:              9.4.0.5125
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Дамп структуры базы данных manuscript
CREATE DATABASE IF NOT EXISTS `manuscript` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `manuscript`;

-- Дамп структуры для таблица manuscript.page
CREATE TABLE IF NOT EXISTS `page` (
  `page_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `note` text,
  `filename` varchar(255) NOT NULL,
  `order_key` int(11) unsigned NOT NULL,
  `enabled` int(1) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`page_id`),
  UNIQUE KEY `order_key` (`order_key`),
  KEY `toc_id_order_key_enabled` (`toc_id`,`order_key`,`enabled`)
) ENGINE=InnoDB AUTO_INCREMENT=174 DEFAULT CHARSET=utf8;

-- Дамп данных таблицы manuscript.page: ~139 rows (приблизительно)
/*!40000 ALTER TABLE `page` DISABLE KEYS */;
INSERT INTO `page` (`page_id`, `toc_id`, `title`, `note`, `filename`, `order_key`, `enabled`) VALUES
	(1, 3, 'йцу sd fsdf ', 'note note 1', 'p_0054.jpg', 2, 1),
	(2, 3, '«Узел истории»', 'Не забыть расшифровать левый верхний угол 1.', 'p_0055.jpg', 1, 1),
	(3, 3, '', '', 'p_0056.jpg', 5, 1),
	(4, 3, '333 1 2', '333\n\nsss <b>', 'p_0057.jpg', 3, 1),
	(5, 3, '', '', 'p_0058.jpg', 6, 1),
	(6, 3, '', '', 'p_0059.jpg', 4, 1),
	(7, 3, '', '', 'p_0060.jpg', 7, 1),
	(42, 6, 'О цели_0001 ОбложкаПередняя', NULL, 'ce8787bffffeff00.jpg', 42, 1),
	(43, 6, 'О цели_0002_ОборотОбложки', NULL, '00fefefefefefe00.jpg', 43, 1),
	(44, 6, 'О цели_0003-ВклеенноеФото.Оборот Пуст.Расположение-Реконструкт', NULL, '80e0e0e0e0a0a060.jpg', 44, 1),
	(45, 6, 'О цели_0005', NULL, '00ff6f6f6f6f777f.jpg', 45, 1),
	(46, 6, 'О цели_0006', NULL, '00fee2fffffefefe.jpg', 46, 1),
	(47, 6, 'О цели_0007', NULL, '0060637f7e7fff00.jpg', 47, 1),
	(48, 6, 'О цели_0008', NULL, '00870787efafffff.jpg', 48, 1),
	(49, 6, 'О цели_0009', NULL, '9f87c18f9fffff00.jpg', 49, 1),
	(50, 6, 'О цели_0010', NULL, '00fff3ffff038fff.jpg', 50, 1),
	(51, 6, 'О цели_0011', NULL, '0081fffffffaff00.jpg', 51, 1),
	(52, 6, 'О цели_0012', NULL, '00ffffffffffffff.jpg', 52, 1),
	(53, 6, 'О цели_0013', NULL, '00ffd8d89a9efe1e.jpg', 53, 1),
	(54, 6, 'О цели_0014', NULL, '00ff96debe9e9e9e.jpg', 54, 1),
	(55, 6, 'О цели_0014верх фрагмент', NULL, '3f3f3f3f3f3f3f3e.jpg', 55, 1),
	(56, 6, 'О цели_0014текст на обороте изображения', NULL, '0e0f0e0600000000.jpg', 56, 1),
	(57, 6, 'О цели_0014текст под изображеением', NULL, 'ff7f7f0000000000.jpg', 57, 1),
	(58, 6, 'О цели_0015', NULL, 'ff0585858581f700.jpg', 58, 1),
	(59, 6, 'О цели_0015верх фрагмент', NULL, '3f3f3f3f3f3f3f3f.jpg', 59, 1),
	(60, 6, 'О цели_0016', NULL, '00d886ffef87e71e.jpg', 60, 1),
	(61, 6, 'О цели_0017', NULL, '00ff8191b19191ff.jpg', 61, 1),
	(62, 6, 'О цели_0017верх фрагмент', NULL, '3f3f3f3f3f3f3f3f.jpg', 62, 1),
	(63, 6, 'О цели_0018', NULL, '00ff83c3efb7cfbf.jpg', 63, 1),
	(64, 6, 'О цели_0019', NULL, '00ffdfffffffff00.jpg', 64, 1),
	(65, 6, 'О цели_0020', NULL, '00fffffffefe87c2.jpg', 65, 1),
	(66, 6, 'О цели_0021', NULL, '007e7e7e7e767f7e.jpg', 66, 1),
	(67, 6, 'О цели_0022', NULL, '00ead8fafefefafe.jpg', 67, 1),
	(68, 6, 'О цели_0023', NULL, '0000f0f0f0f0f0e0.jpg', 68, 1),
	(69, 6, 'О цели_0023расположениеСтраницы-Реконструкт', NULL, 'e0ff1717777fff00.jpg', 69, 1),
	(70, 6, 'О цели_0024', NULL, '00e0f0f0f0f0f000.jpg', 70, 1),
	(71, 6, 'О цели_0024фрагмент_скрытаяЧастьВерхнейПоловины', NULL, '8000e0f0f0c00000.jpg', 71, 1),
	(72, 6, 'О цели_0024фрагмент_скрытаяЧастьНижнейПоловины', NULL, '00000000000f0f0f.jpg', 72, 1),
	(73, 6, 'О цели_0025', NULL, 'e0fffffff7feff00.jpg', 73, 1),
	(74, 6, 'О цели_0026', NULL, '00ff1f7f7e7f7f70.jpg', 74, 1),
	(75, 6, 'О цели_0027', NULL, '7e7e7e7e7e7e0000.jpg', 75, 1),
	(76, 6, 'О цели_0027расположениеСтраницы-Реконструкт', NULL, '00ff7fef0f07ff00.jpg', 76, 1),
	(77, 6, 'О цели_0028', NULL, '7e7e7e7e7e7e0000.jpg', 77, 1),
	(78, 6, 'О цели_0029', NULL, '00ffffe7ffffff00.jpg', 78, 1),
	(79, 6, 'О цели_0030', NULL, '00fffe7fffffff7f.jpg', 79, 1),
	(80, 6, 'О цели_0031', NULL, '00e7e6efffe6e700.jpg', 80, 1),
	(81, 6, 'О цели_0032', NULL, '00fffebe9ffef684.jpg', 81, 1),
	(82, 6, 'О цели_0033', NULL, '00e7e7e7e7e7ff02.jpg', 82, 1),
	(83, 6, 'О цели_0034', NULL, '0081818dffff9fc0.jpg', 83, 1),
	(84, 6, 'О цели_0035', NULL, '00ff77f7e7f7f770.jpg', 84, 1),
	(85, 6, 'О цели_0036', NULL, '02bf81ff83dbe87c.jpg', 85, 1),
	(86, 6, 'О цели_0037', NULL, '00eee6fefeeefeee.jpg', 86, 1),
	(87, 6, 'О цели_0038', NULL, '02fbc0cfcfe87cfe.jpg', 87, 1),
	(88, 6, 'О цели_0039', NULL, '00ff185b5f1bff00.jpg', 88, 1),
	(89, 6, 'О цели_0040', NULL, '021f80c0cfdff370.jpg', 89, 1),
	(90, 6, 'О цели_0041', NULL, '00ff18db9b9bff00.jpg', 90, 1),
	(91, 6, 'О цели_0042', NULL, '00bf8082868efefe.jpg', 91, 1),
	(92, 6, 'О цели_0043', NULL, '7f7f5bdbff7fff00.jpg', 92, 1),
	(93, 6, 'О цели_0044', NULL, '009f010101ffff7f.jpg', 93, 1),
	(94, 6, 'О цели_0045', NULL, '7eff7efedfdfff00.jpg', 94, 1),
	(95, 6, 'О цели_0046', NULL, '00fffa8682deffff.jpg', 95, 1),
	(96, 6, 'О цели_0047', NULL, '08fb195b0f0fff00.jpg', 96, 1),
	(97, 6, 'О цели_0048', NULL, '00ffb2fbf3fefafa.jpg', 97, 1),
	(98, 6, 'О цели_0049 со вклеен.фото', NULL, 'ff9f9f9f9f9fff00.jpg', 98, 1),
	(99, 6, 'О цели_0050', NULL, '00ffe2ce8eeefefe.jpg', 99, 1),
	(100, 6, 'О цели_0051', NULL, '00ff59591b1fff1b.jpg', 100, 1),
	(101, 6, 'О цели_0052', NULL, '008fc3e1ffffebcf.jpg', 101, 1),
	(102, 6, 'О цели_0053', NULL, '007f5e5f5f1fff00.jpg', 102, 1),
	(103, 6, 'О цели_0054', NULL, '00c7287ef2f23ffe.jpg', 103, 1),
	(104, 6, 'О цели_0055', NULL, '00e767f77f67ff1f.jpg', 104, 1),
	(105, 6, 'О цели_0056', NULL, '009ffe18dabefe7e.jpg', 105, 1),
	(106, 6, 'О цели_0057', NULL, '00ff595f0367ff00.jpg', 106, 1),
	(107, 6, 'О цели_0058', NULL, '003f32fa06eefe00.jpg', 107, 1),
	(108, 6, 'О цели_0059', NULL, '00ff1a1bff58fb00.jpg', 108, 1),
	(109, 6, 'О цели_0060', NULL, '009ebebeceee9e9e.jpg', 109, 1),
	(110, 6, 'О цели_0061', NULL, '007f777f5f1ffb00.jpg', 110, 1),
	(111, 6, 'О цели_0062', NULL, '08e7e7e7c3c7ffff.jpg', 111, 1),
	(112, 6, 'О цели_0063', NULL, 'ff7f7f5f5f0fff00.jpg', 112, 1),
	(113, 6, 'О цели_0064', NULL, '00fffe2a0686fe00.jpg', 113, 1),
	(114, 6, 'О цели_0065', NULL, '0105077fffc5ff00.jpg', 114, 1),
	(115, 6, 'О цели_0066 со влеен.вырезкой', NULL, 'fe8f8f8f0f0f8ffe.jpg', 115, 1),
	(116, 6, 'О цели_0067-оборотнаяСторонаПуста', NULL, '005f41797959ff00.jpg', 116, 1),
	(117, 6, 'О цели_0069', NULL, '7f7f07477f7fff00.jpg', 117, 1),
	(118, 6, 'О цели_0070', NULL, '00effedafff3f302.jpg', 118, 1),
	(119, 6, 'О цели_0071', NULL, '00f773dfd989cd7f.jpg', 119, 1),
	(120, 6, 'О цели_0072', NULL, '00bf809fbff2f0fe.jpg', 120, 1),
	(121, 6, 'О цели_0073', NULL, '00e767e77f7fff00.jpg', 121, 1),
	(122, 6, 'О цели_0074', NULL, '00fffe80fefefefe.jpg', 122, 1),
	(123, 6, 'О цели_0075', NULL, '00f77767f77fff00.jpg', 123, 1),
	(124, 6, 'О цели_0076 Коммент-ВерхИменноТакой,со следом другой страницы', NULL, '00bf9ef2fefefe02.jpg', 124, 1),
	(125, 6, 'О цели_0077', NULL, '404159ffcfc3ff00.jpg', 125, 1),
	(126, 6, 'О цели_0078', NULL, '007f7f7f7f7f7f00.jpg', 126, 1),
	(127, 6, 'О цели_0079', NULL, '00f7ffffff67c703.jpg', 127, 1),
	(128, 6, 'О цели_0080', NULL, '02fe382e8a9ef248.jpg', 128, 1),
	(129, 6, 'О цели_0081', NULL, '3fff5afe7e58ff00.jpg', 129, 1),
	(130, 6, 'О цели_0082', NULL, '00e7dbfa3ef2ff00.jpg', 130, 1),
	(131, 6, 'О цели_0083', NULL, '005f7d7d7f18cf00.jpg', 131, 1),
	(132, 6, 'О цели_0084', NULL, '00ffffffe730f002.jpg', 132, 1),
	(133, 6, 'О цели_0085', NULL, '405f7f5f7a7bdf00.jpg', 133, 1),
	(134, 6, 'О цели_0086', NULL, '00bbe0e8f8fefe00.jpg', 134, 1),
	(135, 6, 'О цели_0087', NULL, '00ff58faf8d9ff00.jpg', 135, 1),
	(136, 6, 'О цели_0088', NULL, '00bffff9f9f9f978.jpg', 136, 1),
	(137, 6, 'О цели_0089', NULL, '00ff5a1e7f1fff00.jpg', 137, 1),
	(138, 6, 'О цели_0090', NULL, '009ffe86beecff00.jpg', 138, 1),
	(139, 6, 'О цели_0091 -оборотнаяСторонаПуста', NULL, '00ff7ff7ffffff3f.jpg', 139, 1),
	(140, 6, 'О цели_0093', NULL, '00ff5b77705bff7f.jpg', 140, 1),
	(141, 6, 'О цели_0094', NULL, '00ff7f7f7f7f7f7f.jpg', 141, 1),
	(142, 6, 'О цели_0094фрагментСоотнесенияСоСледСтр', NULL, 'e0fafafefaf2f200.jpg', 142, 1),
	(143, 6, 'О цели_0095', NULL, '405f5b795f5f1f00.jpg', 143, 1),
	(144, 6, 'О цели_0096', NULL, '00fff8fefef0fe02.jpg', 144, 1),
	(145, 6, 'О цели_0096фрагментСоотнесенияСоСледСтр', NULL, 'eee3c3f3f3a3ff00.jpg', 145, 1),
	(146, 6, 'О цели_0097', NULL, '705f1b591b5fff03.jpg', 146, 1),
	(147, 6, 'О цели_0098', NULL, '00ffe8eefefafefe.jpg', 147, 1),
	(148, 6, 'О цели_0098фрагментСоотнесенияСоСледСтр', NULL, '00f860f8f0f0ff00.jpg', 148, 1),
	(149, 6, 'О цели_0099', NULL, '7e5f795b1f7fff00.jpg', 149, 1),
	(150, 6, 'О цели_0100', NULL, '00fefafefef0fe00.jpg', 150, 1),
	(151, 6, 'О цели_0100фрагментСоотнесенияСоСледСтр', NULL, 'f9f8f8f8f8f0fb00.jpg', 151, 1),
	(152, 6, 'О цели_0101', NULL, '007f5f5f5b7f7f0b.jpg', 152, 1),
	(153, 6, 'О цели_0102', NULL, '00f8f8fefefeff00.jpg', 153, 1),
	(154, 6, 'О цели_0102фрагментСоотнесенияСоСледСтр', NULL, '0f8d88f9f1f1ff00.jpg', 154, 1),
	(155, 6, 'О цели_0103', NULL, '707f7b7b5b5bff00.jpg', 155, 1),
	(156, 6, 'О цели_0104', NULL, '00ffe6f6c0eafd00.jpg', 156, 1),
	(157, 6, 'О цели_0104фрагментСоотнесенияСоСледСтр', NULL, 'fef878fcd8f8ff00.jpg', 157, 1),
	(158, 6, 'О цели_0105', NULL, '607b5b5f1f0fff08.jpg', 158, 1),
	(159, 6, 'О цели_0106', NULL, '00dff71ffff3fbfc.jpg', 159, 1),
	(160, 6, 'О цели_0106рагментСоотнесенияСоСледСтр', NULL, '00ff78f8fdfdf9c0.jpg', 160, 1),
	(161, 6, 'О цели_0107', NULL, '7f7b015fff7bdf00.jpg', 161, 1),
	(162, 6, 'О цели_0108', NULL, '00ff00f0735fff70.jpg', 162, 1),
	(163, 6, 'О цели_0109', NULL, '00ff81d91f1bff00.jpg', 163, 1),
	(164, 6, 'О цели_0110', NULL, '008f0309ffffff70.jpg', 164, 1),
	(165, 6, 'О цели_0111', NULL, '007f1b5f5f5b7f00.jpg', 165, 1),
	(166, 6, 'О цели_0112', NULL, '007170707f7f7f00.jpg', 166, 1),
	(167, 6, 'О цели_0113', NULL, '7f5d5b5f5b5fff00.jpg', 167, 1),
	(168, 6, 'О цели_0114', NULL, '00ff6261feffff00.jpg', 168, 1),
	(169, 6, 'О цели_0115', NULL, '13ff90f81b1fff00.jpg', 169, 1),
	(170, 6, 'О цели_0116', NULL, '007f617d7879ff00.jpg', 170, 1),
	(171, 6, 'О цели_0117_ПослеНее -двеПустыхСтраницы', NULL, '001b0fffdf17ff00.jpg', 171, 1),
	(172, 6, 'О цели_0120', NULL, '00ff777f7f7f7f7f.jpg', 172, 1),
	(173, 6, 'О цели_122 ОбложкаЗадняя. Внутренняя сторона пуста', NULL, '00fffefefefe82fa.jpg', 173, 1);
/*!40000 ALTER TABLE `page` ENABLE KEYS */;

-- Дамп структуры для таблица manuscript.part
CREATE TABLE IF NOT EXISTS `part` (
  `part_id` int(11) NOT NULL AUTO_INCREMENT,
  `page_id` int(11) NOT NULL,
  `path` varchar(1000) DEFAULT NULL,
  `content` text,
  `order_key` int(11) NOT NULL,
  PRIMARY KEY (`part_id`),
  KEY `part_page_id` (`page_id`),
  KEY `part_order_key` (`page_id`,`order_key`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8;

-- Дамп данных таблицы manuscript.part: ~8 rows (приблизительно)
/*!40000 ALTER TABLE `part` DISABLE KEYS */;
INSERT INTO `part` (`part_id`, `page_id`, `path`, `content`, `order_key`) VALUES
	(34, 3, '[[671,924],[[135,70],[365,72],[367,136],[140,132]]]', '', 34),
	(35, 3, '[[671,924],[[186,213],[650,230],[662,327],[619,332],[474,329],[464,377],[175,361]]]', '', 36),
	(36, 3, '[[671,924],[[185,129],[645,133],[659,182],[510,216],[189,203]]]', '', 35),
	(43, 2, '[[624,859],[[69,277],[508,275],[508,341],[60,350]]]', '<h2>Богородица Мария с Младенцем Иисусом ⇆ Блудница Синагоги с младенцем Мессией &mdash; вот узел истории</h2>', 45),
	(46, 2, '[[410,565],[[38,45],[154,44],[156,69],[162,74],[391,69],[388,186],[46,182]]]', '<h1>9 февраля 1985 года</h1>\n<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sit amet egestas mauris, nec fringilla risus. Vivamus ac felis dignissim quam rutrum blandit. Quisque consequat semper nibh id accumsan. Vestibulum iaculis enim sed laoreet ultricies. Nullam pulvinar consectetur efficitur. Duis et libero mauris. Quisque eu nulla quis enim gravida ultricies facilisis quis purus. Suspendisse faucibus erat id libero laoreet, in sollicitudin mauris fringilla. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Pellentesque pellentesque metus auctor, euismod ante quis, consequat dolor. Cras id magna auctor, cursus arcu non, pulvinar tellus. Donec pretium risus sit amet turpis fermentum hendrerit. Nunc scelerisque placerat cursus. Nulla placerat mi vel justo dignissim blandit sed nec est. Integer sed tellus in lorem dapibus porta nec in velit. Sed at sapien mauris.</p>', 44),
	(48, 2, '[[410,565],[[158,38],[171,73],[304,71],[306,56],[360,55],[360,37],[261,35]]]', '<p>Она на камне в Новгородском каноне, где уже "<span style="text-decoration: underline;">сидит</span>" Побеждающий.</p>', 43),
	(49, 2, '[[624,859],[[370,496],[591,499],[598,649],[367,629]]]', '<h1>11 февраля 1985 года</h1>\n<p>Nulla facilisi. Nam a pharetra nulla. Phasellus ut odio elit. Cras pellentesque metus non dapibus accumsan. Phasellus commodo pellentesque felis non maximus. Pellentesque ornare arcu facilisis neque porta commodo. Vestibulum ac laoreet elit, et fringilla tellus.</p>\n<ul>\n<li>Nulla non elementum mi.</li>\n<li>Ut quis lacus ipsum.</li>\n<li>Morbi in ipsum et elit interdum fringilla sit amet a nisi.</li>\n</ul>', 49),
	(50, 4, '[[910,661],[[768,54],[842,77],[833,292],[760,296]]]', '<h2>Письма</h2>', 50);
/*!40000 ALTER TABLE `part` ENABLE KEYS */;

-- Дамп структуры для таблица manuscript.toc
CREATE TABLE IF NOT EXISTS `toc` (
  `toc_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `thread_id` int(10) unsigned NOT NULL DEFAULT '0',
  `parent_id` int(10) unsigned NOT NULL DEFAULT '0',
  `title` varchar(100) NOT NULL DEFAULT '0',
  `description` text,
  `order_key` int(10) unsigned NOT NULL,
  `enabled` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`toc_id`),
  KEY `thread_id` (`thread_id`),
  KEY `order_key` (`order_key`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COMMENT='Дерево  с Книгами, Разделами и Главами.';

-- Дамп данных таблицы manuscript.toc: ~8 rows (приблизительно)
/*!40000 ALTER TABLE `toc` DISABLE KEYS */;
INSERT INTO `toc` (`toc_id`, `thread_id`, `parent_id`, `title`, `description`, `order_key`, `enabled`) VALUES
	(1, 1, 0, 'Хуан Хосе Арреола. Выдумки на любой вкус', 'Перевод с испанского В.Н Андреева, А.Ю. Балакина<br>OCR: Phiper', 1, 1),
	(2, 1, 1, 'КОРРИДО', '', 1, 1),
	(3, 1, 1, 'ОБРАЩЕННЫЙ', '', 3, 1),
	(4, 1, 1, 'ДОГОВОР С ЧЕРТОМ', '', 2, 1),
	(5, 1, 1, 'ПАБЛО', NULL, 5, 1),
	(6, 2, 0, 'О цели христианской жизни', 'Беседа преподобного Серафима Саровского с Николаем Александровичем Мотовиловым', 6, 0),
	(7, 2, 6, 'ИКОНА', NULL, 7, 1),
	(8, 2, 6, 'ПРИЧАСТИЕ', NULL, 8, 1);
/*!40000 ALTER TABLE `toc` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
