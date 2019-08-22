-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2019-08-22 09:55:20
-- 伺服器版本： 10.1.38-MariaDB
-- PHP 版本： 7.3.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫： `eshop`
--

-- --------------------------------------------------------

--
-- 資料表結構 `categories`
--

CREATE TABLE `categories` (
  `categories_id` int(11) NOT NULL,
  `categories_name` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 傾印資料表的資料 `categories`
--

INSERT INTO `categories` (`categories_id`, `categories_name`) VALUES
(1, 'Latest product'),
(2, 'Mens Clothing'),
(3, 'Babies Clothing'),
(4, 'Cosmetic');

-- --------------------------------------------------------

--
-- 資料表結構 `comments`
--

CREATE TABLE `comments` (
  `comment_id` int(11) NOT NULL,
  `comment_content` varchar(10000) NOT NULL,
  `comment_post_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 傾印資料表的資料 `comments`
--

INSERT INTO `comments` (`comment_id`, `comment_content`, `comment_post_id`) VALUES
(21, 'Which is a very good product', 10),
(22, 'I like this', 10),
(23, 'very good', 10),
(24, 'I dont like it', 11),
(25, 'dont buy', 11),
(26, 'hello world ', 31),
(27, 'hello world', 20),
(28, 'dhsakjfidsajf', 6),
(29, 'i dont understand the description', 6),
(30, 'hello world', 2),
(31, 'a', 12),
(32, 'i make it, yeah', 12);

-- --------------------------------------------------------

--
-- 資料表結構 `products`
--

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `product_name` varchar(250) NOT NULL,
  `product_price` varchar(10000) NOT NULL,
  `product_stocks` int(11) DEFAULT NULL,
  `product_image_url` varchar(1000) NOT NULL,
  `product_slug` varchar(250) NOT NULL,
  `product_category` int(11) NOT NULL,
  `merchant` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 傾印資料表的資料 `products`
--

INSERT INTO `products` (`product_id`, `product_name`, `product_price`, `product_stocks`, `product_image_url`, `product_slug`, `product_category`, `merchant`) VALUES
(1, 'Handbag 1', '806', 398, 'photo\\file1.jpg', 'Handbag 1', 4, 'dkfg2012'),
(2, 'Shoes 1', '312', 27, 'photo\\file2.jpg', 'Shoes 1', 3, 'dkfg2012'),
(3, 'Shoes 2', '101', 43, 'photo\\file3.jpg', 'Shoes 2', 1, 'dkfg2012'),
(4, 'T-shirt 1', '835', 263, 'photo\\file4.jpg', 'T-shirt 1', 4, 'dkfg2012'),
(5, 'Jeans 1', '32', 843, 'photo\\file5.jpg', 'Jeans 1', 1, 'dkfg2012'),
(6, 'Jeans 2', '153', 9, 'photo\\file6.jpg', 'Jeans 2', 2, 'dkfg2012'),
(7, 'Jeans 3', '983', 576, 'photo\\file7.jpg', 'Jeans 3', 3, 'dkfg2012'),
(8, 'Jeans 4', '396', 5, 'photo\\file8.jpg', 'Jeans 4', 4, 'dkfg2012'),
(9, 'T-shirt 2', '224', 199, 'photo\\file9.jpg', 'T-shirt 2', 3, 'dkfg2012'),
(10, 'Handbag 2', '57', 335, 'photo\\file10.jpg', 'Handbag 2', 2, 'dkfg2012'),
(11, 'Handbag 3', '602', 58, 'photo\\file11.jpg', 'Handbag 3', 1, 'dkfg2012'),
(12, 'Jeans 5', '257', 617, 'photo\\file12.jpg', 'Jeans 5', 2, 'dkfg2012'),
(13, 'Handbag 4', '190', 514, 'photo\\file13.jpg', 'Handbag 4', 3, 'dkfg2012'),
(14, 'T-shirt 3', '695', 930, 'photo\\file14.jpg', 'T-shirt 3', 3, 'dkfg2012'),
(15, 'Handbag 5', '238', 130, 'photo\\file15.jpg', 'Handbag 5', 1, 'dkfg2012'),
(17, 'Jeans 6', '359', 375, 'photo\\file17.jpg', 'Jeans 6', 3, 'dkfg2012'),
(18, 'Handbag 7', '388', 423, 'photo\\file18.jpg', 'Handbag 7', 2, 'dkfg2012'),
(19, 'Shoes 3', '264', 150, 'photo\\file19.jpg', 'Shoes 3', 2, 'dkfg2012'),
(20, 'Handbag 8', '583', 628, 'photo\\file20.jpg', 'Handbag 8', 4, 'dkfg2012'),
(21, 'Handbag 9', '235', 428, 'photo\\file21.jpg', 'Handbag 9', 2, 'dkfg2012'),
(22, 'T-shirt 4', '867', 494, 'photo\\file22.jpg', 'T-shirt 4', 3, 'dkfg2012'),
(23, 'T-shirt 5', '81', 791, 'photo\\file23.jpg', 'T-shirt 5', 2, 'dkfg2012'),
(24, 'Handbag 10', '299', 859, 'photo\\file24.jpg', 'Handbag 10', 2, 'dkfg2012'),
(25, 'T-shirt 6', '921', 700, 'photo\\file25.jpg', 'T-shirt 6', 3, 'dkfg2012'),
(26, 'Shoes 4', '778', 388, 'photo\\file26.jpg', 'Shoes 4', 4, 'dkfg2012'),
(27, 'Shoes 5', '550', 850, 'photo\\file27.jpg', 'Shoes 5', 2, 'dkfg2012'),
(28, 'Jeans 7', '281', 363, 'photo\\file28.jpg', 'Jeans 7', 2, 'dkfg2012'),
(29, 'Jeans 8', '742', 31, 'photo\\file29.jpg', 'Jeans 8', 3, 'dkfg2012'),
(30, 'Handbag 11', '661', 203, 'photo\\file30.jpg', 'Handbag 11', 3, 'dkfg2012'),
(31, 'T-shirt 7', '470', 10, 'photo\\file31.jpg', 'T-shirt 7', 2, 'dkfg2012'),
(32, 'Handbag 12', '316', 618, 'photo\\file32.jpg', 'Handbag 12', 2, 'dkfg2012'),
(33, 'Jeans 9', '160', 575, 'photo\\file33.jpg', 'Jeans 9', 2, 'dkfg2012'),
(34, 'Shoes 6', '675', 50, 'photo\\file34.jpg', 'Shoes 6', 3, 'dkfg2012'),
(50, 'apple1', '10', 10, 'photo\\6000200094514.jpg', 'apple1', 1, 'dkfg2012'),
(51, 'apple2', '10', 10, 'photo\\6000200094514.jpg', 'apple2', 1, 'dkfg2012'),
(52, 'mango 1', '10', 10, 'photo\\mango.jpg', 'mango 1', 1, 'dkfg2012');

-- --------------------------------------------------------

--
-- 資料表結構 `users`
--

CREATE TABLE `users` (
  `user_name` varchar(250) NOT NULL,
  `user_password` varchar(250) NOT NULL,
  `user_email` varchar(250) NOT NULL,
  `user_id` int(11) NOT NULL,
  `user_money` mediumtext NOT NULL,
  `Merchant` bit(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 傾印資料表的資料 `users`
--

INSERT INTO `users` (`user_name`, `user_password`, `user_email`, `user_id`, `user_money`, `Merchant`) VALUES
('dkfg2012', 'admin', 'dkfg2012@yahoo.com.hk', 1, '932316', b'1'),
('Hello', 'World', 'dkfg201270@gmail.com', 2, '1000', b'0');

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`categories_id`);

--
-- 資料表索引 `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`comment_id`);

--
-- 資料表索引 `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`);

--
-- 資料表索引 `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- 在傾印的資料表使用自動增長(AUTO_INCREMENT)
--

--
-- 使用資料表自動增長(AUTO_INCREMENT) `categories`
--
ALTER TABLE `categories`
  MODIFY `categories_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- 使用資料表自動增長(AUTO_INCREMENT) `comments`
--
ALTER TABLE `comments`
  MODIFY `comment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- 使用資料表自動增長(AUTO_INCREMENT) `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- 使用資料表自動增長(AUTO_INCREMENT) `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
