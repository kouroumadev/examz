-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jan 30, 2023 at 05:29 PM
-- Server version: 8.0.21
-- PHP Version: 7.3.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `examz`
--

-- --------------------------------------------------------

--
-- Table structure for table `announcements`
--

DROP TABLE IF EXISTS `announcements`;
CREATE TABLE IF NOT EXISTS `announcements` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `institute_id` bigint UNSIGNED NOT NULL,
  `title` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sub_title` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `file` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('published','draft') COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `announcements_user_id_foreign` (`user_id`),
  KEY `announcements_institute_id_foreign` (`institute_id`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `announcements`
--

INSERT INTO `announcements` (`id`, `user_id`, `institute_id`, `title`, `sub_title`, `description`, `file`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'announcement 1', 'announcement sub', 'this is announcement description ', NULL, '', NULL, NULL),
(2, 2, 1, 'announcement 2', 'sub_ann_2', 'desc 2', '550361632.jpg', 'published', '2022-10-31 08:27:02', '2022-10-31 08:27:02'),
(3, 2, 1, 'announcement 2', 'sub_ann_2', 'desc 2', '1544112132.jpg', 'published', '2022-10-31 08:27:53', '2022-10-31 08:27:53'),
(4, 2, 1, 'announcement 3', 'sub_ann_3', 'desc 3', '1667985782karim.jpg', 'published', '2022-11-09 09:23:04', '2022-11-09 09:23:04'),
(5, 2, 1, 'announcement 5', 'sub_ann_5', 'desc 5', 'C:\\Users\\kourouma\\AppData\\Local\\Temp\\phpEC8E.tmp', 'published', '2022-11-09 09:43:33', '2022-11-09 09:43:33'),
(6, 2, 1, 'announcement 6', 'sub_ann_6', 'desc 6', '1850745278.jpg', 'published', '2022-11-09 09:45:59', '2022-11-09 09:45:59'),
(7, 2, 1, 'announcement 7', 'sub_ann_7', 'desc 7', '1411846932.jpg', 'published', '2022-11-10 14:03:40', '2022-11-10 14:03:40');

-- --------------------------------------------------------

--
-- Table structure for table `announcement_batch`
--

DROP TABLE IF EXISTS `announcement_batch`;
CREATE TABLE IF NOT EXISTS `announcement_batch` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `announcement_id` bigint UNSIGNED NOT NULL,
  `batch_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `announcement_batch_announcement_id_foreign` (`announcement_id`),
  KEY `announcement_batch_batch_id_foreign` (`batch_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `announcement_branch`
--

DROP TABLE IF EXISTS `announcement_branch`;
CREATE TABLE IF NOT EXISTS `announcement_branch` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `announcement_id` bigint UNSIGNED NOT NULL,
  `branch_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `announcement_branch_announcement_id_foreign` (`announcement_id`),
  KEY `announcement_branch_branch_id_foreign` (`branch_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `batches`
--

DROP TABLE IF EXISTS `batches`;
CREATE TABLE IF NOT EXISTS `batches` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `institute_id` bigint UNSIGNED NOT NULL,
  `name` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `batches_institute_id_foreign` (`institute_id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `batches`
--

INSERT INTO `batches` (`id`, `institute_id`, `name`, `code`, `created_at`, `updated_at`) VALUES
(1, 1, 'First', '0909', '2022-10-17 18:08:01', '2022-10-17 18:08:01'),
(2, 1, 'Second', '0909', '2022-10-17 18:08:01', '2022-10-17 18:08:01'),
(3, 1, 'Third', '0909', '2022-10-17 18:08:01', '2022-10-17 18:08:01'),
(4, 2, 'One', '0909', '2022-10-17 18:08:01', '2022-10-17 18:08:01'),
(5, 2, 'Two', '0909', '2022-10-17 18:08:01', '2022-10-17 18:08:01'),
(6, 2, 'Three', '0909', '2022-10-17 18:08:01', '2022-10-17 18:08:01');

-- --------------------------------------------------------

--
-- Table structure for table `batch_exam`
--

DROP TABLE IF EXISTS `batch_exam`;
CREATE TABLE IF NOT EXISTS `batch_exam` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `batch_id` bigint UNSIGNED NOT NULL,
  `exam_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `batch_exam_batch_id_foreign` (`batch_id`),
  KEY `batch_exam_exam_id_foreign` (`exam_id`)
) ENGINE=MyISAM AUTO_INCREMENT=130 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `batch_exam`
--

INSERT INTO `batch_exam` (`id`, `batch_id`, `exam_id`, `created_at`, `updated_at`) VALUES
(1, 2, 3, NULL, NULL),
(2, 2, 4, NULL, NULL),
(3, 2, 5, NULL, NULL),
(4, 2, 6, NULL, NULL),
(5, 2, 7, NULL, NULL),
(6, 2, 8, NULL, NULL),
(7, 2, 9, NULL, NULL),
(8, 2, 10, NULL, NULL),
(9, 1, 11, NULL, NULL),
(10, 1, 12, NULL, NULL),
(11, 1, 13, NULL, NULL),
(12, 1, 14, NULL, NULL),
(13, 1, 15, NULL, NULL),
(14, 1, 16, NULL, NULL),
(15, 1, 17, NULL, NULL),
(16, 1, 18, NULL, NULL),
(17, 1, 19, NULL, NULL),
(18, 1, 20, NULL, NULL),
(19, 1, 21, NULL, NULL),
(20, 1, 22, NULL, NULL),
(21, 1, 23, NULL, NULL),
(22, 1, 24, NULL, NULL),
(23, 1, 25, NULL, NULL),
(24, 1, 26, NULL, NULL),
(25, 1, 27, NULL, NULL),
(26, 1, 28, NULL, NULL),
(27, 1, 29, NULL, NULL),
(28, 1, 30, NULL, NULL),
(29, 1, 31, NULL, NULL),
(30, 1, 32, NULL, NULL),
(31, 1, 33, NULL, NULL),
(32, 1, 34, NULL, NULL),
(33, 2, 35, NULL, NULL),
(34, 2, 36, NULL, NULL),
(35, 2, 37, NULL, NULL),
(36, 2, 38, NULL, NULL),
(37, 2, 39, NULL, NULL),
(38, 2, 40, NULL, NULL),
(39, 2, 41, NULL, NULL),
(40, 2, 42, NULL, NULL),
(41, 2, 43, NULL, NULL),
(42, 2, 44, NULL, NULL),
(43, 2, 45, NULL, NULL),
(44, 2, 46, NULL, NULL),
(45, 2, 47, NULL, NULL),
(46, 2, 48, NULL, NULL),
(47, 2, 49, NULL, NULL),
(48, 2, 50, NULL, NULL),
(49, 2, 51, NULL, NULL),
(50, 2, 52, NULL, NULL),
(51, 2, 53, NULL, NULL),
(52, 2, 54, NULL, NULL),
(53, 2, 55, NULL, NULL),
(54, 2, 56, NULL, NULL),
(55, 2, 57, NULL, NULL),
(56, 2, 58, NULL, NULL),
(57, 2, 59, NULL, NULL),
(58, 2, 60, NULL, NULL),
(59, 2, 61, NULL, NULL),
(60, 2, 62, NULL, NULL),
(61, 2, 63, NULL, NULL),
(62, 2, 64, NULL, NULL),
(63, 2, 65, NULL, NULL),
(64, 2, 66, NULL, NULL),
(65, 2, 67, NULL, NULL),
(66, 2, 68, NULL, NULL),
(67, 2, 69, NULL, NULL),
(68, 2, 70, NULL, NULL),
(69, 2, 71, NULL, NULL),
(70, 2, 72, NULL, NULL),
(71, 2, 73, NULL, NULL),
(72, 2, 74, NULL, NULL),
(73, 2, 75, NULL, NULL),
(74, 2, 76, NULL, NULL),
(75, 1, 77, NULL, NULL),
(76, 2, 78, NULL, NULL),
(77, 2, 79, NULL, NULL),
(78, 2, 80, NULL, NULL),
(79, 2, 81, NULL, NULL),
(80, 2, 82, NULL, NULL),
(81, 2, 83, NULL, NULL),
(82, 2, 84, NULL, NULL),
(83, 2, 85, NULL, NULL),
(84, 2, 86, NULL, NULL),
(85, 2, 87, NULL, NULL),
(86, 2, 88, NULL, NULL),
(87, 2, 89, NULL, NULL),
(88, 2, 90, NULL, NULL),
(89, 2, 91, NULL, NULL),
(90, 2, 92, NULL, NULL),
(91, 2, 93, NULL, NULL),
(92, 2, 94, NULL, NULL),
(93, 2, 95, NULL, NULL),
(94, 1, 96, NULL, NULL),
(95, 1, 97, NULL, NULL),
(96, 1, 98, NULL, NULL),
(97, 1, 99, NULL, NULL),
(98, 1, 100, NULL, NULL),
(99, 1, 101, NULL, NULL),
(100, 2, 102, NULL, NULL),
(101, 2, 103, NULL, NULL),
(102, 1, 104, NULL, NULL),
(103, 1, 105, NULL, NULL),
(104, 1, 106, NULL, NULL),
(105, 1, 107, NULL, NULL),
(106, 1, 108, NULL, NULL),
(107, 1, 109, NULL, NULL),
(108, 1, 110, NULL, NULL),
(109, 1, 111, NULL, NULL),
(110, 2, 111, NULL, NULL),
(111, 3, 111, NULL, NULL),
(112, 1, 112, NULL, NULL),
(113, 1, 113, NULL, NULL),
(114, 1, 114, NULL, NULL),
(115, 2, 114, NULL, NULL),
(116, 1, 115, NULL, NULL),
(117, 2, 115, NULL, NULL),
(118, 1, 116, NULL, NULL),
(119, 2, 116, NULL, NULL),
(120, 1, 117, NULL, NULL),
(121, 2, 117, NULL, NULL),
(122, 1, 118, NULL, NULL),
(123, 2, 118, NULL, NULL),
(124, 2, 119, NULL, NULL),
(125, 1, 119, NULL, NULL),
(126, 1, 120, NULL, NULL),
(127, 2, 120, NULL, NULL),
(128, 1, 121, NULL, NULL),
(129, 2, 121, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `branches`
--

DROP TABLE IF EXISTS `branches`;
CREATE TABLE IF NOT EXISTS `branches` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `institute_id` bigint UNSIGNED NOT NULL,
  `name` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `state` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `landline_number` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pin_code` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('pending','approve','reject') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `branches_institute_id_foreign` (`institute_id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `branches`
--

INSERT INTO `branches` (`id`, `institute_id`, `name`, `address`, `state`, `city`, `email`, `landline_number`, `phone`, `pin_code`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 'Ketintang', 'Surabaya', 'Andaman and Nicobar Islands', 'Bamboo Flat', 'vm8qGt8ua5@gmail.com', '8080', '085657889900', '0909', 'approve', '2022-10-17 18:08:00', '2022-10-17 18:08:00'),
(2, 1, 'Lidah Wetan', 'Surabaya', 'Andaman and Nicobar Islands', 'Nicobar', '67asuUX3cs@gmail.com', '8080', '085657889900', '0909', 'pending', '2022-10-17 18:08:00', '2022-10-17 18:08:00'),
(3, 1, 'Royal', 'Surabaya', 'Andaman and Nicobar Islands', 'Port Blair', 'mkKOB9zh1s@gmail.com', '8080', '085657889900', '0909', 'reject', '2022-10-17 18:08:00', '2022-10-17 18:08:00'),
(4, 2, 'Batu', 'Malang', 'Andaman and Nicobar Islands', 'Bamboo Flat', 'nC47LixE2t@gmail.com', '8080', '085657889900', '0909', 'approve', '2022-10-17 18:08:00', '2022-10-17 18:08:00'),
(5, 2, 'Blimbing', 'Malang', 'Andaman and Nicobar Islands', 'Nicobar', '3lHOavdfi5@gmail.com', '8080', '085657889900', '0909', 'pending', '2022-10-17 18:08:00', '2022-10-17 18:08:00'),
(6, 2, 'Pujon', 'Malang', 'Andaman and Nicobar Islands', 'Port Blair', '7dKHqcD81q@gmail.com', '8080', '085657889900', '0909', 'reject', '2022-10-17 18:08:00', '2022-10-17 18:08:00');

-- --------------------------------------------------------

--
-- Table structure for table `branch_exam`
--

DROP TABLE IF EXISTS `branch_exam`;
CREATE TABLE IF NOT EXISTS `branch_exam` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `branch_id` bigint UNSIGNED NOT NULL,
  `exam_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `branch_exam_branch_id_foreign` (`branch_id`),
  KEY `branch_exam_exam_id_foreign` (`exam_id`)
) ENGINE=MyISAM AUTO_INCREMENT=120 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `branch_exam`
--

INSERT INTO `branch_exam` (`id`, `branch_id`, `exam_id`, `created_at`, `updated_at`) VALUES
(1, 1, 3, NULL, NULL),
(2, 1, 4, NULL, NULL),
(3, 1, 5, NULL, NULL),
(4, 1, 6, NULL, NULL),
(5, 1, 7, NULL, NULL),
(6, 1, 8, NULL, NULL),
(7, 1, 9, NULL, NULL),
(8, 1, 10, NULL, NULL),
(9, 1, 11, NULL, NULL),
(10, 1, 12, NULL, NULL),
(11, 1, 13, NULL, NULL),
(12, 1, 14, NULL, NULL),
(13, 1, 15, NULL, NULL),
(14, 1, 16, NULL, NULL),
(15, 1, 17, NULL, NULL),
(16, 1, 18, NULL, NULL),
(17, 1, 19, NULL, NULL),
(18, 1, 20, NULL, NULL),
(19, 1, 21, NULL, NULL),
(20, 1, 22, NULL, NULL),
(21, 1, 23, NULL, NULL),
(22, 1, 24, NULL, NULL),
(23, 1, 25, NULL, NULL),
(24, 1, 26, NULL, NULL),
(25, 1, 27, NULL, NULL),
(26, 1, 28, NULL, NULL),
(27, 1, 29, NULL, NULL),
(28, 1, 30, NULL, NULL),
(29, 1, 31, NULL, NULL),
(30, 1, 32, NULL, NULL),
(31, 1, 33, NULL, NULL),
(32, 1, 34, NULL, NULL),
(33, 1, 35, NULL, NULL),
(34, 1, 36, NULL, NULL),
(35, 1, 37, NULL, NULL),
(36, 1, 38, NULL, NULL),
(37, 1, 39, NULL, NULL),
(38, 1, 40, NULL, NULL),
(39, 1, 41, NULL, NULL),
(40, 1, 42, NULL, NULL),
(41, 1, 43, NULL, NULL),
(42, 1, 44, NULL, NULL),
(43, 1, 45, NULL, NULL),
(44, 1, 46, NULL, NULL),
(45, 1, 47, NULL, NULL),
(46, 1, 48, NULL, NULL),
(47, 1, 49, NULL, NULL),
(48, 1, 50, NULL, NULL),
(49, 1, 51, NULL, NULL),
(50, 1, 52, NULL, NULL),
(51, 1, 53, NULL, NULL),
(52, 1, 54, NULL, NULL),
(53, 1, 55, NULL, NULL),
(54, 1, 56, NULL, NULL),
(55, 1, 57, NULL, NULL),
(56, 1, 58, NULL, NULL),
(57, 1, 59, NULL, NULL),
(58, 1, 60, NULL, NULL),
(59, 1, 61, NULL, NULL),
(60, 1, 62, NULL, NULL),
(61, 1, 63, NULL, NULL),
(62, 1, 64, NULL, NULL),
(63, 1, 65, NULL, NULL),
(64, 1, 66, NULL, NULL),
(65, 1, 67, NULL, NULL),
(66, 1, 68, NULL, NULL),
(67, 1, 69, NULL, NULL),
(68, 1, 70, NULL, NULL),
(69, 1, 71, NULL, NULL),
(70, 1, 72, NULL, NULL),
(71, 1, 73, NULL, NULL),
(72, 1, 74, NULL, NULL),
(73, 1, 75, NULL, NULL),
(74, 1, 76, NULL, NULL),
(75, 1, 77, NULL, NULL),
(76, 1, 78, NULL, NULL),
(77, 1, 79, NULL, NULL),
(78, 1, 80, NULL, NULL),
(79, 1, 81, NULL, NULL),
(80, 1, 82, NULL, NULL),
(81, 1, 83, NULL, NULL),
(82, 1, 84, NULL, NULL),
(83, 1, 85, NULL, NULL),
(84, 1, 86, NULL, NULL),
(85, 1, 87, NULL, NULL),
(86, 1, 88, NULL, NULL),
(87, 1, 89, NULL, NULL),
(88, 1, 90, NULL, NULL),
(89, 1, 91, NULL, NULL),
(90, 1, 92, NULL, NULL),
(91, 1, 93, NULL, NULL),
(92, 1, 94, NULL, NULL),
(93, 1, 95, NULL, NULL),
(94, 1, 96, NULL, NULL),
(95, 1, 97, NULL, NULL),
(96, 1, 98, NULL, NULL),
(97, 1, 99, NULL, NULL),
(98, 1, 100, NULL, NULL),
(99, 1, 101, NULL, NULL),
(100, 1, 102, NULL, NULL),
(101, 1, 103, NULL, NULL),
(102, 1, 104, NULL, NULL),
(103, 1, 105, NULL, NULL),
(104, 1, 106, NULL, NULL),
(105, 1, 107, NULL, NULL),
(106, 1, 108, NULL, NULL),
(107, 1, 109, NULL, NULL),
(108, 1, 110, NULL, NULL),
(109, 1, 111, NULL, NULL),
(110, 1, 112, NULL, NULL),
(111, 1, 113, NULL, NULL),
(112, 1, 114, NULL, NULL),
(113, 1, 115, NULL, NULL),
(114, 1, 116, NULL, NULL),
(115, 1, 117, NULL, NULL),
(116, 1, 118, NULL, NULL),
(117, 1, 119, NULL, NULL),
(118, 1, 120, NULL, NULL),
(119, 1, 121, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `enrollments`
--

DROP TABLE IF EXISTS `enrollments`;
CREATE TABLE IF NOT EXISTS `enrollments` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `institute_id` bigint UNSIGNED NOT NULL,
  `branch_id` bigint UNSIGNED NOT NULL,
  `batch_id` bigint UNSIGNED NOT NULL,
  `code` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('pending','approve','reject') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `is_student_data_editable` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `enrollments_user_id_foreign` (`user_id`),
  KEY `enrollments_institute_id_foreign` (`institute_id`),
  KEY `enrollments_branch_id_foreign` (`branch_id`),
  KEY `enrollments_batch_id_foreign` (`batch_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `enrollments`
--

INSERT INTO `enrollments` (`id`, `user_id`, `institute_id`, `branch_id`, `batch_id`, `code`, `status`, `is_student_data_editable`, `created_at`, `updated_at`) VALUES
(1, 7, 1, 1, 1, 'ENR-000001', 'approve', 0, '2022-11-28 14:53:17', '2022-11-28 14:54:32');

-- --------------------------------------------------------

--
-- Table structure for table `exams`
--

DROP TABLE IF EXISTS `exams`;
CREATE TABLE IF NOT EXISTS `exams` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `institute_id` bigint UNSIGNED DEFAULT NULL,
  `exam_category_id` bigint UNSIGNED NOT NULL,
  `exam_type_id` bigint UNSIGNED DEFAULT NULL,
  `name` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('live','standard') COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('published','draft') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `instruction` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `duration` int DEFAULT NULL,
  `consentments` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `exams_user_id_foreign` (`user_id`),
  KEY `exams_institute_id_foreign` (`institute_id`),
  KEY `exams_exam_category_id_foreign` (`exam_category_id`),
  KEY `exams_exam_type_id_foreign` (`exam_type_id`)
) ENGINE=MyISAM AUTO_INCREMENT=123 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `exams`
--

INSERT INTO `exams` (`id`, `user_id`, `institute_id`, `exam_category_id`, `exam_type_id`, `name`, `slug`, `type`, `status`, `start_date`, `end_date`, `start_time`, `end_time`, `instruction`, `duration`, `consentments`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 1, 1, 'exam test', 'slug test', 'live', 'published', '2022-10-20', '2022-10-31', '28:09:55', '61:09:55', 'lorem ipsum', 20, NULL, NULL, NULL),
(111, 2, 1, 1, 1, 'final exam', 'final-exam-519e4f6d-4ac8-4b81-8887-53b16f0a3025', 'standard', 'published', NULL, NULL, NULL, NULL, 'Follow all the steps', 180, 'I have read and understood the instructions. All computer hardware allotted to me are in proper working condition. I declare that I am not in possession of / not wearing / not carrying any prohibited gadget like mobile phone, bluetooth devices etc. /any prohibited material with me into the Examination Hall.I agree that in case of not adhering to the instructions, I shall be liable to be debarred from this Test and/or to disciplinary action, which may include ban from future Tests / Examinations', '2022-11-29 08:15:37', '2022-12-08 17:19:21'),
(114, 2, 1, 3, NULL, 'semester exam', 'semester-exam-d33d4f29-fef9-4b5a-af87-be946c6375b7', 'standard', 'published', NULL, NULL, NULL, NULL, 'this an instruction', 180, 'I have read and understood the instructions. All computer hardware allotted to me are in proper working condition. I declare that I am not in possession of / not wearing / not carrying any prohibited gadget like mobile phone, bluetooth devices etc. /any prohibited material with me into the Examination Hall.I agree that in case of not adhering to the instructions, I shall be liable to be debarred from this Test and/or to disciplinary action, which may include ban from future Tests / Examinations', '2022-12-09 19:53:02', '2022-12-09 19:57:36'),
(115, 2, 1, 2, NULL, 'mid exam', 'mid-exam-089059cc-3184-4da8-9d2b-fa2f4dec5d5c', 'standard', 'published', NULL, NULL, NULL, NULL, 'This is an instruction', 180, 'I have read and understood the instructions. All computer hardware allotted to me are in proper working condition. I declare that I am not in possession of / not wearing / not carrying any prohibited gadget like mobile phone, bluetooth devices etc. /any prohibited material with me into the Examination Hall.I agree that in case of not adhering to the instructions, I shall be liable to be debarred from this Test and/or to disciplinary action, which may include ban from future Tests / Examinations', '2022-12-10 11:33:16', '2022-12-10 11:41:30'),
(116, 2, 1, 1, 1, 'sessional exam', 'sessional-exam-c9149945-e524-4bd6-9dbc-5b7b889fd445', 'standard', 'published', NULL, NULL, NULL, NULL, 'Follow all the steps', 180, 'I have read and understood the instructions. All computer hardware allotted to me are in proper working condition. I declare that I am not in possession of / not wearing / not carrying any prohibited gadget like mobile phone, bluetooth devices etc. /any prohibited material with me into the Examination Hall.I agree that in case of not adhering to the instructions, I shall be liable to be debarred from this Test and/or to disciplinary action, which may include ban from future Tests / Examinations', '2022-12-12 10:23:28', '2022-12-12 10:29:29'),
(117, 2, 1, 3, NULL, 'exam test1', 'exam-test1-42eef0b8-6cbb-4be6-91cb-54cc7578a4ee', 'standard', 'published', NULL, NULL, NULL, NULL, 'this an instruction', 180, 'I have read and understood the instructions. All computer hardware allotted to me are in proper working condition. I declare that I am not in possession of / not wearing / not carrying any prohibited gadget like mobile phone, bluetooth devices etc. /any prohibited material with me into the Examination Hall.I agree that in case of not adhering to the instructions, I shall be liable to be debarred from this Test and/or to disciplinary action, which may include ban from future Tests / Examinations', '2022-12-13 09:39:43', '2022-12-13 09:48:13'),
(118, 2, 1, 2, NULL, 'exam test 2', 'exam-test-2-55f19ebc-369f-4747-85b5-b7f707ca142d', 'standard', 'published', NULL, NULL, NULL, NULL, 'This is an instruction', 100000, 'I have read and understood the instructions. All computer hardware allotted to me are in proper working condition. I declare that I am not in possession of / not wearing / not carrying any prohibited gadget like mobile phone, bluetooth devices etc. /any prohibited material with me into the Examination Hall.I agree that in case of not adhering to the instructions, I shall be liable to be debarred from this Test and/or to disciplinary action, which may include ban from future Tests / Examinations', '2022-12-13 17:55:00', '2022-12-13 18:04:33'),
(119, 2, 1, 2, NULL, 'exam test 3', 'exam-test-3-369a9c62-50bf-457d-a2bc-901be02a6747', 'standard', 'published', NULL, NULL, NULL, NULL, 'This is an instruction', 100000, 'I have read and understood the instructions. All computer hardware allotted to me are in proper working condition. I declare that I am not in possession of / not wearing / not carrying any prohibited gadget like mobile phone, bluetooth devices etc. /any prohibited material with me into the Examination Hall.I agree that in case of not adhering to the instructions, I shall be liable to be debarred from this Test and/or to disciplinary action, which may include ban from future Tests / Examinations', '2022-12-15 16:10:59', '2022-12-16 05:28:06'),
(120, 2, 1, 2, NULL, 'exam test 4', 'exam-test-4-3614a74a-0718-4184-91de-576e4ad7ef4b', 'standard', 'published', NULL, NULL, NULL, NULL, 'This is an instruction', 900, 'I have read and understood the instructions. All computer hardware allotted to me are in proper working condition. I declare that I am not in possession of / not wearing / not carrying any prohibited gadget like mobile phone, bluetooth devices etc. /any prohibited material with me into the Examination Hall.I agree that in case of not adhering to the instructions, I shall be liable to be debarred from this Test and/or to disciplinary action, which may include ban from future Tests / Examinations', '2022-12-19 08:59:48', '2022-12-19 14:37:48'),
(121, 2, 1, 3, NULL, 'exam test 5', 'exam-test-5-6eeaf0fb-f764-4b66-b0a6-ceb08e2d1ee9', 'standard', 'published', NULL, NULL, NULL, NULL, 'this an instruction', 900, 'I have read and understood the instructions. All computer hardware allotted to me are in proper working condition. I declare that I am not in possession of / not wearing / not carrying any prohibited gadget like mobile phone, bluetooth devices etc. /any prohibited material with me into the Examination Hall.I agree that in case of not adhering to the instructions, I shall be liable to be debarred from this Test and/or to disciplinary action, which may include ban from future Tests / Examinations', '2022-12-22 17:15:30', '2022-12-22 17:22:22'),
(122, 6, NULL, 3, NULL, 'exam test 6', 'exam-test-6-e5f0c8c6-a239-4fa5-8292-e3f96ad04b08', 'standard', 'draft', NULL, NULL, NULL, NULL, 'this an instruction', 900000, 'I have read and understood the instructions. All computer hardware allotted to me are in proper working condition. I declare that I am not in possession of / not wearing / not carrying any prohibited gadget like mobile phone, bluetooth devices etc. /any prohibited material with me into the Examination Hall.I agree that in case of not adhering to the instructions, I shall be liable to be debarred from this Test and/or to disciplinary action, which may include ban from future Tests / Examinations', '2022-12-26 17:25:35', '2022-12-26 17:25:35'),
(109, 2, 1, 1, 1, 'abd', 'abd-2613a018-baac-4e21-939a-70a2ceda00c8', 'standard', 'published', NULL, NULL, NULL, NULL, 'Follow all the steps', 180, 'I have read and understood the instructions. All computer hardware allotted to me are in proper working condition. I declare that I am not in possession of / not wearing / not carrying any prohibited gadget like mobile phone, bluetooth devices etc. /any prohibited material with me into the Examination Hall.I agree that in case of not adhering to the instructions, I shall be liable to be debarred from this Test and/or to disciplinary action, which may include ban from future Tests / Examinations', '2022-11-24 10:39:44', '2022-11-28 14:56:47');

-- --------------------------------------------------------

--
-- Table structure for table `exam_categories`
--

DROP TABLE IF EXISTS `exam_categories`;
CREATE TABLE IF NOT EXISTS `exam_categories` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `duration` int DEFAULT NULL,
  `consent` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `exam_categories`
--

INSERT INTO `exam_categories` (`id`, `name`, `duration`, `consent`, `created_at`, `updated_at`) VALUES
(1, 'Engineering', 50, 'this is a consent for engineering', '2022-10-17 18:08:02', '2022-10-17 18:08:02'),
(2, 'Medical', 45, 'this is a consent for medical', '2022-10-17 18:08:02', '2022-10-17 18:08:02'),
(3, 'Bank', 30, 'this is a consent for bank', '2022-10-17 18:08:02', '2022-10-17 18:08:02');

-- --------------------------------------------------------

--
-- Table structure for table `exam_configurations`
--

DROP TABLE IF EXISTS `exam_configurations`;
CREATE TABLE IF NOT EXISTS `exam_configurations` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `exam_category_id` bigint UNSIGNED NOT NULL,
  `exam_type_id` bigint UNSIGNED NOT NULL,
  `data` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `exam_configurations_exam_category_id_foreign` (`exam_category_id`),
  KEY `exam_configurations_exam_type_id_foreign` (`exam_type_id`)
) ENGINE=MyISAM AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `exam_configurations`
--

INSERT INTO `exam_configurations` (`id`, `exam_category_id`, `exam_type_id`, `data`, `created_at`, `updated_at`) VALUES
(37, 3, 0, '{\"consent\": \"I have read and understood the instructions. All computer hardware allotted to me are in proper working condition. I declare that I am not in possession of / not wearing / not carrying any prohibited gadget like mobile phone, bluetooth devices etc. /any prohibited material with me into the Examination Hall.I agree that in case of not adhering to the instructions, I shall be liable to be debarred from this Test and/or to disciplinary action, which may include ban from future Tests / Examinations\", \"duration\": {\"type\": \"total\", \"value\": 900000}, \"sections\": [{\"name\": \"Mathematics\", \"questions\": {\"mark\": 10, \"number\": 5, \"negative_mark\": 2, \"correct_answer\": 6}, \"max_question\": \"3\"}, {\"name\": \"Physics\", \"questions\": {\"mark\": 50, \"number\": 3, \"negative_mark\": 1, \"correct_answer\": 5}, \"max_question\": \"2\"}, {\"name\": \"Chemestry\", \"questions\": {\"mark\": 25, \"number\": 5, \"negative_mark\": 2, \"correct_answer\": 3}, \"max_question\": \"1\"}], \"instruction\": \"this an instruction\"}', '2022-12-26 17:22:56', '2022-12-26 17:22:56'),
(35, 1, 1, '{\"consent\": \"I have read and understood the instructions. All computer hardware allotted to me are in proper working condition. I declare that I am not in possession of / not wearing / not carrying any prohibited gadget like mobile phone, bluetooth devices etc. /any prohibited material with me into the Examination Hall.I agree that in case of not adhering to the instructions, I shall be liable to be debarred from this Test and/or to disciplinary action, which may include ban from future Tests / Examinations\", \"duration\": {\"type\": \"total\", \"value\": 1000000}, \"sections\": [{\"name\": \"Mathmaticss\", \"questions\": {\"mark\": 10, \"number\": 3, \"negative_mark\": 5, \"correct_answer\": 4}, \"max_question\": \"3\"}, {\"name\": \"Physics\", \"questions\": {\"mark\": 15, \"number\": 5, \"negative_mark\": 5, \"correct_answer\": 5}, \"max_question\": \"2\"}, {\"name\": \"Chemestry\", \"questions\": {\"mark\": 12, \"number\": 4, \"negative_mark\": 7, \"correct_answer\": 4}, \"max_question\": \"1\"}], \"instruction\": \"Follow all the steps\"}', '2022-12-26 17:22:56', '2022-12-26 17:22:56'),
(36, 2, 0, '{\"consent\": \"I have read and understood the instructions. All computer hardware allotted to me are in proper working condition. I declare that I am not in possession of / not wearing / not carrying any prohibited gadget like mobile phone, bluetooth devices etc. /any prohibited material with me into the Examination Hall.I agree that in case of not adhering to the instructions, I shall be liable to be debarred from this Test and/or to disciplinary action, which may include ban from future Tests / Examinations\", \"duration\": {\"type\": \"total\", \"value\": 500000}, \"sections\": [{\"name\": \"Mathematics\", \"questions\": {\"mark\": 10, \"number\": 5, \"negative_mark\": 1, \"correct_answer\": 3}, \"max_question\": \"3\"}, {\"name\": \"Physics\", \"questions\": {\"mark\": 20, \"number\": 3, \"negative_mark\": 1, \"correct_answer\": 5}, \"max_question\": \"2\"}, {\"name\": \"Chemestry\", \"questions\": {\"mark\": 30, \"number\": 2, \"negative_mark\": 2, \"correct_answer\": 3}, \"max_question\": \"1\"}], \"instruction\": \"This is an instruction\"}', '2022-12-26 17:22:56', '2022-12-26 17:22:56');

-- --------------------------------------------------------

--
-- Table structure for table `exam_instructions`
--

DROP TABLE IF EXISTS `exam_instructions`;
CREATE TABLE IF NOT EXISTS `exam_instructions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `exam_category_id` int NOT NULL,
  `instruction` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `exam_instructions`
--

INSERT INTO `exam_instructions` (`id`, `exam_category_id`, `instruction`) VALUES
(1, 1, 'instruction 1 from engineering '),
(2, 1, 'instruction 2 from engineering '),
(3, 1, 'instruction 3 from engineering '),
(4, 1, 'instruction 4 from engineering '),
(5, 2, 'instruction 1 from medical '),
(6, 2, 'instruction 2 from medical '),
(7, 3, 'instruction 1 from bank '),
(8, 3, 'instruction 2 from bank '),
(9, 3, 'instruction 3 from bank '),
(10, 3, 'instruction 4 from bank ');

-- --------------------------------------------------------

--
-- Table structure for table `exam_options`
--

DROP TABLE IF EXISTS `exam_options`;
CREATE TABLE IF NOT EXISTS `exam_options` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `exam_question_item_id` bigint UNSIGNED NOT NULL,
  `title` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `correct` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `exam_options_exam_question_item_id_foreign` (`exam_question_item_id`)
) ENGINE=MyISAM AUTO_INCREMENT=181 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `exam_options`
--

INSERT INTO `exam_options` (`id`, `exam_question_item_id`, `title`, `correct`, `created_at`, `updated_at`) VALUES
(1, 1, 'ans 1', 1, '2022-11-24 18:45:19', '2022-11-24 18:45:19'),
(2, 1, 'ans 2', 0, '2022-11-24 18:45:19', '2022-11-24 18:45:19'),
(3, 2, 'ans 1.2', 0, '2022-11-24 18:45:19', '2022-11-24 18:45:19'),
(4, 2, 'ans 2.2', 1, '2022-11-24 18:45:19', '2022-11-24 18:45:19'),
(5, 2, 'ans 2.3', 0, '2022-11-24 18:45:19', '2022-11-24 18:45:19'),
(6, 3, 'ans 2.1', 0, '2022-11-24 18:54:10', '2022-11-24 18:54:10'),
(7, 3, 'ans 2.2', 0, '2022-11-24 18:54:10', '2022-11-24 18:54:10'),
(8, 3, 'ans 2.3', 1, '2022-11-24 18:54:10', '2022-11-24 18:54:10'),
(9, 4, '6', 1, '2022-11-29 08:18:45', '2022-11-29 08:18:45'),
(10, 4, '5', 0, '2022-11-29 08:18:45', '2022-11-29 08:18:45'),
(11, 4, '-6', 0, '2022-11-29 08:18:45', '2022-11-29 08:18:45'),
(12, 5, '-4', 0, '2022-11-29 08:22:56', '2022-11-29 08:22:56'),
(13, 5, '5', 0, '2022-11-29 08:22:58', '2022-11-29 08:22:58'),
(14, 5, '4', 1, '2022-11-29 08:22:58', '2022-11-29 08:22:58'),
(15, 6, '2x', 0, '2022-11-29 08:25:56', '2022-11-29 08:25:56'),
(16, 6, 'x', 1, '2022-11-29 08:25:57', '2022-11-29 08:25:57'),
(17, 7, '5', 1, '2022-11-29 08:36:35', '2022-11-29 08:36:35'),
(18, 7, '-3', 0, '2022-11-29 08:36:35', '2022-11-29 08:36:35'),
(19, 8, '55', 0, '2022-11-29 08:36:35', '2022-11-29 08:36:35'),
(20, 8, '10', 0, '2022-11-29 08:36:35', '2022-11-29 08:36:35'),
(21, 8, '22', 1, '2022-11-29 08:36:35', '2022-11-29 08:36:35'),
(22, 9, '6', 0, '2022-11-29 14:36:25', '2022-11-29 14:36:25'),
(23, 9, '0', 1, '2022-11-29 14:36:25', '2022-11-29 14:36:25'),
(24, 10, '5', 0, '2022-11-29 14:36:25', '2022-11-29 14:36:25'),
(25, 10, '-9', 0, '2022-11-29 14:36:25', '2022-11-29 14:36:25'),
(26, 10, '22', 1, '2022-11-29 14:36:25', '2022-11-29 14:36:25'),
(27, 11, '22', 0, '2022-12-08 09:42:36', '2022-12-08 09:42:36'),
(28, 11, '23', 1, '2022-12-08 09:42:36', '2022-12-08 09:42:36'),
(29, 12, '5', 0, '2022-12-08 10:34:25', '2022-12-08 10:34:25'),
(30, 12, '4', 1, '2022-12-08 10:34:25', '2022-12-08 10:34:25'),
(31, 13, '8', 1, '2022-12-08 14:15:41', '2022-12-08 14:15:41'),
(32, 14, 'ans temp', 1, '2022-12-08 14:29:58', '2022-12-08 14:29:58'),
(33, 15, '58', 1, '2022-12-08 14:37:28', '2022-12-08 14:37:28'),
(34, 16, '5', 1, '2022-12-08 14:47:56', '2022-12-08 14:47:56'),
(35, 17, '5', 0, '2022-12-09 19:54:49', '2022-12-09 19:54:49'),
(36, 17, '8', 0, '2022-12-09 19:54:49', '2022-12-09 19:54:49'),
(37, 18, '10', 1, '2022-12-09 19:55:28', '2022-12-09 19:55:28'),
(38, 19, '+55', 1, '2022-12-09 19:56:32', '2022-12-09 19:56:32'),
(39, 19, '55', 1, '2022-12-09 19:56:32', '2022-12-09 19:56:32'),
(40, 19, '-55', 0, '2022-12-09 19:56:32', '2022-12-09 19:56:32'),
(41, 20, '5', 0, '2022-12-10 11:37:08', '2022-12-10 11:37:08'),
(42, 21, '-7', 1, '2022-12-10 11:37:08', '2022-12-10 11:37:08'),
(43, 22, '-19', 0, '2022-12-10 11:39:04', '2022-12-10 11:39:04'),
(44, 22, '19', 1, '2022-12-10 11:39:04', '2022-12-10 11:39:04'),
(45, 22, '+19', 1, '2022-12-10 11:39:04', '2022-12-10 11:39:04'),
(46, 23, '10', 1, '2022-12-10 11:39:04', '2022-12-10 11:39:04'),
(47, 24, '-3', 1, '2022-12-10 11:41:12', '2022-12-10 11:41:12'),
(48, 25, '-4', 1, '2022-12-10 11:41:12', '2022-12-10 11:41:12'),
(49, 26, '9', 1, '2022-12-10 11:41:12', '2022-12-10 11:41:12'),
(50, 27, '9', 1, '2022-12-12 10:25:55', '2022-12-12 10:25:55'),
(51, 27, '10', 0, '2022-12-12 10:25:55', '2022-12-12 10:25:55'),
(52, 27, '-9', 0, '2022-12-12 10:25:55', '2022-12-12 10:25:55'),
(53, 28, '10', 1, '2022-12-12 10:25:55', '2022-12-12 10:25:55'),
(54, 29, '20', 1, '2022-12-12 10:28:01', '2022-12-12 10:28:01'),
(55, 29, '-20', 0, '2022-12-12 10:28:01', '2022-12-12 10:28:01'),
(56, 29, '+20', 1, '2022-12-12 10:28:01', '2022-12-12 10:28:01'),
(57, 30, '3', 1, '2022-12-12 10:28:01', '2022-12-12 10:28:01'),
(58, 31, '5', 1, '2022-12-12 10:29:17', '2022-12-12 10:29:17'),
(59, 32, '-2', 1, '2022-12-12 10:29:17', '2022-12-12 10:29:17'),
(60, 33, '10', 1, '2022-12-13 09:40:53', '2022-12-13 09:40:53'),
(61, 34, '5', 1, '2022-12-13 09:40:53', '2022-12-13 09:40:53'),
(62, 34, '-5', 0, '2022-12-13 09:40:53', '2022-12-13 09:40:53'),
(63, 35, '+15', 1, '2022-12-13 09:42:26', '2022-12-13 09:42:26'),
(64, 35, '15', 1, '2022-12-13 09:42:26', '2022-12-13 09:42:26'),
(65, 35, '-15', 0, '2022-12-13 09:42:26', '2022-12-13 09:42:26'),
(66, 36, '4', 1, '2022-12-13 09:42:26', '2022-12-13 09:42:26'),
(67, 37, '30', 1, '2022-12-13 09:45:13', '2022-12-13 09:45:13'),
(68, 38, '5', 0, '2022-12-13 09:45:13', '2022-12-13 09:45:13'),
(69, 38, '10', 1, '2022-12-13 09:45:13', '2022-12-13 09:45:13'),
(70, 38, '20', 0, '2022-12-13 09:45:13', '2022-12-13 09:45:13'),
(71, 39, '-10', 0, '2022-12-13 09:45:13', '2022-12-13 09:45:13'),
(72, 39, '10', 1, '2022-12-13 09:45:13', '2022-12-13 09:45:13'),
(73, 39, '+10', 1, '2022-12-13 09:45:13', '2022-12-13 09:45:13'),
(74, 40, '0', 1, '2022-12-13 09:48:04', '2022-12-13 09:48:04'),
(75, 41, '12', 0, '2022-12-13 09:48:04', '2022-12-13 09:48:04'),
(76, 41, '22', 1, '2022-12-13 09:48:04', '2022-12-13 09:48:04'),
(77, 41, '222', 0, '2022-12-13 09:48:04', '2022-12-13 09:48:04'),
(78, 42, '10', 1, '2022-12-13 17:58:35', '2022-12-13 17:58:35'),
(79, 43, '-7', 0, '2022-12-13 17:58:35', '2022-12-13 17:58:35'),
(80, 43, '11', 1, '2022-12-13 17:58:35', '2022-12-13 17:58:35'),
(81, 43, '5', 0, '2022-12-13 17:58:35', '2022-12-13 17:58:35'),
(82, 44, '+15', 1, '2022-12-13 17:58:35', '2022-12-13 17:58:35'),
(83, 44, '-15', 0, '2022-12-13 17:58:35', '2022-12-13 17:58:35'),
(84, 44, '15', 1, '2022-12-13 17:58:35', '2022-12-13 17:58:35'),
(85, 45, '30', 1, '2022-12-13 17:59:42', '2022-12-13 17:59:42'),
(86, 46, '9', 1, '2022-12-13 18:02:22', '2022-12-13 18:02:22'),
(87, 47, '11', 0, '2022-12-13 18:02:22', '2022-12-13 18:02:22'),
(88, 47, '10', 1, '2022-12-13 18:02:22', '2022-12-13 18:02:22'),
(89, 48, '5', 1, '2022-12-13 18:02:22', '2022-12-13 18:02:22'),
(90, 49, '3', 1, '2022-12-13 18:04:18', '2022-12-13 18:04:18'),
(91, 50, '-6', 0, '2022-12-13 18:04:18', '2022-12-13 18:04:18'),
(92, 50, '6', 1, '2022-12-13 18:04:18', '2022-12-13 18:04:18'),
(93, 50, '5', 0, '2022-12-13 18:04:18', '2022-12-13 18:04:18'),
(94, 51, '11', 1, '2022-12-16 05:24:00', '2022-12-16 05:24:00'),
(95, 52, '-10', 0, '2022-12-16 05:24:00', '2022-12-16 05:24:00'),
(96, 52, '10', 1, '2022-12-16 05:24:00', '2022-12-16 05:24:00'),
(97, 53, '0', 1, '2022-12-16 05:24:00', '2022-12-16 05:24:00'),
(98, 54, '-4', 1, '2022-12-16 05:24:00', '2022-12-16 05:24:00'),
(99, 54, '4', 0, '2022-12-16 05:24:00', '2022-12-16 05:24:00'),
(100, 54, '-1(4)', 1, '2022-12-16 05:24:00', '2022-12-16 05:24:00'),
(101, 55, '15', 1, '2022-12-16 05:26:18', '2022-12-16 05:26:18'),
(102, 56, '7', 1, '2022-12-16 05:26:18', '2022-12-16 05:26:18'),
(103, 56, '5', 0, '2022-12-16 05:26:18', '2022-12-16 05:26:18'),
(104, 57, '5', 0, '2022-12-16 05:26:18', '2022-12-16 05:26:18'),
(105, 57, '0', 1, '2022-12-16 05:26:18', '2022-12-16 05:26:18'),
(106, 58, '5', 0, '2022-12-16 05:27:52', '2022-12-16 05:27:52'),
(107, 58, '3', 1, '2022-12-16 05:27:52', '2022-12-16 05:27:52'),
(108, 59, '12', 1, '2022-12-16 05:27:52', '2022-12-16 05:27:52'),
(109, 59, '-12', 0, '2022-12-16 05:27:52', '2022-12-16 05:27:52'),
(110, 59, '+12', 1, '2022-12-16 05:27:52', '2022-12-16 05:27:52'),
(111, 60, '-11', 0, '2022-12-19 09:15:11', '2022-12-19 09:15:11'),
(112, 60, '11', 1, '2022-12-19 09:15:11', '2022-12-19 09:15:11'),
(113, 61, '0', 1, '2022-12-19 09:15:11', '2022-12-19 09:15:11'),
(114, 62, '10', 1, '2022-12-19 09:15:11', '2022-12-19 09:15:11'),
(115, 62, '-10', 0, '2022-12-19 09:15:11', '2022-12-19 09:15:11'),
(116, 62, '+10', 1, '2022-12-19 09:15:11', '2022-12-19 09:15:11'),
(117, 63, '3', 1, '2022-12-19 09:15:11', '2022-12-19 09:15:11'),
(118, 64, '0', 1, '2022-12-19 09:15:11', '2022-12-19 09:15:11'),
(119, 64, '-1', 0, '2022-12-19 09:15:11', '2022-12-19 09:15:11'),
(120, 65, '7', 1, '2022-12-19 09:18:29', '2022-12-19 09:18:29'),
(121, 65, '2', 0, '2022-12-19 09:18:29', '2022-12-19 09:18:29'),
(122, 66, '0', 1, '2022-12-19 09:18:29', '2022-12-19 09:18:29'),
(123, 67, '30', 1, '2022-12-19 09:18:29', '2022-12-19 09:18:29'),
(124, 67, '-30', 0, '2022-12-19 09:18:29', '2022-12-19 09:18:29'),
(125, 67, '+30', 1, '2022-12-19 09:18:29', '2022-12-19 09:18:29'),
(126, 68, '10', 1, '2022-12-19 14:35:50', '2022-12-19 14:35:50'),
(127, 69, '10', 0, '2022-12-19 14:35:50', '2022-12-19 14:35:50'),
(128, 69, '18', 1, '2022-12-19 14:35:50', '2022-12-19 14:35:50'),
(129, 70, '10', 1, '2022-12-19 14:36:38', '2022-12-19 14:36:38'),
(130, 71, '10', 0, '2022-12-19 14:36:38', '2022-12-19 14:36:38'),
(131, 71, '18', 1, '2022-12-19 14:36:38', '2022-12-19 14:36:38'),
(132, 72, '10', 0, '2022-12-22 17:18:56', '2022-12-22 17:18:56'),
(133, 72, '5', 1, '2022-12-22 17:18:56', '2022-12-22 17:18:56'),
(134, 73, '1', 1, '2022-12-22 17:18:56', '2022-12-22 17:18:56'),
(135, 74, '+10', 1, '2022-12-22 17:18:56', '2022-12-22 17:18:56'),
(136, 74, '10', 1, '2022-12-22 17:18:56', '2022-12-22 17:18:56'),
(137, 74, '-10', 0, '2022-12-22 17:18:56', '2022-12-22 17:18:56'),
(138, 75, '12', 1, '2022-12-22 17:20:17', '2022-12-22 17:20:17'),
(139, 76, '6', 0, '2022-12-22 17:20:17', '2022-12-22 17:20:17'),
(140, 76, '4', 1, '2022-12-22 17:20:17', '2022-12-22 17:20:17'),
(141, 77, '10', 1, '2022-12-22 17:22:12', '2022-12-22 17:22:12'),
(142, 77, '-10', 0, '2022-12-22 17:22:12', '2022-12-22 17:22:12'),
(143, 77, '+10', 1, '2022-12-22 17:22:12', '2022-12-22 17:22:12'),
(144, 78, '16', 1, '2022-12-22 17:22:12', '2022-12-22 17:22:12'),
(145, 79, '18', 0, '2022-12-26 17:38:23', '2022-12-26 17:38:23'),
(146, 79, '20', 1, '2022-12-26 17:38:23', '2022-12-26 17:38:23'),
(147, 80, '10', 1, '2022-12-26 17:38:23', '2022-12-26 17:38:23'),
(148, 81, '-16', 0, '2022-12-26 17:38:23', '2022-12-26 17:38:23'),
(149, 81, '16', 1, '2022-12-26 17:38:23', '2022-12-26 17:38:23'),
(150, 82, '-20', 0, '2022-12-26 17:38:23', '2022-12-26 17:38:23'),
(151, 82, '20', 1, '2022-12-26 17:38:23', '2022-12-26 17:38:23'),
(152, 82, '+20', 1, '2022-12-26 17:38:23', '2022-12-26 17:38:23'),
(153, 83, '0', 1, '2022-12-26 17:38:23', '2022-12-26 17:38:23'),
(154, 84, '10', 1, '2022-12-26 17:57:09', '2023-01-02 14:32:20'),
(155, 85, '14', 1, '2022-12-26 18:00:48', '2022-12-26 18:00:48'),
(156, 85, '7', 0, '2022-12-26 18:00:48', '2022-12-26 18:00:48'),
(157, 86, '2', 1, '2022-12-26 18:00:48', '2022-12-29 16:37:18'),
(158, 87, '0', 1, '2022-12-26 19:03:41', '2023-01-02 14:34:15'),
(159, 88, '+10', 1, '2022-12-26 19:03:41', '2022-12-26 19:03:41'),
(160, 88, '-10', 0, '2022-12-26 19:03:41', '2022-12-26 19:03:41'),
(161, 88, '10', 1, '2022-12-26 19:03:41', '2022-12-26 19:03:41'),
(162, 89, '8', 1, '2022-12-26 19:15:36', '2022-12-29 09:13:23'),
(163, 90, '10', 0, '2022-12-26 19:15:36', '2022-12-26 19:15:36'),
(164, 90, '20', 1, '2022-12-26 19:15:36', '2022-12-26 19:15:36'),
(165, 91, '25', 1, '2022-12-26 19:15:36', '2022-12-26 19:15:36'),
(166, 92, '16', 1, '2022-12-28 14:39:26', '2022-12-28 14:39:26'),
(167, 93, '45', 0, '2022-12-28 14:41:02', '2022-12-28 14:41:02'),
(168, 93, '25', 1, '2022-12-28 14:41:02', '2022-12-28 14:41:02'),
(169, 94, '10', 1, '2022-12-28 18:23:31', '2022-12-28 18:23:31'),
(170, 95, '<p>65</p>', 1, '2022-12-28 18:54:16', '2022-12-28 20:18:00'),
(171, 96, '25', 1, '2022-12-28 20:21:28', '2022-12-28 20:57:10'),
(172, 97, '11', 1, '2022-12-29 08:17:12', '2022-12-29 08:17:12'),
(173, 97, '10', 0, '2022-12-29 08:17:12', '2022-12-29 08:17:12'),
(174, 98, '50', 1, '2022-12-29 16:45:17', '2022-12-29 16:45:17'),
(175, 98, '-50', 0, '2022-12-29 16:45:17', '2022-12-29 16:45:17'),
(176, 98, '+50', 1, '2022-12-29 16:45:17', '2022-12-29 16:45:17'),
(177, 99, '16', 1, '2022-12-29 16:48:02', '2022-12-29 16:48:02'),
(178, 100, '5', 1, '2022-12-29 16:48:02', '2022-12-29 16:48:27'),
(179, 100, '<p>-5</p>', 0, '2022-12-29 16:48:02', '2022-12-29 16:48:27'),
(180, 100, '<p>+5</p>', 1, '2022-12-29 16:48:02', '2022-12-29 16:48:27');

-- --------------------------------------------------------

--
-- Table structure for table `exam_questions`
--

DROP TABLE IF EXISTS `exam_questions`;
CREATE TABLE IF NOT EXISTS `exam_questions` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `exam_section_id` bigint UNSIGNED NOT NULL,
  `type` enum('paragraph','simple') COLLATE utf8mb4_unicode_ci NOT NULL,
  `level` enum('easy','medium','hard') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tag` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `instruction` longtext COLLATE utf8mb4_unicode_ci,
  `paragraph` longtext COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `exam_questions_exam_section_id_foreign` (`exam_section_id`)
) ENGINE=MyISAM AUTO_INCREMENT=105 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `exam_questions`
--

INSERT INTO `exam_questions` (`id`, `exam_section_id`, `type`, `level`, `tag`, `instruction`, `paragraph`, `created_at`, `updated_at`) VALUES
(1, 1, 'simple', NULL, 'question 1', 'this is question 2', 'paragrach 2', NULL, NULL),
(2, 1, 'simple', NULL, 'question 2', 'lorem 2', 'this is questions 2', NULL, NULL),
(3, 306, 'simple', NULL, NULL, NULL, NULL, '2022-11-24 18:45:18', '2022-11-24 18:45:18'),
(4, 306, 'simple', NULL, NULL, NULL, NULL, '2022-11-24 18:45:19', '2022-11-24 18:45:19'),
(5, 307, 'simple', NULL, NULL, NULL, NULL, '2022-11-24 18:54:10', '2022-11-24 18:54:10'),
(6, 312, 'simple', NULL, NULL, NULL, NULL, '2022-11-29 08:18:44', '2022-11-29 08:18:44'),
(7, 313, 'simple', NULL, NULL, NULL, NULL, '2022-11-29 08:22:56', '2022-11-29 08:22:56'),
(21, 321, 'simple', NULL, NULL, NULL, NULL, '2022-12-09 19:54:48', '2022-12-09 19:54:48'),
(9, 313, 'simple', NULL, NULL, NULL, NULL, '2022-11-29 08:36:35', '2022-11-29 08:36:35'),
(10, 313, 'simple', NULL, NULL, NULL, NULL, '2022-11-29 08:36:35', '2022-11-29 08:36:35'),
(11, 312, 'simple', NULL, NULL, NULL, NULL, '2022-11-29 14:36:25', '2022-11-29 14:36:25'),
(12, 312, 'simple', NULL, NULL, NULL, NULL, '2022-11-29 14:36:25', '2022-11-29 14:36:25'),
(18, 314, 'simple', NULL, NULL, NULL, NULL, '2022-12-08 14:29:58', '2022-12-08 14:29:58'),
(20, 314, 'simple', NULL, NULL, NULL, NULL, '2022-12-08 14:47:56', '2022-12-08 14:47:56'),
(19, 314, 'simple', NULL, NULL, NULL, NULL, '2022-12-08 14:37:28', '2022-12-08 14:37:28'),
(22, 322, 'simple', NULL, NULL, NULL, NULL, '2022-12-09 19:55:27', '2022-12-09 19:55:27'),
(23, 323, 'simple', NULL, NULL, NULL, NULL, '2022-12-09 19:56:32', '2022-12-09 19:56:32'),
(24, 324, 'simple', NULL, NULL, NULL, NULL, '2022-12-10 11:37:08', '2022-12-10 11:37:08'),
(25, 324, 'simple', NULL, NULL, NULL, NULL, '2022-12-10 11:37:08', '2022-12-10 11:37:08'),
(26, 325, 'simple', NULL, NULL, NULL, NULL, '2022-12-10 11:39:04', '2022-12-10 11:39:04'),
(27, 325, 'simple', NULL, NULL, NULL, NULL, '2022-12-10 11:39:04', '2022-12-10 11:39:04'),
(28, 326, 'simple', NULL, NULL, NULL, NULL, '2022-12-10 11:41:12', '2022-12-10 11:41:12'),
(29, 326, 'simple', NULL, NULL, NULL, NULL, '2022-12-10 11:41:12', '2022-12-10 11:41:12'),
(30, 326, 'simple', NULL, NULL, NULL, NULL, '2022-12-10 11:41:12', '2022-12-10 11:41:12'),
(31, 327, 'simple', NULL, NULL, NULL, NULL, '2022-12-12 10:25:55', '2022-12-12 10:25:55'),
(32, 327, 'simple', NULL, NULL, NULL, NULL, '2022-12-12 10:25:55', '2022-12-12 10:25:55'),
(33, 328, 'simple', NULL, NULL, NULL, NULL, '2022-12-12 10:28:01', '2022-12-12 10:28:01'),
(34, 328, 'simple', NULL, NULL, NULL, NULL, '2022-12-12 10:28:01', '2022-12-12 10:28:01'),
(35, 329, 'simple', NULL, NULL, NULL, NULL, '2022-12-12 10:29:17', '2022-12-12 10:29:17'),
(36, 329, 'simple', NULL, NULL, NULL, NULL, '2022-12-12 10:29:17', '2022-12-12 10:29:17'),
(37, 330, 'simple', NULL, NULL, NULL, NULL, '2022-12-13 09:40:53', '2022-12-13 09:40:53'),
(38, 330, 'simple', NULL, NULL, NULL, NULL, '2022-12-13 09:40:53', '2022-12-13 09:40:53'),
(39, 330, 'simple', NULL, NULL, NULL, NULL, '2022-12-13 09:42:26', '2022-12-13 09:42:26'),
(40, 330, 'simple', NULL, NULL, NULL, NULL, '2022-12-13 09:42:26', '2022-12-13 09:42:26'),
(41, 331, 'simple', NULL, NULL, NULL, NULL, '2022-12-13 09:45:13', '2022-12-13 09:45:13'),
(42, 331, 'simple', NULL, NULL, NULL, NULL, '2022-12-13 09:45:13', '2022-12-13 09:45:13'),
(43, 331, 'simple', NULL, NULL, NULL, NULL, '2022-12-13 09:45:13', '2022-12-13 09:45:13'),
(44, 332, 'simple', NULL, NULL, NULL, NULL, '2022-12-13 09:48:04', '2022-12-13 09:48:04'),
(45, 332, 'simple', NULL, NULL, NULL, NULL, '2022-12-13 09:48:04', '2022-12-13 09:48:04'),
(46, 333, 'simple', NULL, NULL, NULL, NULL, '2022-12-13 17:58:35', '2022-12-13 17:58:35'),
(47, 333, 'simple', NULL, NULL, NULL, NULL, '2022-12-13 17:58:35', '2022-12-13 17:58:35'),
(48, 333, 'simple', NULL, NULL, NULL, NULL, '2022-12-13 17:58:35', '2022-12-13 17:58:35'),
(49, 333, 'simple', NULL, NULL, NULL, NULL, '2022-12-13 17:59:42', '2022-12-13 17:59:42'),
(50, 334, 'simple', NULL, NULL, NULL, NULL, '2022-12-13 18:02:22', '2022-12-13 18:02:22'),
(51, 334, 'simple', NULL, NULL, NULL, NULL, '2022-12-13 18:02:22', '2022-12-13 18:02:22'),
(52, 334, 'simple', NULL, NULL, NULL, NULL, '2022-12-13 18:02:22', '2022-12-13 18:02:22'),
(53, 335, 'simple', NULL, NULL, NULL, NULL, '2022-12-13 18:04:18', '2022-12-13 18:04:18'),
(54, 335, 'simple', NULL, NULL, NULL, NULL, '2022-12-13 18:04:18', '2022-12-13 18:04:18'),
(55, 336, 'simple', NULL, NULL, NULL, NULL, '2022-12-16 05:24:00', '2022-12-16 05:24:00'),
(56, 336, 'simple', NULL, NULL, NULL, NULL, '2022-12-16 05:24:00', '2022-12-16 05:24:00'),
(57, 336, 'simple', NULL, NULL, NULL, NULL, '2022-12-16 05:24:00', '2022-12-16 05:24:00'),
(58, 336, 'simple', NULL, NULL, NULL, NULL, '2022-12-16 05:24:00', '2022-12-16 05:24:00'),
(59, 337, 'simple', NULL, NULL, NULL, NULL, '2022-12-16 05:26:18', '2022-12-16 05:26:18'),
(60, 337, 'simple', NULL, NULL, NULL, NULL, '2022-12-16 05:26:18', '2022-12-16 05:26:18'),
(61, 337, 'simple', NULL, NULL, NULL, NULL, '2022-12-16 05:26:18', '2022-12-16 05:26:18'),
(62, 338, 'simple', NULL, NULL, NULL, NULL, '2022-12-16 05:27:52', '2022-12-16 05:27:52'),
(63, 338, 'simple', NULL, NULL, NULL, NULL, '2022-12-16 05:27:52', '2022-12-16 05:27:52'),
(64, 339, 'simple', NULL, NULL, NULL, NULL, '2022-12-19 09:15:11', '2022-12-19 09:15:11'),
(65, 339, 'simple', NULL, NULL, NULL, NULL, '2022-12-19 09:15:11', '2022-12-19 09:15:11'),
(66, 339, 'simple', NULL, NULL, NULL, NULL, '2022-12-19 09:15:11', '2022-12-19 09:15:11'),
(67, 339, 'simple', NULL, NULL, NULL, NULL, '2022-12-19 09:15:11', '2022-12-19 09:15:11'),
(68, 339, 'simple', NULL, NULL, NULL, NULL, '2022-12-19 09:15:11', '2022-12-19 09:15:11'),
(69, 340, 'simple', NULL, NULL, NULL, NULL, '2022-12-19 09:18:29', '2022-12-19 09:18:29'),
(70, 340, 'simple', NULL, NULL, NULL, NULL, '2022-12-19 09:18:29', '2022-12-19 09:18:29'),
(71, 340, 'simple', NULL, NULL, NULL, NULL, '2022-12-19 09:18:29', '2022-12-19 09:18:29'),
(72, 341, 'simple', NULL, NULL, NULL, NULL, '2022-12-19 14:35:50', '2022-12-19 14:35:50'),
(73, 341, 'simple', NULL, NULL, NULL, NULL, '2022-12-19 14:35:50', '2022-12-19 14:35:50'),
(74, 341, 'simple', NULL, NULL, NULL, NULL, '2022-12-19 14:36:38', '2022-12-19 14:36:38'),
(75, 341, 'simple', NULL, NULL, NULL, NULL, '2022-12-19 14:36:38', '2022-12-19 14:36:38'),
(76, 342, 'simple', NULL, NULL, NULL, NULL, '2022-12-22 17:18:56', '2022-12-22 17:18:56'),
(77, 342, 'simple', NULL, NULL, NULL, NULL, '2022-12-22 17:18:56', '2022-12-22 17:18:56'),
(78, 342, 'simple', NULL, NULL, NULL, NULL, '2022-12-22 17:18:56', '2022-12-22 17:18:56'),
(79, 343, 'simple', NULL, NULL, NULL, NULL, '2022-12-22 17:20:17', '2022-12-22 17:20:17'),
(80, 343, 'simple', NULL, NULL, NULL, NULL, '2022-12-22 17:20:17', '2022-12-22 17:20:17'),
(81, 344, 'simple', NULL, NULL, NULL, NULL, '2022-12-22 17:22:12', '2022-12-22 17:22:12'),
(82, 344, 'simple', NULL, NULL, NULL, NULL, '2022-12-22 17:22:12', '2022-12-22 17:22:12'),
(83, 345, 'simple', NULL, NULL, NULL, NULL, '2022-12-26 17:38:23', '2022-12-26 17:38:23'),
(84, 345, 'simple', NULL, NULL, NULL, NULL, '2022-12-26 17:38:23', '2022-12-26 17:38:23'),
(85, 345, 'simple', NULL, NULL, NULL, NULL, '2022-12-26 17:38:23', '2022-12-26 17:38:23'),
(86, 345, 'simple', NULL, NULL, NULL, NULL, '2022-12-26 17:38:23', '2022-12-26 17:38:23'),
(87, 345, 'simple', NULL, NULL, NULL, NULL, '2022-12-26 17:38:23', '2022-12-26 17:38:23'),
(88, 345, 'simple', NULL, NULL, NULL, NULL, '2022-12-26 17:57:09', '2022-12-26 17:57:09'),
(89, 346, 'simple', NULL, NULL, NULL, NULL, '2022-12-26 18:00:48', '2022-12-26 18:00:48'),
(90, 346, 'simple', NULL, NULL, NULL, NULL, '2022-12-26 18:00:48', '2022-12-26 18:00:48'),
(91, 346, 'simple', NULL, NULL, NULL, NULL, '2022-12-26 19:03:41', '2022-12-26 19:03:41'),
(92, 346, 'simple', NULL, NULL, NULL, NULL, '2022-12-26 19:03:41', '2022-12-26 19:03:41'),
(93, 347, 'simple', NULL, NULL, NULL, NULL, '2022-12-26 19:15:36', '2022-12-26 19:15:36'),
(98, 347, 'simple', NULL, NULL, NULL, NULL, '2022-12-28 18:23:31', '2022-12-28 18:23:31'),
(95, 347, 'simple', NULL, NULL, NULL, NULL, '2022-12-26 19:15:36', '2022-12-26 19:15:36'),
(96, 347, 'simple', NULL, NULL, NULL, NULL, '2022-12-28 14:39:26', '2022-12-28 14:39:26'),
(97, 347, 'simple', NULL, NULL, NULL, NULL, '2022-12-28 14:41:02', '2022-12-28 14:41:02'),
(100, 347, 'simple', NULL, NULL, NULL, NULL, '2022-12-28 20:21:28', '2022-12-28 20:21:28'),
(102, 345, 'simple', NULL, NULL, NULL, NULL, '2022-12-29 16:45:17', '2022-12-29 16:45:17'),
(103, 346, 'simple', NULL, NULL, NULL, NULL, '2022-12-29 16:48:02', '2022-12-29 16:48:02'),
(104, 346, 'simple', NULL, NULL, NULL, NULL, '2022-12-29 16:48:02', '2022-12-29 16:48:02');

-- --------------------------------------------------------

--
-- Table structure for table `exam_question_items`
--

DROP TABLE IF EXISTS `exam_question_items`;
CREATE TABLE IF NOT EXISTS `exam_question_items` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `exam_question_id` bigint UNSIGNED NOT NULL,
  `level` enum('easy','medium','hard') COLLATE utf8mb4_unicode_ci NOT NULL,
  `tag` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `question` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `answer_type` enum('single','multiple','numeric') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `answer_explanation` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `mark` double(8,2) NOT NULL,
  `negative_mark` double(8,2) NOT NULL,
  `is_first_item` tinyint(1) NOT NULL DEFAULT '0',
  `is_required` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `exam_question_items_exam_question_id_foreign` (`exam_question_id`)
) ENGINE=MyISAM AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `exam_question_items`
--

INSERT INTO `exam_question_items` (`id`, `exam_question_id`, `level`, `tag`, `question`, `answer_type`, `answer_explanation`, `mark`, `negative_mark`, `is_first_item`, `is_required`, `created_at`, `updated_at`) VALUES
(1, 3, 'easy', 'tag 1', '<p>auestion 1.1</p>', 'single', '<p>explanation here</p>', 200.00, 5.02, 1, NULL, '2022-11-24 18:45:19', '2022-11-24 18:45:19'),
(2, 4, 'easy', 'tag 1', '<p>question 1.2</p>', 'single', '<p>explanation here</p>', 200.00, 0.98, 1, NULL, '2022-11-24 18:45:19', '2022-11-24 18:45:19'),
(3, 5, 'easy', 'tag 1', '<p>question 2.1</p>', 'single', '<p>some explanation </p>', 200.00, 20.00, 1, NULL, '2022-11-24 18:54:10', '2022-11-24 18:54:10'),
(4, 6, 'easy', 'tag 1', '<p>1+5</p>', 'single', '<p>here is explanation</p>', 0.00, 0.00, 1, NULL, '2022-11-29 08:18:45', '2022-11-29 08:18:45'),
(5, 7, 'easy', 'tag 1', '<p>2<sup>2</sup>+1-1</p>', 'single', '<p>some explanations here</p>', 0.00, 0.00, 1, NULL, '2022-11-29 08:22:56', '2022-11-29 08:22:56'),
(6, 8, 'easy', 'tag 1', '<p>x<sup>2</sup>+2x-1=0</p>', 'single', '<p>explanation </p>', 0.00, 0.00, 1, NULL, '2022-11-29 08:25:56', '2022-11-29 08:25:56'),
(7, 9, 'medium', 'tag 1', '<p>5*8+6</p>', 'single', '<p>some explanation </p>', 0.00, 0.00, 1, NULL, '2022-11-29 08:36:35', '2022-11-29 08:36:35'),
(8, 10, 'hard', 'tag 1', '<p>5<sup>8</sup>*5+9*55+6-6</p>', 'single', '<p>some explanation </p>', 15.00, 5.00, 1, NULL, '2022-11-29 08:36:35', '2022-11-29 08:36:35'),
(9, 11, 'easy', 'tag 1', '<p>1+6+9</p>', 'single', '<p>lorem</p>', 0.00, 0.00, 1, NULL, '2022-11-29 14:36:25', '2022-11-29 14:36:25'),
(10, 12, 'easy', 'tag 1', '<p>9+9+5</p>', 'single', '<p>lorem</p>', 10.00, 3.00, 1, NULL, '2022-11-29 14:36:25', '2022-11-29 14:36:25'),
(11, 13, 'easy', 'tag 1', '<p>8+9+6</p>', 'single', '<p>explain</p>', 12.00, 7.00, 1, NULL, '2022-12-08 09:42:36', '2022-12-08 09:42:36'),
(12, 16, 'easy', 'tag 1', '<p>question temp</p>', 'single', '<p>hjhjhjhj</p>', 12.00, 7.00, 1, NULL, '2022-12-08 10:34:25', '2022-12-08 10:34:25'),
(13, 17, 'easy', 'tag 1', '<p>5+5-2</p>', 'numeric', '<p>only one answer</p>', 12.00, 7.00, 1, NULL, '2022-12-08 14:15:41', '2022-12-08 14:15:41'),
(14, 18, 'easy', 'tag 1', '<p>question temp</p>', 'numeric', '<p>expl</p>', 12.00, 7.00, 1, NULL, '2022-12-08 14:29:58', '2022-12-08 14:29:58'),
(15, 19, 'easy', 'tag 1', '<p>question test</p>', 'numeric', '<p>lorem</p>', 12.00, 7.00, 1, NULL, '2022-12-08 14:37:28', '2022-12-08 14:37:28'),
(16, 20, 'easy', 'tag 1', '<p>hjhjhjjh</p>', 'numeric', '<p>kkllk</p>', 12.00, 7.00, 1, NULL, '2022-12-08 14:47:56', '2022-12-08 14:47:56'),
(17, 21, 'easy', 'tag 1', '<p>8+2-2</p>', 'single', '<p>lorem</p>', 10.00, 2.00, 1, NULL, '2022-12-09 19:54:48', '2022-12-09 19:54:48'),
(18, 22, 'easy', 'tag 1', '<p>10+5-5</p>', 'numeric', '<p>lorem</p>', 50.00, 1.00, 1, NULL, '2022-12-09 19:55:28', '2022-12-09 19:55:28'),
(19, 23, 'easy', 'tag 1', '<p>55-5+5</p>', 'multiple', '<p>lorem</p>', 25.00, 2.00, 1, NULL, '2022-12-09 19:56:32', '2022-12-09 19:56:32'),
(20, 24, 'easy', 'tag 1', '<p>1 apple +  2 apple</p>', 'single', '<p>lorem</p>', 10.00, 1.00, 1, NULL, '2022-12-10 11:37:08', '2022-12-10 11:37:08'),
(21, 25, 'easy', 'tag 1', '<p>2-9</p>', 'numeric', '<p>lorem</p>', 10.00, 1.00, 1, NULL, '2022-12-10 11:37:08', '2022-12-10 11:37:08'),
(22, 26, 'easy', 'tag 1', '<p>9+10</p>', 'multiple', '<p>lorem</p>', 20.00, 1.00, 1, NULL, '2022-12-10 11:39:04', '2022-12-10 11:39:04'),
(23, 27, 'easy', 'tag 1', '<p>5+5</p>', 'numeric', '<p>lorem</p>', 20.00, 1.00, 1, NULL, '2022-12-10 11:39:04', '2022-12-10 11:39:04'),
(24, 28, 'easy', 'tag 1', '<p>-5+2</p>', 'numeric', '<p>lorem</p>', 30.00, 2.00, 1, NULL, '2022-12-10 11:41:12', '2022-12-10 11:41:12'),
(25, 29, 'easy', 'tag 1', '<p>-2-2</p>', 'numeric', '<p>lorem</p>', 30.00, 2.00, 1, NULL, '2022-12-10 11:41:12', '2022-12-10 11:41:12'),
(26, 30, 'easy', 'tag 1', '<p>9-0</p>', 'numeric', '<p>lorem</p>', 30.00, 2.00, 1, NULL, '2022-12-10 11:41:12', '2022-12-10 11:41:12'),
(27, 31, 'easy', 'tag 1', '<p>9+10-10</p>', 'single', '<p>lorem</p>', 10.00, 3.00, 1, NULL, '2022-12-12 10:25:55', '2022-12-12 10:25:55'),
(28, 32, 'easy', 'tag 1', '<p>5+5</p>', 'numeric', '<p>lorem</p>', 10.00, 3.00, 1, NULL, '2022-12-12 10:25:55', '2022-12-12 10:25:55'),
(29, 33, 'easy', 'tag 1', '<p>40-20</p>', 'multiple', '<p>lorem</p>', 15.00, 5.00, 1, NULL, '2022-12-12 10:28:01', '2022-12-12 10:28:01'),
(30, 34, 'easy', 'tag 1', '<p>1 apple + 2 apples</p>', 'numeric', '<p>lorem</p>', 15.00, 5.00, 1, NULL, '2022-12-12 10:28:01', '2022-12-12 10:28:01'),
(31, 35, 'easy', 'tag 1', '<p>5-5+5</p>', 'numeric', '<p>lorem</p>', 12.00, 7.00, 1, NULL, '2022-12-12 10:29:17', '2022-12-12 10:29:17'),
(32, 36, 'easy', 'tag 1', '<p>-2-2+2</p>', 'numeric', '<p>lorem</p>', 12.00, 7.00, 1, NULL, '2022-12-12 10:29:17', '2022-12-12 10:29:17'),
(33, 37, 'easy', 'tag 1', '<p>5+5</p>', 'numeric', '<p>lorem</p>', 10.00, 2.00, 1, NULL, '2022-12-13 09:40:53', '2022-12-13 09:40:53'),
(34, 38, 'easy', 'tag 1', '<p>5+5-5</p>', 'single', '<p>lorem</p>', 10.00, 2.00, 1, NULL, '2022-12-13 09:40:53', '2022-12-13 09:40:53'),
(35, 39, 'easy', 'tag 1', '<p>5-0+10</p>', 'multiple', '<p>lorem</p>', 10.00, 2.00, 1, NULL, '2022-12-13 09:42:26', '2022-12-13 09:42:26'),
(36, 40, 'easy', 'tag 1', '<p>2*2</p>', 'numeric', '<p>lorem</p>', 10.00, 2.00, 1, NULL, '2022-12-13 09:42:26', '2022-12-13 09:42:26'),
(37, 41, 'easy', 'tag 1', '<p>10+20</p>', 'numeric', '<p>lorem</p>', 50.00, 1.00, 1, NULL, '2022-12-13 09:45:13', '2022-12-13 09:45:13'),
(38, 42, 'easy', 'tag 1', '<p>5+5</p>', 'single', '<p>lorem</p>', 50.00, 1.00, 1, NULL, '2022-12-13 09:45:13', '2022-12-13 09:45:13'),
(39, 43, 'easy', 'tag 1', '<p>5+10</p>', 'multiple', '<p>lorem</p>', 50.00, 1.00, 1, NULL, '2022-12-13 09:45:13', '2022-12-13 09:45:13'),
(40, 44, 'easy', 'tag 1', '<p>+10-10</p>', 'numeric', '<p>lorem</p>', 25.00, 2.00, 1, NULL, '2022-12-13 09:48:04', '2022-12-13 09:48:04'),
(41, 45, 'easy', 'tag 1', '<p>10+12</p>', 'single', '<p>lorem</p>', 25.00, 2.00, 1, NULL, '2022-12-13 09:48:04', '2022-12-13 09:48:04'),
(42, 46, 'easy', 'tag 1', '<p>5+5</p>', 'numeric', '<p>lorem</p>', 10.00, 1.00, 1, NULL, '2022-12-13 17:58:35', '2022-12-13 17:58:35'),
(43, 47, 'easy', 'tag 1', '<p>5+6</p>', 'single', '<p>lorem</p>', 10.00, 1.00, 1, NULL, '2022-12-13 17:58:35', '2022-12-13 17:58:35'),
(44, 48, 'easy', 'tag 1', '<p>-10+15</p>', 'multiple', '<p>lorem</p>', 10.00, 1.00, 1, NULL, '2022-12-13 17:58:35', '2022-12-13 17:58:35'),
(45, 49, 'easy', 'tag 1', '<p>5*6</p>', 'numeric', '<p>lorem</p>', 10.00, 1.00, 1, NULL, '2022-12-13 17:59:42', '2022-12-13 17:59:42'),
(46, 50, 'easy', 'tag 1', '<p>3*3</p>', 'numeric', '<p>lorem</p>', 20.00, 1.00, 1, NULL, '2022-12-13 18:02:22', '2022-12-13 18:02:22'),
(47, 51, 'easy', 'tag 1', '<p>5+5</p>', 'single', '<p>lorem</p>', 20.00, 1.00, 1, NULL, '2022-12-13 18:02:22', '2022-12-13 18:02:22'),
(48, 52, 'easy', 'tag 1', '<p>5+0</p>', 'numeric', '<p>lorem</p>', 20.00, 1.00, 1, NULL, '2022-12-13 18:02:22', '2022-12-13 18:02:22'),
(49, 53, 'easy', 'tag 1', '<p>3-0</p>', 'numeric', '<p>lorem</p>', 30.00, 2.00, 1, NULL, '2022-12-13 18:04:18', '2022-12-13 18:04:18'),
(50, 54, 'easy', 'tag 1', '<p>5+1</p>', 'single', '<p>lorem</p>', 30.00, 2.00, 1, NULL, '2022-12-13 18:04:18', '2022-12-13 18:04:18'),
(51, 55, 'easy', 'tag 1', '<p>5+6</p>', 'numeric', '<p>lorem</p>', 10.00, 1.00, 1, '1', '2022-12-16 05:24:00', '2022-12-16 05:24:00'),
(52, 56, 'easy', 'tag 1', '<p>5+5</p>', 'single', '<p>lorem</p>', 10.00, 1.00, 1, '0', '2022-12-16 05:24:00', '2022-12-16 05:24:00'),
(53, 57, 'easy', 'tag 1', '<p>-10+10</p>', 'numeric', '<p>lorem</p>', 10.00, 1.00, 1, '1', '2022-12-16 05:24:00', '2022-12-16 05:24:00'),
(54, 58, 'easy', 'tag 1', '<p>6-10</p>', 'multiple', '<p>lorem</p>', 10.00, 1.00, 1, '0', '2022-12-16 05:24:00', '2022-12-16 05:24:00'),
(55, 59, 'easy', 'tag 1', '<p>9+6</p>', 'numeric', '<p>lorem</p>', 20.00, 1.00, 1, '1', '2022-12-16 05:26:18', '2022-12-16 05:26:18'),
(56, 60, 'easy', 'tag 1', '<p>5+2</p>', 'single', '<p>lorem</p>', 20.00, 1.00, 1, '0', '2022-12-16 05:26:18', '2022-12-16 05:26:18'),
(57, 61, 'easy', 'tag 1', '<p>0*5</p>', 'single', '<p>lorem</p>', 20.00, 1.00, 1, '1', '2022-12-16 05:26:18', '2022-12-16 05:26:18'),
(58, 62, 'easy', 'tag 1', '<p>2+1</p>', 'single', '<p>lorem</p>', 30.00, 2.00, 1, '0', '2022-12-16 05:27:52', '2022-12-16 05:27:52'),
(59, 63, 'easy', 'tag 1', '<p>10+2</p>', 'multiple', '<p>lorem</p>', 30.00, 2.00, 1, '1', '2022-12-16 05:27:52', '2022-12-16 05:27:52'),
(60, 64, 'easy', 'tag 1', '<p>5+6</p>', 'single', '<p>lorem</p>', 10.00, 1.00, 1, '1', '2022-12-19 09:15:11', '2022-12-19 09:15:11'),
(61, 65, 'easy', 'tag 1', '<p>+10-10</p>', 'numeric', '<p>lorem</p>', 10.00, 1.00, 1, '0', '2022-12-19 09:15:11', '2022-12-19 09:15:11'),
(62, 66, 'easy', 'tag 1', '<p>-10-20+40</p>', 'multiple', '<p>lorem</p>', 10.00, 1.00, 1, '0', '2022-12-19 09:15:11', '2022-12-19 09:15:11'),
(63, 67, 'easy', 'tag 1', '<p>1+2</p>', 'numeric', '<p>lorem</p>', 10.00, 1.00, 1, '0', '2022-12-19 09:15:11', '2022-12-19 09:15:11'),
(64, 68, 'easy', 'tag 1', '<p>-1+1</p>', 'single', '<p>lorem</p>', 10.00, 1.00, 1, '1', '2022-12-19 09:15:11', '2022-12-19 09:15:11'),
(65, 69, 'easy', 'tag 1', '<p>5+2</p>', 'single', '<p>lorem</p>', 20.00, 1.00, 1, '0', '2022-12-19 09:18:29', '2022-12-19 09:18:29'),
(66, 70, 'easy', 'tag 1', '<p>5-5</p>', 'numeric', '<p>lorem</p>', 20.00, 1.00, 1, '1', '2022-12-19 09:18:29', '2022-12-19 09:18:29'),
(67, 71, 'easy', 'tag 1', '<p>5*6</p>', 'multiple', '<p>lorem</p>', 20.00, 1.00, 1, '0', '2022-12-19 09:18:29', '2022-12-19 09:18:29'),
(68, 72, 'easy', 'tag 1', '<p>5+5</p>', 'numeric', '<p>lorem</p>', 30.00, 2.00, 1, '1', '2022-12-19 14:35:50', '2022-12-19 14:35:50'),
(69, 73, 'easy', 'tag 1', '<p>9+9</p>', 'single', '<p>lorem</p>', 30.00, 2.00, 1, '0', '2022-12-19 14:35:50', '2022-12-19 14:35:50'),
(70, 74, 'easy', 'tag 1', '<p>5+5</p>', 'numeric', '<p>lorem</p>', 30.00, 2.00, 1, '1', '2022-12-19 14:36:38', '2022-12-19 14:36:38'),
(71, 75, 'easy', 'tag 1', '<p>9+9</p>', 'single', '<p>lorem</p>', 30.00, 2.00, 1, '0', '2022-12-19 14:36:38', '2022-12-19 14:36:38'),
(72, 76, 'easy', 'tag 1', '<p>5+5</p>', 'single', '<p>lorem</p>', 10.00, 2.00, 1, '1', '2022-12-22 17:18:56', '2022-12-22 17:18:56'),
(73, 77, 'medium', 'tag 1', '<p>0+1</p>', 'numeric', '<p>lorem</p>', 10.00, 2.00, 1, '0', '2022-12-22 17:18:56', '2022-12-22 17:18:56'),
(74, 78, 'hard', 'tag 1', '<p>10+10</p>', 'multiple', '<p>lorem</p>', 10.00, 2.00, 1, '1', '2022-12-22 17:18:56', '2022-12-22 17:18:56'),
(75, 79, 'medium', 'tag 1', '<p>6+6</p>', 'single', '<p>lorem</p>', 50.00, 1.00, 1, '1', '2022-12-22 17:20:17', '2022-12-22 17:20:17'),
(76, 80, 'easy', 'tag 1', '<p>2+2</p>', 'single', '<p>lorem</p>', 50.00, 1.00, 1, '1', '2022-12-22 17:20:17', '2022-12-22 17:20:17'),
(77, 81, 'hard', 'tag 1', '<p>5+5</p>', 'multiple', '<p>lorem</p>', 25.00, 2.00, 1, '1', '2022-12-22 17:22:12', '2022-12-22 17:22:12'),
(78, 82, 'medium', 'tag 1', '<p>8+8</p>', 'numeric', '<p>lorem</p>', 25.00, 2.00, 1, '1', '2022-12-22 17:22:12', '2022-12-22 17:22:12'),
(79, 83, 'medium', 'tag 1', '<p>9+9+2</p>', 'single', '<p>lorem</p>', 10.00, 2.00, 1, '1', '2022-12-26 17:38:23', '2022-12-26 17:38:23'),
(80, 84, 'medium', 'tag 1', '<p>5+5</p>', 'numeric', '<p>lorem</p>', 10.00, 2.00, 1, '0', '2022-12-26 17:38:23', '2022-12-26 17:38:23'),
(81, 85, 'easy', 'tag 1', '<p>8+8</p>', 'single', '<p>lorem</p>', 10.00, 2.00, 1, '1', '2022-12-26 17:38:23', '2022-12-26 17:38:23'),
(82, 86, 'hard', 'tag 1', '<p>10+10</p>', 'multiple', '<p>lorem</p>', 10.00, 2.00, 1, '0', '2022-12-26 17:38:23', '2022-12-26 17:38:23'),
(83, 87, 'easy', 'tag 1', '<p>1-1</p>', 'numeric', '<p>lorem</p>', 10.00, 2.00, 1, '1', '2022-12-26 17:38:23', '2022-12-26 17:38:23'),
(84, 88, 'hard', 'tag 1', '<p>8+2-2+2-2+2</p>', 'numeric', '<p>lorem</p>', 10.00, 2.00, 1, '0', '2022-12-26 17:57:09', '2023-01-02 14:32:20'),
(85, 89, 'easy', 'tag 1', '<p>7+7</p>', 'single', '<p>lorem</p>', 50.00, 1.00, 1, '1', '2022-12-26 18:00:48', '2022-12-26 18:00:48'),
(86, 90, 'hard', 'tag 1', '<p>2+0-0</p>', 'numeric', '<p>lorem</p>', 50.00, 1.00, 1, '0', '2022-12-26 18:00:48', '2022-12-29 16:37:18'),
(87, 91, 'easy', 'tag 1', '<p>2*0*2</p>', 'numeric', '<p>lorem</p>', 50.00, 1.00, 1, '1', '2022-12-26 19:03:41', '2023-01-02 14:34:15'),
(88, 92, 'medium', 'tag 1', '<p>5+5</p>', 'multiple', '<p>lorem</p>', 50.00, 1.00, 1, '0', '2022-12-26 19:03:41', '2022-12-26 19:03:41'),
(89, 93, 'easy', 'tag 1', '<p>8+8-8</p>', 'numeric', '<p>lorem</p>', 25.00, 2.00, 1, '1', '2022-12-26 19:15:36', '2022-12-29 09:13:23'),
(90, 94, 'easy', 'tag 1', '<p>10+10</p>', 'single', '<p>lorem</p>', 25.00, 2.00, 1, '1', '2022-12-26 19:15:36', '2022-12-26 19:15:36'),
(91, 95, 'hard', 'tag 1', '<p>5*5</p>', 'numeric', '<p>lorem</p>', 25.00, 2.00, 1, '0', '2022-12-26 19:15:36', '2022-12-26 19:15:36'),
(92, 96, 'medium', 'tag 1', '<p>8+8</p>', 'numeric', '<p>lorem</p>', 25.00, 2.00, 1, '1', '2022-12-28 14:39:26', '2022-12-28 14:39:26'),
(93, 97, 'easy', 'tag 1', '<p>5*5</p>', 'single', '<p>lorem</p>', 25.00, 2.00, 1, '1', '2022-12-28 14:41:02', '2022-12-28 14:41:02'),
(94, 98, 'hard', 'tag 1', '<p>2*9</p>', 'numeric', '<p>lorem</p>', 25.00, 2.00, 1, '0', '2022-12-28 18:23:31', '2022-12-28 18:23:31'),
(95, 99, 'hard', 'tag 1', '<p>8*8</p>', 'single', '<p>lorem</p>', 25.00, 2.00, 1, '0', '2022-12-28 18:54:16', '2022-12-28 20:18:00'),
(96, 100, 'easy', 'tag 1', '<p>5*5</p>', 'numeric', '<p>lorem</p>', 25.00, 2.00, 1, '0', '2022-12-28 20:21:28', '2022-12-28 20:57:10'),
(97, 101, 'medium', 'tag 1', '<p>5+6</p>', 'single', '<p>lorem</p>', 50.00, 1.00, 1, '1', '2022-12-29 08:17:12', '2022-12-29 08:17:12'),
(98, 102, 'medium', 'tag 1', '<p>10*5</p>', 'multiple', '<p>lorem</p>', 10.00, 2.00, 1, '0', '2022-12-29 16:45:17', '2022-12-29 16:45:17'),
(99, 103, 'easy', 'tag 1', '<p>8*8</p>', 'numeric', '<p>lorem</p>', 50.00, 1.00, 1, '1', '2022-12-29 16:48:02', '2022-12-29 16:48:02'),
(100, 104, 'medium', 'tag 1', '<p>5+6-6</p>', 'multiple', '<p>loremmmm</p>', 50.00, 1.00, 1, '0', '2022-12-29 16:48:02', '2022-12-29 16:48:27');

-- --------------------------------------------------------

--
-- Table structure for table `exam_results`
--

DROP TABLE IF EXISTS `exam_results`;
CREATE TABLE IF NOT EXISTS `exam_results` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `exam_id` bigint UNSIGNED NOT NULL,
  `score` double(8,2) NOT NULL DEFAULT '0.00',
  `correct` int NOT NULL DEFAULT '0',
  `incorrect` int NOT NULL DEFAULT '0',
  `accuracy` int NOT NULL DEFAULT '0',
  `status` enum('done','process') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'process',
  `remaining_second` int DEFAULT NULL,
  `current_section` int DEFAULT NULL,
  `current_item` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `exam_results_user_id_foreign` (`user_id`),
  KEY `exam_results_exam_id_foreign` (`exam_id`)
) ENGINE=MyISAM AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `exam_results`
--

INSERT INTO `exam_results` (`id`, `user_id`, `exam_id`, `score`, `correct`, `incorrect`, `accuracy`, `status`, `remaining_second`, `current_section`, `current_item`, `created_at`, `updated_at`) VALUES
(1, 7, 109, 174.98, 1, 2, 33, 'done', NULL, NULL, NULL, '2022-11-28 14:58:34', '2022-11-28 14:59:38'),
(2, 7, 111, -8.00, 1, 3, 25, 'done', NULL, NULL, NULL, '2022-12-08 17:21:22', '2022-12-09 09:10:04'),
(3, 7, 111, 0.00, 0, 0, 0, 'done', NULL, NULL, NULL, '2022-12-09 10:45:05', '2022-12-09 10:45:08'),
(4, 7, 109, 194.00, 1, 2, 33, 'done', NULL, NULL, NULL, '2022-12-09 18:41:52', '2022-12-10 11:16:11'),
(5, 7, 114, 73.00, 2, 1, 67, 'done', NULL, NULL, NULL, '2022-12-10 08:33:15', '2022-12-10 11:13:36'),
(6, 7, 114, -4.00, 0, 2, 0, 'done', NULL, NULL, NULL, '2022-12-10 11:25:27', '2022-12-10 11:26:06'),
(7, 7, 115, 8.00, 1, 2, 33, 'done', NULL, NULL, NULL, '2022-12-10 11:59:36', '2022-12-10 17:09:44'),
(8, 7, 115, 88.00, 4, 2, 67, 'done', NULL, NULL, NULL, '2022-12-10 17:19:20', '2022-12-10 17:34:09'),
(9, 7, 116, 54.00, 5, 1, 83, 'done', NULL, NULL, NULL, '2022-12-12 14:38:15', '2022-12-12 14:39:21'),
(10, 7, 116, -3.00, 0, 1, 0, 'done', NULL, NULL, NULL, '2022-12-12 17:24:36', '2022-12-13 09:24:06'),
(11, 7, 117, 10.00, 1, 0, 100, 'done', NULL, NULL, NULL, '2022-12-13 09:59:58', '2022-12-13 14:39:59'),
(12, 7, 117, 10.00, 1, 0, 100, 'done', NULL, NULL, NULL, '2022-12-13 14:40:44', '2022-12-21 18:55:37'),
(15, 7, 118, 0.00, 0, 0, 0, 'done', NULL, NULL, NULL, '2022-12-15 14:34:15', '2022-12-15 14:34:15'),
(24, 7, 121, 80.00, 3, 3, 50, 'done', NULL, NULL, NULL, '2022-12-22 17:25:56', '2022-12-22 17:31:07'),
(23, 7, 120, 99.00, 5, 1, 83, 'done', NULL, NULL, NULL, '2022-12-19 14:38:46', '2022-12-19 14:43:02'),
(22, 7, 119, 58.00, 4, 1, 80, 'done', NULL, NULL, NULL, '2022-12-19 08:30:11', '2022-12-19 09:20:22');

-- --------------------------------------------------------

--
-- Table structure for table `exam_result_details`
--

DROP TABLE IF EXISTS `exam_result_details`;
CREATE TABLE IF NOT EXISTS `exam_result_details` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `exam_result_id` bigint UNSIGNED NOT NULL,
  `exam_question_item_id` bigint UNSIGNED NOT NULL,
  `correct` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `exam_result_details_exam_result_id_foreign` (`exam_result_id`),
  KEY `exam_result_details_exam_question_item_id_foreign` (`exam_question_item_id`)
) ENGINE=MyISAM AUTO_INCREMENT=139 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `exam_result_details`
--

INSERT INTO `exam_result_details` (`id`, `exam_result_id`, `exam_question_item_id`, `correct`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 0, '2022-11-28 14:59:37', '2022-11-28 14:59:37'),
(2, 1, 2, 1, '2022-11-28 14:59:38', '2022-11-28 14:59:38'),
(3, 1, 3, 0, '2022-11-28 14:59:38', '2022-11-28 14:59:38'),
(4, 2, 4, 1, '2022-12-09 09:10:03', '2022-12-09 09:10:04'),
(5, 2, 9, 0, '2022-12-09 09:10:04', '2022-12-09 09:10:04'),
(6, 2, 10, 0, '2022-12-09 09:10:04', '2022-12-09 09:10:04'),
(7, 2, 5, 0, '2022-12-09 09:10:04', '2022-12-09 09:10:04'),
(8, 2, 7, 0, '2022-12-09 09:10:04', '2022-12-09 09:10:04'),
(9, 2, 8, 0, '2022-12-09 09:10:04', '2022-12-09 09:10:04'),
(10, 2, 14, 0, '2022-12-09 09:10:04', '2022-12-09 09:10:04'),
(11, 2, 15, 0, '2022-12-09 09:10:04', '2022-12-09 09:10:04'),
(12, 2, 16, 0, '2022-12-09 09:10:04', '2022-12-09 09:10:04'),
(13, 3, 4, 0, '2022-12-09 10:45:06', '2022-12-09 10:45:06'),
(14, 3, 9, 0, '2022-12-09 10:45:08', '2022-12-09 10:45:08'),
(15, 3, 10, 0, '2022-12-09 10:45:08', '2022-12-09 10:45:08'),
(16, 3, 5, 0, '2022-12-09 10:45:08', '2022-12-09 10:45:08'),
(17, 3, 7, 0, '2022-12-09 10:45:08', '2022-12-09 10:45:08'),
(18, 3, 8, 0, '2022-12-09 10:45:08', '2022-12-09 10:45:08'),
(19, 3, 14, 0, '2022-12-09 10:45:08', '2022-12-09 10:45:08'),
(20, 3, 15, 0, '2022-12-09 10:45:08', '2022-12-09 10:45:08'),
(21, 3, 16, 0, '2022-12-09 10:45:08', '2022-12-09 10:45:08'),
(22, 5, 17, 0, '2022-12-10 11:13:36', '2022-12-10 11:13:36'),
(23, 5, 18, 1, '2022-12-10 11:13:36', '2022-12-10 11:13:36'),
(24, 5, 19, 1, '2022-12-10 11:13:36', '2022-12-10 11:13:36'),
(25, 4, 1, 0, '2022-12-10 11:16:10', '2022-12-10 11:16:10'),
(26, 4, 2, 0, '2022-12-10 11:16:11', '2022-12-10 11:16:11'),
(27, 4, 3, 1, '2022-12-10 11:16:11', '2022-12-10 11:16:11'),
(28, 6, 17, 0, '2022-12-10 11:26:06', '2022-12-10 11:26:06'),
(29, 6, 18, 0, '2022-12-10 11:26:06', '2022-12-10 11:26:06'),
(30, 6, 19, 0, '2022-12-10 11:26:06', '2022-12-10 11:26:06'),
(31, 7, 20, 0, '2022-12-10 17:09:44', '2022-12-10 17:09:44'),
(32, 7, 21, 1, '2022-12-10 17:09:44', '2022-12-10 17:09:44'),
(33, 7, 22, 0, '2022-12-10 17:09:44', '2022-12-10 17:09:44'),
(34, 7, 23, 0, '2022-12-10 17:09:44', '2022-12-10 17:09:44'),
(35, 7, 24, 0, '2022-12-10 17:09:44', '2022-12-10 17:09:44'),
(36, 7, 25, 0, '2022-12-10 17:09:44', '2022-12-10 17:09:44'),
(37, 7, 26, 0, '2022-12-10 17:09:44', '2022-12-10 17:09:44'),
(38, 8, 20, 0, '2022-12-10 17:34:09', '2022-12-10 17:34:09'),
(39, 8, 21, 1, '2022-12-10 17:34:09', '2022-12-10 17:34:09'),
(40, 8, 22, 0, '2022-12-10 17:34:09', '2022-12-10 17:34:09'),
(41, 8, 23, 1, '2022-12-10 17:34:09', '2022-12-10 17:34:09'),
(42, 8, 24, 0, '2022-12-10 17:34:09', '2022-12-10 17:34:09'),
(43, 8, 25, 1, '2022-12-10 17:34:09', '2022-12-10 17:34:09'),
(44, 8, 26, 1, '2022-12-10 17:34:09', '2022-12-10 17:34:09'),
(45, 9, 27, 1, '2022-12-12 14:39:21', '2022-12-12 14:39:21'),
(46, 9, 28, 1, '2022-12-12 14:39:21', '2022-12-12 14:39:21'),
(47, 9, 29, 0, '2022-12-12 14:39:21', '2022-12-12 14:39:21'),
(48, 9, 30, 1, '2022-12-12 14:39:21', '2022-12-12 14:39:21'),
(49, 9, 31, 1, '2022-12-12 14:39:21', '2022-12-12 14:39:21'),
(50, 9, 32, 1, '2022-12-12 14:39:21', '2022-12-12 14:39:21'),
(51, 10, 27, 0, '2022-12-13 09:24:05', '2022-12-13 09:24:05'),
(52, 10, 28, 0, '2022-12-13 09:24:05', '2022-12-13 09:24:05'),
(53, 10, 29, 0, '2022-12-13 09:24:05', '2022-12-13 09:24:05'),
(54, 10, 30, 0, '2022-12-13 09:24:05', '2022-12-13 09:24:05'),
(55, 10, 31, 0, '2022-12-13 09:24:05', '2022-12-13 09:24:05'),
(56, 10, 32, 0, '2022-12-13 09:24:05', '2022-12-13 09:24:05'),
(57, 11, 33, 1, '2022-12-13 14:39:59', '2022-12-13 14:39:59'),
(58, 11, 34, 0, '2022-12-13 14:39:59', '2022-12-13 14:39:59'),
(59, 11, 35, 0, '2022-12-13 14:39:59', '2022-12-13 14:39:59'),
(60, 11, 36, 0, '2022-12-13 14:39:59', '2022-12-13 14:39:59'),
(61, 11, 37, 0, '2022-12-13 14:39:59', '2022-12-13 14:39:59'),
(62, 11, 38, 0, '2022-12-13 14:39:59', '2022-12-13 14:39:59'),
(63, 11, 39, 0, '2022-12-13 14:39:59', '2022-12-13 14:39:59'),
(64, 11, 40, 0, '2022-12-13 14:39:59', '2022-12-13 14:39:59'),
(65, 11, 41, 0, '2022-12-13 14:39:59', '2022-12-13 14:39:59'),
(66, 15, 42, 0, '2022-12-15 14:34:15', '2022-12-15 14:34:15'),
(67, 15, 43, 0, '2022-12-15 14:34:15', '2022-12-15 14:34:15'),
(68, 15, 44, 0, '2022-12-15 14:34:15', '2022-12-15 14:34:15'),
(69, 15, 45, 0, '2022-12-15 14:34:15', '2022-12-15 14:34:15'),
(70, 15, 46, 0, '2022-12-15 14:34:15', '2022-12-15 14:34:15'),
(71, 15, 47, 0, '2022-12-15 14:34:15', '2022-12-15 14:34:15'),
(72, 15, 48, 0, '2022-12-15 14:34:15', '2022-12-15 14:34:15'),
(73, 15, 49, 0, '2022-12-15 14:34:15', '2022-12-15 14:34:15'),
(74, 15, 50, 0, '2022-12-15 14:34:15', '2022-12-15 14:34:15'),
(119, 23, 68, 1, '2022-12-19 14:43:02', '2022-12-19 14:43:02'),
(118, 23, 67, 0, '2022-12-19 14:43:02', '2022-12-19 14:43:02'),
(117, 23, 66, 0, '2022-12-19 14:43:02', '2022-12-19 14:43:02'),
(116, 23, 65, 1, '2022-12-19 14:43:02', '2022-12-19 14:43:02'),
(115, 23, 64, 0, '2022-12-19 14:43:02', '2022-12-19 14:43:02'),
(114, 23, 63, 0, '2022-12-19 14:43:02', '2022-12-19 14:43:02'),
(113, 23, 62, 1, '2022-12-19 14:43:02', '2022-12-19 14:43:02'),
(112, 23, 61, 0, '2022-12-19 14:43:02', '2022-12-19 14:43:02'),
(111, 23, 60, 1, '2022-12-19 14:43:02', '2022-12-19 14:43:02'),
(110, 22, 59, 0, '2022-12-19 09:20:22', '2022-12-19 09:20:22'),
(109, 22, 58, 0, '2022-12-19 09:20:22', '2022-12-19 09:20:22'),
(108, 22, 57, 1, '2022-12-19 09:20:22', '2022-12-19 09:20:22'),
(107, 22, 56, 0, '2022-12-19 09:20:22', '2022-12-19 09:20:22'),
(106, 22, 55, 1, '2022-12-19 09:20:22', '2022-12-19 09:20:22'),
(105, 22, 54, 0, '2022-12-19 09:20:22', '2022-12-19 09:20:22'),
(104, 22, 53, 0, '2022-12-19 09:20:22', '2022-12-19 09:20:22'),
(103, 22, 52, 1, '2022-12-19 09:20:22', '2022-12-19 09:20:22'),
(102, 22, 51, 1, '2022-12-19 09:20:22', '2022-12-19 09:20:22'),
(120, 23, 69, 0, '2022-12-19 14:43:02', '2022-12-19 14:43:02'),
(121, 23, 70, 1, '2022-12-19 14:43:02', '2022-12-19 14:43:02'),
(122, 23, 71, 0, '2022-12-19 14:43:02', '2022-12-19 14:43:02'),
(123, 12, 33, 1, '2022-12-21 18:55:37', '2022-12-21 18:55:37'),
(124, 12, 34, 0, '2022-12-21 18:55:37', '2022-12-21 18:55:37'),
(125, 12, 35, 0, '2022-12-21 18:55:37', '2022-12-21 18:55:37'),
(126, 12, 36, 0, '2022-12-21 18:55:37', '2022-12-21 18:55:37'),
(127, 12, 37, 0, '2022-12-21 18:55:37', '2022-12-21 18:55:37'),
(128, 12, 38, 0, '2022-12-21 18:55:37', '2022-12-21 18:55:37'),
(129, 12, 39, 0, '2022-12-21 18:55:37', '2022-12-21 18:55:37'),
(130, 12, 40, 0, '2022-12-21 18:55:37', '2022-12-21 18:55:37'),
(131, 12, 41, 0, '2022-12-21 18:55:37', '2022-12-21 18:55:37'),
(132, 24, 72, 0, '2022-12-22 17:31:07', '2022-12-22 17:31:07'),
(133, 24, 73, 0, '2022-12-22 17:31:07', '2022-12-22 17:31:07'),
(134, 24, 74, 1, '2022-12-22 17:31:07', '2022-12-22 17:31:07'),
(135, 24, 75, 1, '2022-12-22 17:31:07', '2022-12-22 17:31:07'),
(136, 24, 76, 0, '2022-12-22 17:31:07', '2022-12-22 17:31:07'),
(137, 24, 77, 0, '2022-12-22 17:31:07', '2022-12-22 17:31:07'),
(138, 24, 78, 1, '2022-12-22 17:31:07', '2022-12-22 17:31:07');

-- --------------------------------------------------------

--
-- Table structure for table `exam_result_detail_options`
--

DROP TABLE IF EXISTS `exam_result_detail_options`;
CREATE TABLE IF NOT EXISTS `exam_result_detail_options` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `exam_result_detail_id` bigint UNSIGNED NOT NULL,
  `exam_option_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `exam_result_detail_options_exam_result_detail_id_foreign` (`exam_result_detail_id`),
  KEY `exam_result_detail_options_exam_option_id_foreign` (`exam_option_id`)
) ENGINE=MyISAM AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `exam_result_detail_options`
--

INSERT INTO `exam_result_detail_options` (`id`, `exam_result_detail_id`, `exam_option_id`, `created_at`, `updated_at`) VALUES
(1, 1, 2, '2022-11-28 14:59:37', '2022-11-28 14:59:37'),
(2, 2, 4, '2022-11-28 14:59:38', '2022-11-28 14:59:38'),
(3, 3, 6, '2022-11-28 14:59:38', '2022-11-28 14:59:38'),
(4, 4, 9, '2022-12-09 09:10:04', '2022-12-09 09:10:04'),
(5, 6, 25, '2022-12-09 09:10:04', '2022-12-09 09:10:04'),
(6, 8, 18, '2022-12-09 09:10:04', '2022-12-09 09:10:04'),
(7, 9, 20, '2022-12-09 09:10:04', '2022-12-09 09:10:04'),
(8, 22, 36, '2022-12-10 11:13:36', '2022-12-10 11:13:36'),
(9, 23, 37, '2022-12-10 11:13:36', '2022-12-10 11:13:36'),
(10, 24, 38, '2022-12-10 11:13:36', '2022-12-10 11:13:36'),
(11, 24, 39, '2022-12-10 11:13:36', '2022-12-10 11:13:36'),
(12, 25, 2, '2022-12-10 11:16:11', '2022-12-10 11:16:11'),
(13, 26, 5, '2022-12-10 11:16:11', '2022-12-10 11:16:11'),
(14, 27, 8, '2022-12-10 11:16:11', '2022-12-10 11:16:11'),
(15, 28, 35, '2022-12-10 11:26:06', '2022-12-10 11:26:06'),
(16, 30, 38, '2022-12-10 11:26:06', '2022-12-10 11:26:06'),
(17, 31, 41, '2022-12-10 17:09:44', '2022-12-10 17:09:44'),
(18, 32, 42, '2022-12-10 17:09:44', '2022-12-10 17:09:44'),
(19, 33, 43, '2022-12-10 17:09:44', '2022-12-10 17:09:44'),
(20, 33, 44, '2022-12-10 17:09:44', '2022-12-10 17:09:44'),
(21, 33, 45, '2022-12-10 17:09:44', '2022-12-10 17:09:44'),
(22, 38, 41, '2022-12-10 17:34:09', '2022-12-10 17:34:09'),
(23, 39, 42, '2022-12-10 17:34:09', '2022-12-10 17:34:09'),
(24, 40, 43, '2022-12-10 17:34:09', '2022-12-10 17:34:09'),
(25, 40, 45, '2022-12-10 17:34:09', '2022-12-10 17:34:09'),
(26, 41, 46, '2022-12-10 17:34:09', '2022-12-10 17:34:09'),
(27, 43, 48, '2022-12-10 17:34:09', '2022-12-10 17:34:09'),
(28, 44, 49, '2022-12-10 17:34:09', '2022-12-10 17:34:09'),
(29, 45, 50, '2022-12-12 14:39:21', '2022-12-12 14:39:21'),
(30, 46, 53, '2022-12-12 14:39:21', '2022-12-12 14:39:21'),
(31, 47, 54, '2022-12-12 14:39:21', '2022-12-12 14:39:21'),
(32, 47, 55, '2022-12-12 14:39:21', '2022-12-12 14:39:21'),
(33, 48, 57, '2022-12-12 14:39:21', '2022-12-12 14:39:21'),
(34, 49, 58, '2022-12-12 14:39:21', '2022-12-12 14:39:21'),
(35, 50, 59, '2022-12-12 14:39:21', '2022-12-12 14:39:21'),
(36, 51, 51, '2022-12-13 09:24:05', '2022-12-13 09:24:05'),
(37, 57, 60, '2022-12-13 14:39:59', '2022-12-13 14:39:59'),
(38, 102, 94, '2022-12-19 09:20:22', '2022-12-19 09:20:22'),
(39, 103, 96, '2022-12-19 09:20:22', '2022-12-19 09:20:22'),
(40, 106, 101, '2022-12-19 09:20:22', '2022-12-19 09:20:22'),
(41, 108, 105, '2022-12-19 09:20:22', '2022-12-19 09:20:22'),
(42, 110, 110, '2022-12-19 09:20:22', '2022-12-19 09:20:22'),
(43, 111, 112, '2022-12-19 14:43:02', '2022-12-19 14:43:02'),
(44, 113, 114, '2022-12-19 14:43:02', '2022-12-19 14:43:02'),
(45, 113, 116, '2022-12-19 14:43:02', '2022-12-19 14:43:02'),
(46, 115, 119, '2022-12-19 14:43:02', '2022-12-19 14:43:02'),
(47, 116, 120, '2022-12-19 14:43:02', '2022-12-19 14:43:02'),
(48, 119, 126, '2022-12-19 14:43:02', '2022-12-19 14:43:02'),
(49, 121, 129, '2022-12-19 14:43:02', '2022-12-19 14:43:02'),
(50, 123, 60, '2022-12-21 18:55:37', '2022-12-21 18:55:37'),
(51, 132, 132, '2022-12-22 17:31:07', '2022-12-22 17:31:07'),
(52, 134, 135, '2022-12-22 17:31:07', '2022-12-22 17:31:07'),
(53, 134, 136, '2022-12-22 17:31:07', '2022-12-22 17:31:07'),
(54, 135, 138, '2022-12-22 17:31:07', '2022-12-22 17:31:07'),
(55, 136, 139, '2022-12-22 17:31:07', '2022-12-22 17:31:07'),
(56, 137, 142, '2022-12-22 17:31:07', '2022-12-22 17:31:07'),
(57, 137, 143, '2022-12-22 17:31:07', '2022-12-22 17:31:07'),
(58, 138, 144, '2022-12-22 17:31:07', '2022-12-22 17:31:07');

-- --------------------------------------------------------

--
-- Table structure for table `exam_result_do_temps`
--

DROP TABLE IF EXISTS `exam_result_do_temps`;
CREATE TABLE IF NOT EXISTS `exam_result_do_temps` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `exam_result_dtemp_id` bigint UNSIGNED NOT NULL,
  `exam_option_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `exam_result_do_temps_exam_result_dtemp_id_foreign` (`exam_result_dtemp_id`),
  KEY `exam_result_do_temps_exam_option_id_foreign` (`exam_option_id`)
) ENGINE=MyISAM AUTO_INCREMENT=141 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `exam_result_do_temps`
--

INSERT INTO `exam_result_do_temps` (`id`, `exam_result_dtemp_id`, `exam_option_id`, `created_at`, `updated_at`) VALUES
(1, 1, 2, '2022-11-28 14:58:34', '2022-11-28 14:58:34'),
(2, 2, 4, '2022-11-28 14:58:45', '2022-11-28 14:58:45'),
(3, 3, 6, '2022-11-28 14:59:04', '2022-11-28 14:59:04'),
(4, 4, 9, '2022-12-08 17:21:23', '2022-12-08 17:21:23'),
(5, 6, 25, '2022-12-08 17:21:50', '2022-12-08 17:21:50'),
(6, 7, 18, '2022-12-08 17:22:19', '2022-12-08 17:22:19'),
(10, 8, 20, '2022-12-08 18:44:20', '2022-12-08 18:44:20'),
(11, 9, 2, '2022-12-09 18:41:52', '2022-12-09 18:41:52'),
(13, 10, 5, '2022-12-09 19:34:19', '2022-12-09 19:34:19'),
(16, 11, 8, '2022-12-09 19:36:35', '2022-12-09 19:36:35'),
(44, 12, 36, '2022-12-10 10:57:58', '2022-12-10 10:57:58'),
(45, 13, 37, '2022-12-10 11:00:04', '2022-12-10 11:00:04'),
(46, 14, 35, '2022-12-10 11:25:27', '2022-12-10 11:25:27'),
(47, 16, 41, '2022-12-10 11:59:36', '2022-12-10 11:59:36'),
(48, 17, 42, '2022-12-10 12:01:55', '2022-12-10 12:01:55'),
(49, 18, 43, '2022-12-10 12:04:46', '2022-12-10 12:04:46'),
(50, 18, 44, '2022-12-10 12:04:46', '2022-12-10 12:04:46'),
(51, 18, 45, '2022-12-10 12:04:46', '2022-12-10 12:04:46'),
(52, 19, 41, '2022-12-10 17:19:20', '2022-12-10 17:19:20'),
(53, 20, 42, '2022-12-10 17:20:22', '2022-12-10 17:20:22'),
(54, 21, 43, '2022-12-10 17:20:38', '2022-12-10 17:20:38'),
(55, 21, 45, '2022-12-10 17:20:38', '2022-12-10 17:20:38'),
(57, 22, 46, '2022-12-10 17:28:18', '2022-12-10 17:28:18'),
(58, 24, 48, '2022-12-10 17:31:24', '2022-12-10 17:31:24'),
(59, 25, 50, '2022-12-12 14:38:15', '2022-12-12 14:38:15'),
(60, 26, 53, '2022-12-12 14:38:34', '2022-12-12 14:38:34'),
(61, 27, 54, '2022-12-12 14:38:46', '2022-12-12 14:38:46'),
(62, 27, 55, '2022-12-12 14:38:46', '2022-12-12 14:38:46'),
(63, 28, 57, '2022-12-12 14:38:56', '2022-12-12 14:38:56'),
(64, 29, 58, '2022-12-12 14:39:07', '2022-12-12 14:39:07'),
(66, 30, 51, '2022-12-12 17:34:11', '2022-12-12 17:34:11'),
(70, 32, 60, '2022-12-13 10:40:40', '2022-12-13 10:40:40'),
(73, 33, 60, '2022-12-13 16:49:08', '2022-12-13 16:49:08'),
(129, 112, 116, '2022-12-19 14:39:29', '2022-12-19 14:39:29'),
(128, 112, 114, '2022-12-19 14:39:29', '2022-12-19 14:39:29'),
(127, 111, 112, '2022-12-19 14:38:46', '2022-12-19 14:38:46'),
(126, 109, 105, '2022-12-19 09:19:38', '2022-12-19 09:19:38'),
(125, 108, 101, '2022-12-19 09:19:21', '2022-12-19 09:19:21'),
(124, 104, 94, '2022-12-19 08:30:27', '2022-12-19 08:30:27'),
(123, 103, 96, '2022-12-19 08:30:11', '2022-12-19 08:30:11'),
(130, 113, 119, '2022-12-19 14:41:06', '2022-12-19 14:41:06'),
(131, 114, 120, '2022-12-19 14:41:22', '2022-12-19 14:41:22'),
(132, 117, 126, '2022-12-19 14:41:45', '2022-12-19 14:41:45'),
(133, 119, 129, '2022-12-19 14:42:43', '2022-12-19 14:42:43'),
(134, 120, 132, '2022-12-22 17:25:56', '2022-12-22 17:25:56'),
(135, 122, 135, '2022-12-22 17:26:12', '2022-12-22 17:26:12'),
(136, 122, 136, '2022-12-22 17:26:12', '2022-12-22 17:26:12'),
(137, 123, 138, '2022-12-22 17:26:28', '2022-12-22 17:26:28'),
(138, 124, 139, '2022-12-22 17:26:41', '2022-12-22 17:26:41'),
(139, 125, 142, '2022-12-22 17:26:54', '2022-12-22 17:26:54'),
(140, 125, 143, '2022-12-22 17:26:54', '2022-12-22 17:26:54');

-- --------------------------------------------------------

--
-- Table structure for table `exam_result_dtemps`
--

DROP TABLE IF EXISTS `exam_result_dtemps`;
CREATE TABLE IF NOT EXISTS `exam_result_dtemps` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `exam_result_id` bigint UNSIGNED NOT NULL,
  `exam_question_item_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `exam_result_dtemps_exam_result_id_foreign` (`exam_result_id`),
  KEY `exam_result_dtemps_exam_question_item_id_foreign` (`exam_question_item_id`)
) ENGINE=MyISAM AUTO_INCREMENT=126 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `exam_sections`
--

DROP TABLE IF EXISTS `exam_sections`;
CREATE TABLE IF NOT EXISTS `exam_sections` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `exam_id` bigint UNSIGNED NOT NULL,
  `name` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `duration` int DEFAULT NULL,
  `instruction` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `exam_sections_exam_id_foreign` (`exam_id`)
) ENGINE=MyISAM AUTO_INCREMENT=348 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `exam_sections`
--

INSERT INTO `exam_sections` (`id`, `exam_id`, `name`, `duration`, `instruction`, `created_at`, `updated_at`) VALUES
(1, 1, 'exam section 1', 52, 'lorem ipsum', NULL, NULL),
(2, 3, 'section 1', NULL, '<p>instruction of section 1</p>', '2022-11-11 12:28:53', '2022-11-11 12:28:53'),
(3, 4, 'section 1', NULL, '<p>instruction of section 1</p>', '2022-11-11 12:28:57', '2022-11-11 12:28:57'),
(4, 5, 'section 1', NULL, '<p>instruction of section 1</p>', '2022-11-11 12:29:01', '2022-11-11 12:29:01'),
(5, 6, 'section 1', NULL, '<p>instruction of section 1</p>', '2022-11-11 12:29:02', '2022-11-11 12:29:02'),
(6, 7, 'section 1', NULL, '<p>instruction of section 1</p>', '2022-11-11 12:29:02', '2022-11-11 12:29:02'),
(7, 8, 'section 1', NULL, '<p>instruction of section 1</p>', '2022-11-11 12:29:02', '2022-11-11 12:29:02'),
(8, 9, 'section 1', NULL, '<p>instruction of section 1</p>', '2022-11-11 12:29:03', '2022-11-11 12:29:03'),
(9, 10, 'Mathematics', NULL, 'this an instruction', '2022-11-23 14:49:54', '2022-11-23 14:49:54'),
(10, 10, 'Physics', NULL, 'this an instruction', '2022-11-23 14:49:54', '2022-11-23 14:49:54'),
(11, 10, 'Chemestry', NULL, 'this an instruction', '2022-11-23 14:49:54', '2022-11-23 14:49:54'),
(12, 11, 'Mathematics', NULL, 'This is an instruction', '2022-11-24 08:47:31', '2022-11-24 08:47:31'),
(13, 11, 'Physics', NULL, 'This is an instruction', '2022-11-24 08:47:31', '2022-11-24 08:47:31'),
(14, 11, 'Chemestry', NULL, 'This is an instruction', '2022-11-24 08:47:31', '2022-11-24 08:47:31'),
(15, 12, 'Mathematics', NULL, 'This is an instruction', '2022-11-24 08:47:45', '2022-11-24 08:47:45'),
(16, 12, 'Physics', NULL, 'This is an instruction', '2022-11-24 08:47:45', '2022-11-24 08:47:45'),
(17, 12, 'Chemestry', NULL, 'This is an instruction', '2022-11-24 08:47:45', '2022-11-24 08:47:45'),
(18, 13, 'Mathematics', NULL, 'This is an instruction', '2022-11-24 08:48:06', '2022-11-24 08:48:06'),
(19, 13, 'Physics', NULL, 'This is an instruction', '2022-11-24 08:48:06', '2022-11-24 08:48:06'),
(20, 13, 'Chemestry', NULL, 'This is an instruction', '2022-11-24 08:48:06', '2022-11-24 08:48:06'),
(21, 14, 'Mathematics', NULL, 'This is an instruction', '2022-11-24 08:48:31', '2022-11-24 08:48:31'),
(22, 14, 'Physics', NULL, 'This is an instruction', '2022-11-24 08:48:31', '2022-11-24 08:48:31'),
(23, 14, 'Chemestry', NULL, 'This is an instruction', '2022-11-24 08:48:31', '2022-11-24 08:48:31'),
(24, 15, 'Mathematics', NULL, 'this an instruction', '2022-11-24 08:50:23', '2022-11-24 08:50:23'),
(25, 15, 'Physics', NULL, 'this an instruction', '2022-11-24 08:50:23', '2022-11-24 08:50:23'),
(26, 15, 'Chemestry', NULL, 'this an instruction', '2022-11-24 08:50:23', '2022-11-24 08:50:23'),
(27, 16, 'Mathematics', NULL, 'this an instruction', '2022-11-24 08:50:30', '2022-11-24 08:50:30'),
(28, 16, 'Physics', NULL, 'this an instruction', '2022-11-24 08:50:30', '2022-11-24 08:50:30'),
(29, 16, 'Chemestry', NULL, 'this an instruction', '2022-11-24 08:50:30', '2022-11-24 08:50:30'),
(30, 17, 'Mathematics', NULL, 'this an instruction', '2022-11-24 08:50:47', '2022-11-24 08:50:47'),
(31, 17, 'Physics', NULL, 'this an instruction', '2022-11-24 08:50:47', '2022-11-24 08:50:47'),
(32, 17, 'Chemestry', NULL, 'this an instruction', '2022-11-24 08:50:47', '2022-11-24 08:50:47'),
(33, 18, 'Mathematics', NULL, 'this an instruction', '2022-11-24 08:51:02', '2022-11-24 08:51:02'),
(34, 18, 'Physics', NULL, 'this an instruction', '2022-11-24 08:51:02', '2022-11-24 08:51:02'),
(35, 18, 'Chemestry', NULL, 'this an instruction', '2022-11-24 08:51:02', '2022-11-24 08:51:02'),
(36, 19, 'Mathematics', NULL, 'this an instruction', '2022-11-24 08:51:11', '2022-11-24 08:51:11'),
(37, 19, 'Physics', NULL, 'this an instruction', '2022-11-24 08:51:11', '2022-11-24 08:51:11'),
(38, 19, 'Chemestry', NULL, 'this an instruction', '2022-11-24 08:51:11', '2022-11-24 08:51:11'),
(39, 20, 'Mathematics', NULL, 'this an instruction', '2022-11-24 08:51:16', '2022-11-24 08:51:16'),
(40, 20, 'Physics', NULL, 'this an instruction', '2022-11-24 08:51:16', '2022-11-24 08:51:16'),
(41, 20, 'Chemestry', NULL, 'this an instruction', '2022-11-24 08:51:16', '2022-11-24 08:51:16'),
(42, 21, 'Mathematics', NULL, 'this an instruction', '2022-11-24 08:51:18', '2022-11-24 08:51:18'),
(43, 21, 'Physics', NULL, 'this an instruction', '2022-11-24 08:51:18', '2022-11-24 08:51:18'),
(44, 21, 'Chemestry', NULL, 'this an instruction', '2022-11-24 08:51:18', '2022-11-24 08:51:18'),
(45, 22, 'Mathematics', NULL, 'this an instruction', '2022-11-24 08:51:19', '2022-11-24 08:51:19'),
(46, 22, 'Physics', NULL, 'this an instruction', '2022-11-24 08:51:19', '2022-11-24 08:51:19'),
(47, 22, 'Chemestry', NULL, 'this an instruction', '2022-11-24 08:51:19', '2022-11-24 08:51:19'),
(48, 23, 'Mathematics', NULL, 'this an instruction', '2022-11-24 08:51:21', '2022-11-24 08:51:21'),
(49, 23, 'Physics', NULL, 'this an instruction', '2022-11-24 08:51:21', '2022-11-24 08:51:21'),
(50, 23, 'Chemestry', NULL, 'this an instruction', '2022-11-24 08:51:21', '2022-11-24 08:51:21'),
(51, 24, 'Mathematics', NULL, 'this an instruction', '2022-11-24 08:51:24', '2022-11-24 08:51:24'),
(52, 24, 'Physics', NULL, 'this an instruction', '2022-11-24 08:51:25', '2022-11-24 08:51:25'),
(53, 24, 'Chemestry', NULL, 'this an instruction', '2022-11-24 08:51:25', '2022-11-24 08:51:25'),
(54, 25, 'Mathematics', NULL, 'this an instruction', '2022-11-24 08:51:25', '2022-11-24 08:51:25'),
(55, 25, 'Physics', NULL, 'this an instruction', '2022-11-24 08:51:25', '2022-11-24 08:51:25'),
(56, 25, 'Chemestry', NULL, 'this an instruction', '2022-11-24 08:51:25', '2022-11-24 08:51:25'),
(57, 26, 'Mathematics', NULL, 'this an instruction', '2022-11-24 08:51:26', '2022-11-24 08:51:26'),
(58, 26, 'Physics', NULL, 'this an instruction', '2022-11-24 08:51:26', '2022-11-24 08:51:26'),
(59, 26, 'Chemestry', NULL, 'this an instruction', '2022-11-24 08:51:26', '2022-11-24 08:51:26'),
(60, 27, 'Mathematics', NULL, 'this an instruction', '2022-11-24 08:51:26', '2022-11-24 08:51:26'),
(61, 27, 'Physics', NULL, 'this an instruction', '2022-11-24 08:51:26', '2022-11-24 08:51:26'),
(62, 27, 'Chemestry', NULL, 'this an instruction', '2022-11-24 08:51:27', '2022-11-24 08:51:27'),
(63, 28, 'Mathematics', NULL, 'this an instruction', '2022-11-24 08:51:27', '2022-11-24 08:51:27'),
(64, 28, 'Physics', NULL, 'this an instruction', '2022-11-24 08:51:27', '2022-11-24 08:51:27'),
(65, 28, 'Chemestry', NULL, 'this an instruction', '2022-11-24 08:51:27', '2022-11-24 08:51:27'),
(66, 29, 'Mathematics', NULL, 'this an instruction', '2022-11-24 08:51:28', '2022-11-24 08:51:28'),
(67, 29, 'Physics', NULL, 'this an instruction', '2022-11-24 08:51:28', '2022-11-24 08:51:28'),
(68, 29, 'Chemestry', NULL, 'this an instruction', '2022-11-24 08:51:28', '2022-11-24 08:51:28'),
(69, 30, 'Mathematics', NULL, 'this an instruction', '2022-11-24 08:51:28', '2022-11-24 08:51:28'),
(70, 30, 'Physics', NULL, 'this an instruction', '2022-11-24 08:51:28', '2022-11-24 08:51:28'),
(71, 30, 'Chemestry', NULL, 'this an instruction', '2022-11-24 08:51:28', '2022-11-24 08:51:28'),
(72, 31, 'Mathematics', NULL, 'this an instruction', '2022-11-24 08:51:29', '2022-11-24 08:51:29'),
(73, 31, 'Physics', NULL, 'this an instruction', '2022-11-24 08:51:29', '2022-11-24 08:51:29'),
(74, 31, 'Chemestry', NULL, 'this an instruction', '2022-11-24 08:51:29', '2022-11-24 08:51:29'),
(75, 32, 'Mathematics', NULL, 'this an instruction', '2022-11-24 08:51:30', '2022-11-24 08:51:30'),
(76, 32, 'Physics', NULL, 'this an instruction', '2022-11-24 08:51:30', '2022-11-24 08:51:30'),
(77, 32, 'Chemestry', NULL, 'this an instruction', '2022-11-24 08:51:30', '2022-11-24 08:51:30'),
(78, 33, 'Mathematics', NULL, 'this an instruction', '2022-11-24 08:51:55', '2022-11-24 08:51:55'),
(79, 33, 'Physics', NULL, 'this an instruction', '2022-11-24 08:51:55', '2022-11-24 08:51:55'),
(80, 33, 'Chemestry', NULL, 'this an instruction', '2022-11-24 08:51:55', '2022-11-24 08:51:55'),
(81, 34, 'Mathematics', NULL, 'this an instruction', '2022-11-24 08:51:56', '2022-11-24 08:51:56'),
(82, 34, 'Physics', NULL, 'this an instruction', '2022-11-24 08:51:56', '2022-11-24 08:51:56'),
(83, 34, 'Chemestry', NULL, 'this an instruction', '2022-11-24 08:51:56', '2022-11-24 08:51:56'),
(84, 35, 'Mathematics', NULL, 'this an instruction', '2022-11-24 08:55:34', '2022-11-24 08:55:34'),
(85, 35, 'Physics', NULL, 'this an instruction', '2022-11-24 08:55:34', '2022-11-24 08:55:34'),
(86, 35, 'Chemestry', NULL, 'this an instruction', '2022-11-24 08:55:34', '2022-11-24 08:55:34'),
(87, 36, 'Mathematics', NULL, 'this an instruction', '2022-11-24 08:55:41', '2022-11-24 08:55:41'),
(88, 36, 'Physics', NULL, 'this an instruction', '2022-11-24 08:55:41', '2022-11-24 08:55:41'),
(89, 36, 'Chemestry', NULL, 'this an instruction', '2022-11-24 08:55:41', '2022-11-24 08:55:41'),
(90, 37, 'Mathematics', NULL, 'this an instruction', '2022-11-24 08:57:08', '2022-11-24 08:57:08'),
(91, 37, 'Physics', NULL, 'this an instruction', '2022-11-24 08:57:08', '2022-11-24 08:57:08'),
(92, 37, 'Chemestry', NULL, 'this an instruction', '2022-11-24 08:57:08', '2022-11-24 08:57:08'),
(93, 38, 'Mathematics', NULL, 'this an instruction', '2022-11-24 08:57:15', '2022-11-24 08:57:15'),
(94, 38, 'Physics', NULL, 'this an instruction', '2022-11-24 08:57:15', '2022-11-24 08:57:15'),
(95, 38, 'Chemestry', NULL, 'this an instruction', '2022-11-24 08:57:15', '2022-11-24 08:57:15'),
(96, 39, 'Mathematics', NULL, 'this an instruction', '2022-11-24 08:57:43', '2022-11-24 08:57:43'),
(97, 39, 'Physics', NULL, 'this an instruction', '2022-11-24 08:57:43', '2022-11-24 08:57:43'),
(98, 39, 'Chemestry', NULL, 'this an instruction', '2022-11-24 08:57:43', '2022-11-24 08:57:43'),
(99, 40, 'Mathematics', NULL, 'this an instruction', '2022-11-24 08:58:46', '2022-11-24 08:58:46'),
(100, 40, 'Physics', NULL, 'this an instruction', '2022-11-24 08:58:46', '2022-11-24 08:58:46'),
(101, 40, 'Chemestry', NULL, 'this an instruction', '2022-11-24 08:58:46', '2022-11-24 08:58:46'),
(102, 41, 'Mathematics', NULL, 'this an instruction', '2022-11-24 08:58:51', '2022-11-24 08:58:51'),
(103, 41, 'Physics', NULL, 'this an instruction', '2022-11-24 08:58:51', '2022-11-24 08:58:51'),
(104, 41, 'Chemestry', NULL, 'this an instruction', '2022-11-24 08:58:51', '2022-11-24 08:58:51'),
(105, 42, 'Mathematics', NULL, 'this an instruction', '2022-11-24 08:58:54', '2022-11-24 08:58:54'),
(106, 42, 'Physics', NULL, 'this an instruction', '2022-11-24 08:58:54', '2022-11-24 08:58:54'),
(107, 42, 'Chemestry', NULL, 'this an instruction', '2022-11-24 08:58:54', '2022-11-24 08:58:54'),
(108, 43, 'Mathematics', NULL, 'this an instruction', '2022-11-24 08:58:55', '2022-11-24 08:58:55'),
(109, 43, 'Physics', NULL, 'this an instruction', '2022-11-24 08:58:55', '2022-11-24 08:58:55'),
(110, 43, 'Chemestry', NULL, 'this an instruction', '2022-11-24 08:58:55', '2022-11-24 08:58:55'),
(111, 44, 'Mathematics', NULL, 'this an instruction', '2022-11-24 08:58:56', '2022-11-24 08:58:56'),
(112, 44, 'Physics', NULL, 'this an instruction', '2022-11-24 08:58:56', '2022-11-24 08:58:56'),
(113, 44, 'Chemestry', NULL, 'this an instruction', '2022-11-24 08:58:56', '2022-11-24 08:58:56'),
(114, 45, 'Mathematics', NULL, 'this an instruction', '2022-11-24 08:58:56', '2022-11-24 08:58:56'),
(115, 45, 'Physics', NULL, 'this an instruction', '2022-11-24 08:58:56', '2022-11-24 08:58:56'),
(116, 45, 'Chemestry', NULL, 'this an instruction', '2022-11-24 08:58:56', '2022-11-24 08:58:56'),
(117, 46, 'Mathematics', NULL, 'this an instruction', '2022-11-24 08:58:57', '2022-11-24 08:58:57'),
(118, 46, 'Physics', NULL, 'this an instruction', '2022-11-24 08:58:57', '2022-11-24 08:58:57'),
(119, 46, 'Chemestry', NULL, 'this an instruction', '2022-11-24 08:58:57', '2022-11-24 08:58:57'),
(120, 47, 'Mathematics', NULL, 'this an instruction', '2022-11-24 08:58:58', '2022-11-24 08:58:58'),
(121, 47, 'Physics', NULL, 'this an instruction', '2022-11-24 08:58:58', '2022-11-24 08:58:58'),
(122, 47, 'Chemestry', NULL, 'this an instruction', '2022-11-24 08:58:58', '2022-11-24 08:58:58'),
(123, 48, 'Mathematics', NULL, 'this an instruction', '2022-11-24 08:59:17', '2022-11-24 08:59:17'),
(124, 48, 'Physics', NULL, 'this an instruction', '2022-11-24 08:59:17', '2022-11-24 08:59:17'),
(125, 48, 'Chemestry', NULL, 'this an instruction', '2022-11-24 08:59:17', '2022-11-24 08:59:17'),
(126, 49, 'Mathematics', NULL, 'this an instruction', '2022-11-24 08:59:23', '2022-11-24 08:59:23'),
(127, 49, 'Physics', NULL, 'this an instruction', '2022-11-24 08:59:23', '2022-11-24 08:59:23'),
(128, 49, 'Chemestry', NULL, 'this an instruction', '2022-11-24 08:59:23', '2022-11-24 08:59:23'),
(129, 50, 'Mathematics', NULL, 'this an instruction', '2022-11-24 09:00:10', '2022-11-24 09:00:10'),
(130, 50, 'Physics', NULL, 'this an instruction', '2022-11-24 09:00:10', '2022-11-24 09:00:10'),
(131, 50, 'Chemestry', NULL, 'this an instruction', '2022-11-24 09:00:10', '2022-11-24 09:00:10'),
(132, 51, 'Mathematics', NULL, 'this an instruction', '2022-11-24 09:01:14', '2022-11-24 09:01:14'),
(133, 51, 'Physics', NULL, 'this an instruction', '2022-11-24 09:01:14', '2022-11-24 09:01:14'),
(134, 51, 'Chemestry', NULL, 'this an instruction', '2022-11-24 09:01:14', '2022-11-24 09:01:14'),
(135, 52, 'Mathematics', NULL, 'this an instruction', '2022-11-24 09:03:20', '2022-11-24 09:03:20'),
(136, 52, 'Physics', NULL, 'this an instruction', '2022-11-24 09:03:20', '2022-11-24 09:03:20'),
(137, 52, 'Chemestry', NULL, 'this an instruction', '2022-11-24 09:03:20', '2022-11-24 09:03:20'),
(138, 53, 'Mathmaticss', NULL, 'Follow all the steps', '2022-11-24 09:04:13', '2022-11-24 09:04:13'),
(139, 53, 'Physics', NULL, 'Follow all the steps', '2022-11-24 09:04:13', '2022-11-24 09:04:13'),
(140, 53, 'Chemestry', NULL, 'Follow all the steps', '2022-11-24 09:04:13', '2022-11-24 09:04:13'),
(141, 54, 'Mathmaticss', NULL, 'Follow all the steps', '2022-11-24 09:04:19', '2022-11-24 09:04:19'),
(142, 54, 'Physics', NULL, 'Follow all the steps', '2022-11-24 09:04:19', '2022-11-24 09:04:19'),
(143, 54, 'Chemestry', NULL, 'Follow all the steps', '2022-11-24 09:04:19', '2022-11-24 09:04:19'),
(144, 55, 'Mathmaticss', NULL, 'Follow all the steps', '2022-11-24 09:04:22', '2022-11-24 09:04:22'),
(145, 55, 'Physics', NULL, 'Follow all the steps', '2022-11-24 09:04:22', '2022-11-24 09:04:22'),
(146, 55, 'Chemestry', NULL, 'Follow all the steps', '2022-11-24 09:04:22', '2022-11-24 09:04:22'),
(147, 56, 'Mathmaticss', NULL, 'Follow all the steps', '2022-11-24 09:04:35', '2022-11-24 09:04:35'),
(148, 56, 'Physics', NULL, 'Follow all the steps', '2022-11-24 09:04:35', '2022-11-24 09:04:35'),
(149, 56, 'Chemestry', NULL, 'Follow all the steps', '2022-11-24 09:04:35', '2022-11-24 09:04:35'),
(150, 57, 'Mathmaticss', NULL, 'Follow all the steps', '2022-11-24 09:05:14', '2022-11-24 09:05:14'),
(151, 57, 'Physics', NULL, 'Follow all the steps', '2022-11-24 09:05:14', '2022-11-24 09:05:14'),
(152, 57, 'Chemestry', NULL, 'Follow all the steps', '2022-11-24 09:05:14', '2022-11-24 09:05:14'),
(153, 58, 'Mathmaticss', NULL, 'Follow all the steps', '2022-11-24 09:06:55', '2022-11-24 09:06:55'),
(154, 58, 'Physics', NULL, 'Follow all the steps', '2022-11-24 09:06:55', '2022-11-24 09:06:55'),
(155, 58, 'Chemestry', NULL, 'Follow all the steps', '2022-11-24 09:06:55', '2022-11-24 09:06:55'),
(156, 59, 'Mathmaticss', NULL, 'Follow all the steps', '2022-11-24 09:06:59', '2022-11-24 09:06:59'),
(157, 59, 'Physics', NULL, 'Follow all the steps', '2022-11-24 09:06:59', '2022-11-24 09:06:59'),
(158, 59, 'Chemestry', NULL, 'Follow all the steps', '2022-11-24 09:06:59', '2022-11-24 09:06:59'),
(159, 60, 'Mathmaticss', NULL, 'Follow all the steps', '2022-11-24 09:07:02', '2022-11-24 09:07:02'),
(160, 60, 'Physics', NULL, 'Follow all the steps', '2022-11-24 09:07:02', '2022-11-24 09:07:02'),
(161, 60, 'Chemestry', NULL, 'Follow all the steps', '2022-11-24 09:07:02', '2022-11-24 09:07:02'),
(162, 61, 'Mathmaticss', NULL, 'Follow all the steps', '2022-11-24 09:07:03', '2022-11-24 09:07:03'),
(163, 61, 'Physics', NULL, 'Follow all the steps', '2022-11-24 09:07:03', '2022-11-24 09:07:03'),
(164, 61, 'Chemestry', NULL, 'Follow all the steps', '2022-11-24 09:07:03', '2022-11-24 09:07:03'),
(165, 62, 'Mathmaticss', NULL, 'Follow all the steps', '2022-11-24 09:07:04', '2022-11-24 09:07:04'),
(166, 62, 'Physics', NULL, 'Follow all the steps', '2022-11-24 09:07:04', '2022-11-24 09:07:04'),
(167, 62, 'Chemestry', NULL, 'Follow all the steps', '2022-11-24 09:07:04', '2022-11-24 09:07:04'),
(168, 63, 'Mathmaticss', NULL, 'Follow all the steps', '2022-11-24 09:07:04', '2022-11-24 09:07:04'),
(169, 63, 'Physics', NULL, 'Follow all the steps', '2022-11-24 09:07:04', '2022-11-24 09:07:04'),
(170, 63, 'Chemestry', NULL, 'Follow all the steps', '2022-11-24 09:07:04', '2022-11-24 09:07:04'),
(171, 64, 'Mathmaticss', NULL, 'Follow all the steps', '2022-11-24 09:07:05', '2022-11-24 09:07:05'),
(172, 64, 'Physics', NULL, 'Follow all the steps', '2022-11-24 09:07:05', '2022-11-24 09:07:05'),
(173, 64, 'Chemestry', NULL, 'Follow all the steps', '2022-11-24 09:07:05', '2022-11-24 09:07:05'),
(174, 65, 'Mathmaticss', NULL, 'Follow all the steps', '2022-11-24 09:07:06', '2022-11-24 09:07:06'),
(175, 65, 'Physics', NULL, 'Follow all the steps', '2022-11-24 09:07:06', '2022-11-24 09:07:06'),
(176, 65, 'Chemestry', NULL, 'Follow all the steps', '2022-11-24 09:07:06', '2022-11-24 09:07:06'),
(177, 66, 'Mathmaticss', NULL, 'Follow all the steps', '2022-11-24 09:07:14', '2022-11-24 09:07:14'),
(178, 66, 'Physics', NULL, 'Follow all the steps', '2022-11-24 09:07:14', '2022-11-24 09:07:14'),
(179, 66, 'Chemestry', NULL, 'Follow all the steps', '2022-11-24 09:07:14', '2022-11-24 09:07:14'),
(180, 67, 'Mathmaticss', NULL, 'Follow all the steps', '2022-11-24 09:08:16', '2022-11-24 09:08:16'),
(181, 67, 'Physics', NULL, 'Follow all the steps', '2022-11-24 09:08:16', '2022-11-24 09:08:16'),
(182, 67, 'Chemestry', NULL, 'Follow all the steps', '2022-11-24 09:08:16', '2022-11-24 09:08:16'),
(183, 68, 'Mathmaticss', NULL, 'Follow all the steps', '2022-11-24 09:08:22', '2022-11-24 09:08:22'),
(184, 68, 'Physics', NULL, 'Follow all the steps', '2022-11-24 09:08:22', '2022-11-24 09:08:22'),
(185, 68, 'Chemestry', NULL, 'Follow all the steps', '2022-11-24 09:08:22', '2022-11-24 09:08:22'),
(186, 69, 'Mathmaticss', NULL, 'Follow all the steps', '2022-11-24 09:08:24', '2022-11-24 09:08:24'),
(187, 69, 'Physics', NULL, 'Follow all the steps', '2022-11-24 09:08:24', '2022-11-24 09:08:24'),
(188, 69, 'Chemestry', NULL, 'Follow all the steps', '2022-11-24 09:08:24', '2022-11-24 09:08:24'),
(189, 70, 'Mathmaticss', NULL, 'Follow all the steps', '2022-11-24 09:08:26', '2022-11-24 09:08:26'),
(190, 70, 'Physics', NULL, 'Follow all the steps', '2022-11-24 09:08:26', '2022-11-24 09:08:26'),
(191, 70, 'Chemestry', NULL, 'Follow all the steps', '2022-11-24 09:08:26', '2022-11-24 09:08:26'),
(192, 71, 'Mathmaticss', NULL, 'Follow all the steps', '2022-11-24 09:08:27', '2022-11-24 09:08:27'),
(193, 71, 'Physics', NULL, 'Follow all the steps', '2022-11-24 09:08:27', '2022-11-24 09:08:27'),
(194, 71, 'Chemestry', NULL, 'Follow all the steps', '2022-11-24 09:08:27', '2022-11-24 09:08:27'),
(195, 72, 'Mathmaticss', NULL, 'Follow all the steps', '2022-11-24 09:08:28', '2022-11-24 09:08:28'),
(196, 72, 'Physics', NULL, 'Follow all the steps', '2022-11-24 09:08:28', '2022-11-24 09:08:28'),
(197, 72, 'Chemestry', NULL, 'Follow all the steps', '2022-11-24 09:08:28', '2022-11-24 09:08:28'),
(198, 73, 'Mathmaticss', NULL, 'Follow all the steps', '2022-11-24 09:08:28', '2022-11-24 09:08:28'),
(199, 73, 'Physics', NULL, 'Follow all the steps', '2022-11-24 09:08:28', '2022-11-24 09:08:28'),
(200, 73, 'Chemestry', NULL, 'Follow all the steps', '2022-11-24 09:08:28', '2022-11-24 09:08:28'),
(201, 74, 'Mathmaticss', NULL, 'Follow all the steps', '2022-11-24 09:08:29', '2022-11-24 09:08:29'),
(202, 74, 'Physics', NULL, 'Follow all the steps', '2022-11-24 09:08:29', '2022-11-24 09:08:29'),
(203, 74, 'Chemestry', NULL, 'Follow all the steps', '2022-11-24 09:08:29', '2022-11-24 09:08:29'),
(204, 75, 'Mathmaticss', NULL, 'Follow all the steps', '2022-11-24 09:08:30', '2022-11-24 09:08:30'),
(205, 75, 'Physics', NULL, 'Follow all the steps', '2022-11-24 09:08:30', '2022-11-24 09:08:30'),
(206, 75, 'Chemestry', NULL, 'Follow all the steps', '2022-11-24 09:08:30', '2022-11-24 09:08:30'),
(207, 76, 'Mathmaticss', NULL, 'Follow all the steps', '2022-11-24 09:08:30', '2022-11-24 09:08:30'),
(208, 76, 'Physics', NULL, 'Follow all the steps', '2022-11-24 09:08:30', '2022-11-24 09:08:30'),
(209, 76, 'Chemestry', NULL, 'Follow all the steps', '2022-11-24 09:08:30', '2022-11-24 09:08:30'),
(210, 77, 'Mathematics', NULL, 'this an instruction', '2022-11-24 09:13:12', '2022-11-24 09:13:12'),
(211, 77, 'Physics', NULL, 'this an instruction', '2022-11-24 09:13:12', '2022-11-24 09:13:12'),
(212, 77, 'Chemestry', NULL, 'this an instruction', '2022-11-24 09:13:12', '2022-11-24 09:13:12'),
(213, 78, 'Mathmaticss', NULL, 'Follow all the steps', '2022-11-24 09:22:21', '2022-11-24 09:22:21'),
(214, 78, 'Physics', NULL, 'Follow all the steps', '2022-11-24 09:22:21', '2022-11-24 09:22:21'),
(215, 78, 'Chemestry', NULL, 'Follow all the steps', '2022-11-24 09:22:21', '2022-11-24 09:22:21'),
(216, 79, 'Mathmaticss', NULL, 'Follow all the steps', '2022-11-24 09:22:29', '2022-11-24 09:22:29'),
(217, 79, 'Physics', NULL, 'Follow all the steps', '2022-11-24 09:22:29', '2022-11-24 09:22:29'),
(218, 79, 'Chemestry', NULL, 'Follow all the steps', '2022-11-24 09:22:29', '2022-11-24 09:22:29'),
(219, 80, 'Mathmaticss', NULL, 'Follow all the steps', '2022-11-24 09:22:36', '2022-11-24 09:22:36'),
(220, 80, 'Physics', NULL, 'Follow all the steps', '2022-11-24 09:22:36', '2022-11-24 09:22:36'),
(221, 80, 'Chemestry', NULL, 'Follow all the steps', '2022-11-24 09:22:36', '2022-11-24 09:22:36'),
(222, 81, 'Mathmaticss', NULL, 'Follow all the steps', '2022-11-24 09:22:45', '2022-11-24 09:22:45'),
(223, 81, 'Physics', NULL, 'Follow all the steps', '2022-11-24 09:22:45', '2022-11-24 09:22:45'),
(224, 81, 'Chemestry', NULL, 'Follow all the steps', '2022-11-24 09:22:45', '2022-11-24 09:22:45'),
(225, 82, 'Mathmaticss', NULL, 'Follow all the steps', '2022-11-24 09:22:46', '2022-11-24 09:22:46'),
(226, 82, 'Physics', NULL, 'Follow all the steps', '2022-11-24 09:22:46', '2022-11-24 09:22:46'),
(227, 82, 'Chemestry', NULL, 'Follow all the steps', '2022-11-24 09:22:46', '2022-11-24 09:22:46'),
(228, 83, 'Mathmaticss', NULL, 'Follow all the steps', '2022-11-24 09:22:47', '2022-11-24 09:22:47'),
(229, 83, 'Physics', NULL, 'Follow all the steps', '2022-11-24 09:22:47', '2022-11-24 09:22:47'),
(230, 83, 'Chemestry', NULL, 'Follow all the steps', '2022-11-24 09:22:47', '2022-11-24 09:22:47'),
(231, 84, 'Mathmaticss', NULL, 'Follow all the steps', '2022-11-24 09:22:48', '2022-11-24 09:22:48'),
(232, 84, 'Physics', NULL, 'Follow all the steps', '2022-11-24 09:22:48', '2022-11-24 09:22:48'),
(233, 84, 'Chemestry', NULL, 'Follow all the steps', '2022-11-24 09:22:48', '2022-11-24 09:22:48'),
(234, 85, 'Mathmaticss', NULL, 'Follow all the steps', '2022-11-24 09:22:48', '2022-11-24 09:22:48'),
(235, 85, 'Physics', NULL, 'Follow all the steps', '2022-11-24 09:22:48', '2022-11-24 09:22:48'),
(236, 85, 'Chemestry', NULL, 'Follow all the steps', '2022-11-24 09:22:48', '2022-11-24 09:22:48'),
(237, 86, 'Mathmaticss', NULL, 'Follow all the steps', '2022-11-24 09:22:49', '2022-11-24 09:22:49'),
(238, 86, 'Physics', NULL, 'Follow all the steps', '2022-11-24 09:22:49', '2022-11-24 09:22:49'),
(239, 86, 'Chemestry', NULL, 'Follow all the steps', '2022-11-24 09:22:49', '2022-11-24 09:22:49'),
(240, 87, 'Mathmaticss', NULL, 'Follow all the steps', '2022-11-24 09:22:52', '2022-11-24 09:22:52'),
(241, 87, 'Physics', NULL, 'Follow all the steps', '2022-11-24 09:22:52', '2022-11-24 09:22:52'),
(242, 87, 'Chemestry', NULL, 'Follow all the steps', '2022-11-24 09:22:52', '2022-11-24 09:22:52'),
(243, 88, 'Mathmaticss', NULL, 'Follow all the steps', '2022-11-24 09:22:54', '2022-11-24 09:22:54'),
(244, 88, 'Physics', NULL, 'Follow all the steps', '2022-11-24 09:22:54', '2022-11-24 09:22:54'),
(245, 88, 'Chemestry', NULL, 'Follow all the steps', '2022-11-24 09:22:54', '2022-11-24 09:22:54'),
(246, 89, 'Mathmaticss', NULL, 'Follow all the steps', '2022-11-24 09:22:54', '2022-11-24 09:22:54'),
(247, 89, 'Physics', NULL, 'Follow all the steps', '2022-11-24 09:22:54', '2022-11-24 09:22:54'),
(248, 89, 'Chemestry', NULL, 'Follow all the steps', '2022-11-24 09:22:54', '2022-11-24 09:22:54'),
(249, 90, 'Mathmaticss', NULL, 'Follow all the steps', '2022-11-24 09:22:55', '2022-11-24 09:22:55'),
(250, 90, 'Physics', NULL, 'Follow all the steps', '2022-11-24 09:22:55', '2022-11-24 09:22:55'),
(251, 90, 'Chemestry', NULL, 'Follow all the steps', '2022-11-24 09:22:55', '2022-11-24 09:22:55'),
(252, 91, 'Mathmaticss', NULL, 'Follow all the steps', '2022-11-24 09:22:56', '2022-11-24 09:22:56'),
(253, 91, 'Physics', NULL, 'Follow all the steps', '2022-11-24 09:22:56', '2022-11-24 09:22:56'),
(254, 91, 'Chemestry', NULL, 'Follow all the steps', '2022-11-24 09:22:56', '2022-11-24 09:22:56'),
(255, 92, 'Mathmaticss', NULL, 'Follow all the steps', '2022-11-24 09:22:56', '2022-11-24 09:22:56'),
(256, 92, 'Physics', NULL, 'Follow all the steps', '2022-11-24 09:22:56', '2022-11-24 09:22:56'),
(257, 92, 'Chemestry', NULL, 'Follow all the steps', '2022-11-24 09:22:56', '2022-11-24 09:22:56'),
(258, 93, 'Mathmaticss', NULL, 'Follow all the steps', '2022-11-24 09:22:57', '2022-11-24 09:22:57'),
(259, 93, 'Physics', NULL, 'Follow all the steps', '2022-11-24 09:22:57', '2022-11-24 09:22:57'),
(260, 93, 'Chemestry', NULL, 'Follow all the steps', '2022-11-24 09:22:57', '2022-11-24 09:22:57'),
(261, 94, 'Mathmaticss', NULL, 'Follow all the steps', '2022-11-24 09:22:58', '2022-11-24 09:22:58'),
(262, 94, 'Physics', NULL, 'Follow all the steps', '2022-11-24 09:22:58', '2022-11-24 09:22:58'),
(263, 94, 'Chemestry', NULL, 'Follow all the steps', '2022-11-24 09:22:58', '2022-11-24 09:22:58'),
(264, 95, 'Mathmaticss', NULL, 'Follow all the steps', '2022-11-24 09:22:59', '2022-11-24 09:22:59'),
(265, 95, 'Physics', NULL, 'Follow all the steps', '2022-11-24 09:22:59', '2022-11-24 09:22:59'),
(266, 95, 'Chemestry', NULL, 'Follow all the steps', '2022-11-24 09:22:59', '2022-11-24 09:22:59'),
(267, 96, 'Mathematics', NULL, 'this an instruction', '2022-11-24 09:25:01', '2022-11-24 09:25:01'),
(268, 96, 'Physics', NULL, 'this an instruction', '2022-11-24 09:25:01', '2022-11-24 09:25:01'),
(269, 96, 'Chemestry', NULL, 'this an instruction', '2022-11-24 09:25:01', '2022-11-24 09:25:01'),
(270, 97, 'Mathematics', NULL, 'this an instruction', '2022-11-24 09:25:13', '2022-11-24 09:25:13'),
(271, 97, 'Physics', NULL, 'this an instruction', '2022-11-24 09:25:13', '2022-11-24 09:25:13'),
(272, 97, 'Chemestry', NULL, 'this an instruction', '2022-11-24 09:25:13', '2022-11-24 09:25:13'),
(273, 98, 'Mathematics', NULL, 'this an instruction', '2022-11-24 09:25:23', '2022-11-24 09:25:23'),
(274, 98, 'Physics', NULL, 'this an instruction', '2022-11-24 09:25:23', '2022-11-24 09:25:23'),
(275, 98, 'Chemestry', NULL, 'this an instruction', '2022-11-24 09:25:23', '2022-11-24 09:25:23'),
(276, 99, 'Mathematics', NULL, 'this an instruction', '2022-11-24 09:27:32', '2022-11-24 09:27:32'),
(277, 99, 'Physics', NULL, 'this an instruction', '2022-11-24 09:27:32', '2022-11-24 09:27:32'),
(278, 99, 'Chemestry', NULL, 'this an instruction', '2022-11-24 09:27:32', '2022-11-24 09:27:32'),
(279, 100, 'Mathematics', NULL, 'this an instruction', '2022-11-24 09:27:38', '2022-11-24 09:27:38'),
(280, 100, 'Physics', NULL, 'this an instruction', '2022-11-24 09:27:38', '2022-11-24 09:27:38'),
(281, 100, 'Chemestry', NULL, 'this an instruction', '2022-11-24 09:27:38', '2022-11-24 09:27:38'),
(282, 101, 'Mathmaticss', NULL, 'Follow all the steps', '2022-11-24 09:35:35', '2022-11-24 09:35:35'),
(283, 101, 'Physics', NULL, 'Follow all the steps', '2022-11-24 09:35:35', '2022-11-24 09:35:35'),
(284, 101, 'Chemestry', NULL, 'Follow all the steps', '2022-11-24 09:35:35', '2022-11-24 09:35:35'),
(285, 102, 'Mathematics', NULL, 'this an instruction', '2022-11-24 09:44:52', '2022-11-24 09:44:52'),
(286, 102, 'Physics', NULL, 'this an instruction', '2022-11-24 09:44:52', '2022-11-24 09:44:52'),
(287, 102, 'Chemestry', NULL, 'this an instruction', '2022-11-24 09:44:52', '2022-11-24 09:44:52'),
(288, 103, 'Mathematics', NULL, 'this an instruction', '2022-11-24 10:12:38', '2022-11-24 10:12:38'),
(289, 103, 'Physics', NULL, 'this an instruction', '2022-11-24 10:12:38', '2022-11-24 10:12:38'),
(290, 103, 'Chemestry', NULL, 'this an instruction', '2022-11-24 10:12:38', '2022-11-24 10:12:38'),
(291, 104, 'Mathematics', NULL, 'this an instruction', '2022-11-24 10:33:49', '2022-11-24 10:33:49'),
(292, 104, 'Physics', NULL, 'this an instruction', '2022-11-24 10:33:49', '2022-11-24 10:33:49'),
(293, 104, 'Chemestry', NULL, 'this an instruction', '2022-11-24 10:33:49', '2022-11-24 10:33:49'),
(294, 105, 'Mathematics', NULL, 'this an instruction', '2022-11-24 10:33:52', '2022-11-24 10:33:52'),
(295, 105, 'Physics', NULL, 'this an instruction', '2022-11-24 10:33:52', '2022-11-24 10:33:52'),
(296, 105, 'Chemestry', NULL, 'this an instruction', '2022-11-24 10:33:52', '2022-11-24 10:33:52'),
(297, 106, 'Mathematics', NULL, 'this an instruction', '2022-11-24 10:36:57', '2022-11-24 10:36:57'),
(298, 106, 'Physics', NULL, 'this an instruction', '2022-11-24 10:36:57', '2022-11-24 10:36:57'),
(299, 106, 'Chemestry', NULL, 'this an instruction', '2022-11-24 10:36:57', '2022-11-24 10:36:57'),
(300, 107, 'Mathematics', NULL, 'this an instruction', '2022-11-24 10:37:07', '2022-11-24 10:37:07'),
(301, 107, 'Physics', NULL, 'this an instruction', '2022-11-24 10:37:07', '2022-11-24 10:37:07'),
(302, 107, 'Chemestry', NULL, 'this an instruction', '2022-11-24 10:37:07', '2022-11-24 10:37:07'),
(303, 108, 'Mathematics', NULL, 'this an instruction', '2022-11-24 10:37:09', '2022-11-24 10:37:09'),
(304, 108, 'Physics', NULL, 'this an instruction', '2022-11-24 10:37:09', '2022-11-24 10:37:09'),
(305, 108, 'Chemestry', NULL, 'this an instruction', '2022-11-24 10:37:09', '2022-11-24 10:37:09'),
(306, 109, 'Mathmaticss', NULL, 'Follow all the steps', '2022-11-24 10:39:44', '2022-11-24 10:39:44'),
(307, 109, 'Physics', NULL, 'Follow all the steps', '2022-11-24 10:39:44', '2022-11-24 10:39:44'),
(308, 109, 'Chemestry', NULL, 'Follow all the steps', '2022-11-24 10:39:44', '2022-11-24 10:39:44'),
(309, 110, 'Mathematics', NULL, 'this an instruction', '2022-11-24 14:32:56', '2022-11-24 14:32:56'),
(310, 110, 'Physics', NULL, 'this an instruction', '2022-11-24 14:32:56', '2022-11-24 14:32:56'),
(311, 110, 'Chemestry', NULL, 'this an instruction', '2022-11-24 14:32:56', '2022-11-24 14:32:56'),
(312, 111, 'Mathmaticss', NULL, 'Follow all the steps', '2022-11-29 08:15:38', '2022-11-29 08:15:38'),
(313, 111, 'Physics', NULL, 'Follow all the steps', '2022-11-29 08:15:38', '2022-11-29 08:15:38'),
(314, 111, 'Chemestry', NULL, 'Follow all the steps', '2022-11-29 08:15:38', '2022-11-29 08:15:38'),
(315, 112, 'Mathematics', NULL, 'this an instruction', '2022-11-29 09:38:01', '2022-11-29 09:38:01'),
(316, 112, 'Physics', NULL, 'this an instruction', '2022-11-29 09:38:01', '2022-11-29 09:38:01'),
(317, 112, 'Chemestry', NULL, 'this an instruction', '2022-11-29 09:38:01', '2022-11-29 09:38:01'),
(318, 113, 'Mathematics', NULL, 'this an instruction', '2022-11-29 09:38:07', '2022-11-29 09:38:07'),
(319, 113, 'Physics', NULL, 'this an instruction', '2022-11-29 09:38:07', '2022-11-29 09:38:07'),
(320, 113, 'Chemestry', NULL, 'this an instruction', '2022-11-29 09:38:07', '2022-11-29 09:38:07'),
(321, 114, 'Mathematics', NULL, 'this an instruction', '2022-12-09 19:53:02', '2022-12-09 19:53:02'),
(322, 114, 'Physics', NULL, 'this an instruction', '2022-12-09 19:53:02', '2022-12-09 19:53:02'),
(323, 114, 'Chemestry', NULL, 'this an instruction', '2022-12-09 19:53:02', '2022-12-09 19:53:02'),
(324, 115, 'Mathematics', NULL, 'This is an instruction', '2022-12-10 11:33:17', '2022-12-10 11:33:17'),
(325, 115, 'Physics', NULL, 'This is an instruction', '2022-12-10 11:33:17', '2022-12-10 11:33:17'),
(326, 115, 'Chemestry', NULL, 'This is an instruction', '2022-12-10 11:33:17', '2022-12-10 11:33:17'),
(327, 116, 'Mathmaticss', NULL, 'Follow all the steps', '2022-12-12 10:23:28', '2022-12-12 10:23:28'),
(328, 116, 'Physics', NULL, 'Follow all the steps', '2022-12-12 10:23:28', '2022-12-12 10:23:28'),
(329, 116, 'Chemestry', NULL, 'Follow all the steps', '2022-12-12 10:23:28', '2022-12-12 10:23:28'),
(330, 117, 'Mathematics', NULL, 'this an instruction', '2022-12-13 09:39:43', '2022-12-13 09:39:43'),
(331, 117, 'Physics', NULL, 'this an instruction', '2022-12-13 09:39:43', '2022-12-13 09:39:43'),
(332, 117, 'Chemestry', NULL, 'this an instruction', '2022-12-13 09:39:43', '2022-12-13 09:39:43'),
(333, 118, 'Mathematics', NULL, 'This is an instruction', '2022-12-13 17:55:00', '2022-12-13 17:55:00'),
(334, 118, 'Physics', NULL, 'This is an instruction', '2022-12-13 17:55:00', '2022-12-13 17:55:00'),
(335, 118, 'Chemestry', NULL, 'This is an instruction', '2022-12-13 17:55:00', '2022-12-13 17:55:00'),
(336, 119, 'Mathematics', NULL, 'This is an instruction', '2022-12-15 16:10:59', '2022-12-15 16:10:59'),
(337, 119, 'Physics', NULL, 'This is an instruction', '2022-12-15 16:10:59', '2022-12-15 16:10:59'),
(338, 119, 'Chemestry', NULL, 'This is an instruction', '2022-12-15 16:10:59', '2022-12-15 16:10:59'),
(339, 120, 'Mathematics', NULL, 'This is an instruction', '2022-12-19 08:59:48', '2022-12-19 08:59:48'),
(340, 120, 'Physics', NULL, 'This is an instruction', '2022-12-19 08:59:48', '2022-12-19 08:59:48'),
(341, 120, 'Chemestry', NULL, 'This is an instruction', '2022-12-19 08:59:48', '2022-12-19 08:59:48'),
(342, 121, 'Mathematics', NULL, 'this an instruction', '2022-12-22 17:15:30', '2022-12-22 17:15:30'),
(343, 121, 'Physics', NULL, 'this an instruction', '2022-12-22 17:15:30', '2022-12-22 17:15:30'),
(344, 121, 'Chemestry', NULL, 'this an instruction', '2022-12-22 17:15:30', '2022-12-22 17:15:30'),
(345, 122, 'Mathematics', NULL, 'this an instruction', '2022-12-26 17:25:35', '2022-12-26 17:25:35'),
(346, 122, 'Physics', NULL, 'this an instruction', '2022-12-26 17:25:35', '2022-12-26 17:25:35'),
(347, 122, 'Chemestry', NULL, 'this an instruction', '2022-12-26 17:25:35', '2022-12-26 17:25:35');

-- --------------------------------------------------------

--
-- Table structure for table `exam_topic`
--

DROP TABLE IF EXISTS `exam_topic`;
CREATE TABLE IF NOT EXISTS `exam_topic` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `exam_id` bigint UNSIGNED NOT NULL,
  `topic_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `exam_topic_exam_id_foreign` (`exam_id`),
  KEY `exam_topic_topic_id_foreign` (`topic_id`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `exam_topic`
--

INSERT INTO `exam_topic` (`id`, `exam_id`, `topic_id`, `created_at`, `updated_at`) VALUES
(1, 3, 1, NULL, NULL),
(2, 4, 1, NULL, NULL),
(3, 5, 1, NULL, NULL),
(4, 6, 1, NULL, NULL),
(5, 7, 1, NULL, NULL),
(6, 8, 1, NULL, NULL),
(7, 9, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `exam_types`
--

DROP TABLE IF EXISTS `exam_types`;
CREATE TABLE IF NOT EXISTS `exam_types` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `exam_category_id` bigint UNSIGNED NOT NULL,
  `name` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `exam_types_exam_category_id_foreign` (`exam_category_id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `exam_types`
--

INSERT INTO `exam_types` (`id`, `exam_category_id`, `name`, `created_at`, `updated_at`) VALUES
(1, 1, 'JEE Mains', '2022-10-17 18:08:02', '2022-10-17 18:08:02'),
(2, 1, 'JEE Advance', '2022-10-17 18:08:02', '2022-10-17 18:08:02');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
CREATE TABLE IF NOT EXISTS `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `institutes`
--

DROP TABLE IF EXISTS `institutes`;
CREATE TABLE IF NOT EXISTS `institutes` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `state` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `establishment_year` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pin_code` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `institutes`
--

INSERT INTO `institutes` (`id`, `name`, `address`, `state`, `city`, `establishment_year`, `pin_code`, `created_at`, `updated_at`) VALUES
(1, 'Unesa', 'Surabaya', 'Andaman and Nicobar Islands', 'Bamboo Flat', '1950', '8080', '2022-10-17 18:08:00', '2022-10-17 18:08:00'),
(2, 'Um', 'Malang', 'Andaman and Nicobar Islands', 'Nicobar', '1959', '9090', '2022-10-17 18:08:00', '2022-10-17 18:08:00');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
CREATE TABLE IF NOT EXISTS `jobs` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `queue` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `jobs`
--

INSERT INTO `jobs` (`id`, `queue`, `payload`, `attempts`, `reserved_at`, `available_at`, `created_at`) VALUES
(1, 'default', '{\"uuid\":\"b4a95c5b-96fb-4cd4-9f23-54c3ca4b314a\",\"displayName\":\"App\\\\Listeners\\\\AnnouncementCreatedListener\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Events\\\\CallQueuedListener\",\"command\":\"O:36:\\\"Illuminate\\\\Events\\\\CallQueuedListener\\\":19:{s:5:\\\"class\\\";s:41:\\\"App\\\\Listeners\\\\AnnouncementCreatedListener\\\";s:6:\\\"method\\\";s:6:\\\"handle\\\";s:4:\\\"data\\\";a:1:{i:0;O:30:\\\"App\\\\Events\\\\AnnouncementCreated\\\":2:{s:12:\\\"announcement\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":4:{s:5:\\\"class\\\";s:23:\\\"App\\\\Models\\\\Announcement\\\";s:2:\\\"id\\\";i:3;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";}s:6:\\\"socket\\\";N;}}s:5:\\\"tries\\\";N;s:13:\\\"maxExceptions\\\";N;s:7:\\\"backoff\\\";N;s:10:\\\"retryUntil\\\";N;s:7:\\\"timeout\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:3:\\\"job\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}}\"}}', 0, NULL, 1667204875, 1667204875),
(2, 'default', '{\"uuid\":\"e82cc0d1-acce-4fad-8f0d-5d2e23442cf2\",\"displayName\":\"App\\\\Listeners\\\\AnnouncementCreatedListener\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Events\\\\CallQueuedListener\",\"command\":\"O:36:\\\"Illuminate\\\\Events\\\\CallQueuedListener\\\":19:{s:5:\\\"class\\\";s:41:\\\"App\\\\Listeners\\\\AnnouncementCreatedListener\\\";s:6:\\\"method\\\";s:6:\\\"handle\\\";s:4:\\\"data\\\";a:1:{i:0;O:30:\\\"App\\\\Events\\\\AnnouncementCreated\\\":2:{s:12:\\\"announcement\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":4:{s:5:\\\"class\\\";s:23:\\\"App\\\\Models\\\\Announcement\\\";s:2:\\\"id\\\";i:4;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";}s:6:\\\"socket\\\";N;}}s:5:\\\"tries\\\";N;s:13:\\\"maxExceptions\\\";N;s:7:\\\"backoff\\\";N;s:10:\\\"retryUntil\\\";N;s:7:\\\"timeout\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:3:\\\"job\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}}\"}}', 0, NULL, 1667985786, 1667985786),
(3, 'default', '{\"uuid\":\"fc3b756f-08ee-4ba6-b129-542aa7326c14\",\"displayName\":\"App\\\\Listeners\\\\AnnouncementCreatedListener\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Events\\\\CallQueuedListener\",\"command\":\"O:36:\\\"Illuminate\\\\Events\\\\CallQueuedListener\\\":19:{s:5:\\\"class\\\";s:41:\\\"App\\\\Listeners\\\\AnnouncementCreatedListener\\\";s:6:\\\"method\\\";s:6:\\\"handle\\\";s:4:\\\"data\\\";a:1:{i:0;O:30:\\\"App\\\\Events\\\\AnnouncementCreated\\\":2:{s:12:\\\"announcement\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":4:{s:5:\\\"class\\\";s:23:\\\"App\\\\Models\\\\Announcement\\\";s:2:\\\"id\\\";i:5;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";}s:6:\\\"socket\\\";N;}}s:5:\\\"tries\\\";N;s:13:\\\"maxExceptions\\\";N;s:7:\\\"backoff\\\";N;s:10:\\\"retryUntil\\\";N;s:7:\\\"timeout\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:3:\\\"job\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}}\"}}', 0, NULL, 1667987013, 1667987013),
(4, 'default', '{\"uuid\":\"14ecbea2-409f-4241-ab8f-1f768e2b51be\",\"displayName\":\"App\\\\Listeners\\\\AnnouncementCreatedListener\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Events\\\\CallQueuedListener\",\"command\":\"O:36:\\\"Illuminate\\\\Events\\\\CallQueuedListener\\\":19:{s:5:\\\"class\\\";s:41:\\\"App\\\\Listeners\\\\AnnouncementCreatedListener\\\";s:6:\\\"method\\\";s:6:\\\"handle\\\";s:4:\\\"data\\\";a:1:{i:0;O:30:\\\"App\\\\Events\\\\AnnouncementCreated\\\":2:{s:12:\\\"announcement\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":4:{s:5:\\\"class\\\";s:23:\\\"App\\\\Models\\\\Announcement\\\";s:2:\\\"id\\\";i:6;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";}s:6:\\\"socket\\\";N;}}s:5:\\\"tries\\\";N;s:13:\\\"maxExceptions\\\";N;s:7:\\\"backoff\\\";N;s:10:\\\"retryUntil\\\";N;s:7:\\\"timeout\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:3:\\\"job\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}}\"}}', 0, NULL, 1667987159, 1667987159),
(5, 'default', '{\"uuid\":\"a5b76e9a-dd9d-472a-af11-c466ebc0758d\",\"displayName\":\"App\\\\Listeners\\\\AnnouncementCreatedListener\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Events\\\\CallQueuedListener\",\"command\":\"O:36:\\\"Illuminate\\\\Events\\\\CallQueuedListener\\\":19:{s:5:\\\"class\\\";s:41:\\\"App\\\\Listeners\\\\AnnouncementCreatedListener\\\";s:6:\\\"method\\\";s:6:\\\"handle\\\";s:4:\\\"data\\\";a:1:{i:0;O:30:\\\"App\\\\Events\\\\AnnouncementCreated\\\":2:{s:12:\\\"announcement\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":4:{s:5:\\\"class\\\";s:23:\\\"App\\\\Models\\\\Announcement\\\";s:2:\\\"id\\\";i:7;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";}s:6:\\\"socket\\\";N;}}s:5:\\\"tries\\\";N;s:13:\\\"maxExceptions\\\";N;s:7:\\\"backoff\\\";N;s:10:\\\"retryUntil\\\";N;s:7:\\\"timeout\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:3:\\\"job\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}}\"}}', 0, NULL, 1668089021, 1668089021),
(6, 'default', '{\"uuid\":\"096ce1d9-b116-4632-918b-a0d35a6f0bb2\",\"displayName\":\"App\\\\Listeners\\\\EnrollmentStatusListener\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Events\\\\CallQueuedListener\",\"command\":\"O:36:\\\"Illuminate\\\\Events\\\\CallQueuedListener\\\":19:{s:5:\\\"class\\\";s:38:\\\"App\\\\Listeners\\\\EnrollmentStatusListener\\\";s:6:\\\"method\\\";s:6:\\\"handle\\\";s:4:\\\"data\\\";a:1:{i:0;O:27:\\\"App\\\\Events\\\\EnrollmentStatus\\\":2:{s:10:\\\"enrollment\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":4:{s:5:\\\"class\\\";s:21:\\\"App\\\\Models\\\\Enrollment\\\";s:2:\\\"id\\\";i:1;s:9:\\\"relations\\\";a:3:{i:0;s:9:\\\"institute\\\";i:1;s:6:\\\"branch\\\";i:2;s:5:\\\"batch\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";}s:6:\\\"socket\\\";N;}}s:5:\\\"tries\\\";N;s:13:\\\"maxExceptions\\\";N;s:7:\\\"backoff\\\";N;s:10:\\\"retryUntil\\\";N;s:7:\\\"timeout\\\";N;s:17:\\\"shouldBeEncrypted\\\";b:0;s:3:\\\"job\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}}\"}}', 0, NULL, 1669647273, 1669647273);

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `migration` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2014_10_12_000000_create_users_table', 1),
(2, '2014_10_12_100000_create_password_resets_table', 1),
(3, '2019_08_19_000000_create_failed_jobs_table', 1),
(4, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(5, '2021_12_05_021317_create_jobs_table', 1),
(6, '2021_12_05_073744_create_social_accounts_table', 1),
(7, '2021_12_10_054308_create_institutes_table', 1),
(8, '2021_12_10_054839_create_branches_table', 1),
(9, '2021_12_10_080528_create_batches_table', 1),
(10, '2021_12_10_092604_add_insitute_id_to_users', 1),
(11, '2021_12_10_103727_add_employee_id_to_users', 1),
(12, '2021_12_13_030702_create_topics_table', 1),
(13, '2021_12_13_035637_create_news_table', 1),
(14, '2021_12_16_020101_create_permission_tables', 1),
(15, '2021_12_25_112258_create_exam_categories_table', 1),
(16, '2021_12_25_112338_create_exam_types_table', 1),
(17, '2021_12_28_143326_create_enrollments_table', 1),
(18, '2022_01_02_052652_create_notifications_table', 1),
(19, '2022_01_02_054034_create_announcements_table', 1),
(20, '2022_01_06_031355_add_status_to_news', 1),
(21, '2022_01_08_083136_create_exams_table', 1),
(22, '2022_01_14_095245_create_exam_topic_table', 1),
(23, '2022_01_14_101042_create_branch_exam_table', 1),
(24, '2022_01_14_101123_create_batch_exam_table', 1),
(25, '2022_01_14_101258_create_exam_sections_table', 1),
(26, '2022_01_14_102259_create_exam_questions_table', 1),
(27, '2022_01_14_103328_create_exam_question_items_table', 1),
(28, '2022_01_14_104212_create_exam_options_table', 1),
(29, '2022_01_18_123634_add_status_to_exams', 1),
(30, '2022_01_19_024055_create_announcement_branch_table', 1),
(31, '2022_01_19_024257_create_announcement_batch_table', 1),
(32, '2022_01_20_003711_create_quizzes_table', 1),
(33, '2022_01_20_004520_create_quiz_questions_table', 1),
(34, '2022_01_20_004846_create_quiz_options_table', 1),
(35, '2022_01_24_103844_create_practices_table', 1),
(36, '2022_01_24_105944_create_practice_sections_table', 1),
(37, '2022_01_24_110916_create_practice_questions_table', 1),
(38, '2022_01_24_115833_create_practice_question_items_table', 1),
(39, '2022_01_24_120112_create_practice_options_table', 1),
(40, '2022_01_24_120359_create_practice_topic_table', 1),
(41, '2022_02_28_224034_add_slug_to_exams', 1),
(42, '2022_03_01_035837_create_exam_results_table', 1),
(43, '2022_03_01_040237_create_exam_result_details_table', 1),
(44, '2022_03_01_040255_create_exam_result_detail_options_table', 1),
(45, '2022_03_03_045310_add_slug_to_practices', 1),
(46, '2022_03_03_054408_create_practice_results_table', 1),
(47, '2022_03_03_054432_create_practice_result_details_table', 1),
(48, '2022_03_03_054449_create_practice_result_detail_options_table', 1),
(49, '2022_03_03_124523_create_quiz_results_table', 1),
(50, '2022_03_03_124554_create_quiz_result_details_table', 1),
(51, '2022_03_03_124621_create_quiz_result_detail_options_table', 1),
(52, '2022_03_03_124714_add_slug_to_quizzes', 1),
(53, '2022_03_05_101054_create_user_preferred_table', 1),
(54, '2022_03_17_041103_create_practice_result_dtemps_table', 1),
(55, '2022_03_17_041151_create_practice_result_do_temps_table', 1),
(56, '2022_03_22_075824_add_duration_to_exams', 1),
(57, '2022_03_22_085505_add_duration_to_practices', 1),
(58, '2022_03_25_013222_add_current_section_to_practice_results', 1),
(59, '2022_03_25_070131_create_exam_result_dtemps_table', 1),
(60, '2022_03_25_070348_create_exam_result_do_temps_table', 1),
(61, '2022_03_26_050936_create_quiz_result_dtemps_table', 1),
(62, '2022_03_26_051012_create_quiz_result_do_temps_table', 1),
(63, '2022_04_06_104627_add_remaining_second_to_exam_results', 1),
(64, '2022_07_01_121329_enrollment_student_editable', 1),
(67, '2022_11_17_145838_exam_configuration', 2);

-- --------------------------------------------------------

--
-- Table structure for table `model_has_permissions`
--

DROP TABLE IF EXISTS `model_has_permissions`;
CREATE TABLE IF NOT EXISTS `model_has_permissions` (
  `permission_id` bigint UNSIGNED NOT NULL,
  `model_type` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint UNSIGNED NOT NULL,
  PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
  KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `model_has_roles`
--

DROP TABLE IF EXISTS `model_has_roles`;
CREATE TABLE IF NOT EXISTS `model_has_roles` (
  `role_id` bigint UNSIGNED NOT NULL,
  `model_type` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint UNSIGNED NOT NULL,
  PRIMARY KEY (`role_id`,`model_id`,`model_type`),
  KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `model_has_roles`
--

INSERT INTO `model_has_roles` (`role_id`, `model_type`, `model_id`) VALUES
(1, 'App\\Models\\User', 1),
(2, 'App\\Models\\User', 2),
(2, 'App\\Models\\User', 3),
(3, 'App\\Models\\User', 6),
(4, 'App\\Models\\User', 4),
(4, 'App\\Models\\User', 5),
(5, 'App\\Models\\User', 7),
(5, 'App\\Models\\User', 8);

-- --------------------------------------------------------

--
-- Table structure for table `news`
--

DROP TABLE IF EXISTS `news`;
CREATE TABLE IF NOT EXISTS `news` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `title` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sub_title` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `tags` json NOT NULL,
  `image` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('published','draft') COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `news_user_id_foreign` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notifiable_type` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notifiable_id` bigint UNSIGNED NOT NULL,
  `data` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `notifications_notifiable_type_notifiable_id_index` (`notifiable_type`,`notifiable_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

DROP TABLE IF EXISTS `password_resets`;
CREATE TABLE IF NOT EXISTS `password_resets` (
  `email` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  KEY `password_resets_email_index` (`email`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
CREATE TABLE IF NOT EXISTS `permissions` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(125) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guard_name` varchar(125) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permissions_name_guard_name_unique` (`name`,`guard_name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
CREATE TABLE IF NOT EXISTS `personal_access_tokens` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint UNSIGNED NOT NULL,
  `name` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `practices`
--

DROP TABLE IF EXISTS `practices`;
CREATE TABLE IF NOT EXISTS `practices` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `institute_id` bigint UNSIGNED DEFAULT NULL,
  `exam_category_id` bigint UNSIGNED NOT NULL,
  `exam_type_id` bigint UNSIGNED DEFAULT NULL,
  `name` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('published','draft') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `start_date` date DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `instruction` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `duration` int DEFAULT NULL,
  `consentments` json NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `practices_user_id_foreign` (`user_id`),
  KEY `practices_institute_id_foreign` (`institute_id`),
  KEY `practices_exam_category_id_foreign` (`exam_category_id`),
  KEY `practices_exam_type_id_foreign` (`exam_type_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `practice_options`
--

DROP TABLE IF EXISTS `practice_options`;
CREATE TABLE IF NOT EXISTS `practice_options` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `practice_question_item_id` bigint UNSIGNED NOT NULL,
  `title` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `correct` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `practice_options_practice_question_item_id_foreign` (`practice_question_item_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `practice_questions`
--

DROP TABLE IF EXISTS `practice_questions`;
CREATE TABLE IF NOT EXISTS `practice_questions` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `practice_section_id` bigint UNSIGNED NOT NULL,
  `type` enum('paragraph','simple') COLLATE utf8mb4_unicode_ci NOT NULL,
  `level` enum('easy','medium','hard') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tag` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `instruction` longtext COLLATE utf8mb4_unicode_ci,
  `paragraph` longtext COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `practice_questions_practice_section_id_foreign` (`practice_section_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `practice_question_items`
--

DROP TABLE IF EXISTS `practice_question_items`;
CREATE TABLE IF NOT EXISTS `practice_question_items` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `practice_question_id` bigint UNSIGNED NOT NULL,
  `level` enum('easy','medium','hard') COLLATE utf8mb4_unicode_ci NOT NULL,
  `tag` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `question` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `answer_type` enum('single','multiple') COLLATE utf8mb4_unicode_ci NOT NULL,
  `answer_explanation` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `mark` double(8,2) NOT NULL,
  `negative_mark` double(8,2) NOT NULL,
  `is_first_item` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `practice_question_items_practice_question_id_foreign` (`practice_question_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `practice_results`
--

DROP TABLE IF EXISTS `practice_results`;
CREATE TABLE IF NOT EXISTS `practice_results` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `practice_id` bigint UNSIGNED NOT NULL,
  `score` double(8,2) NOT NULL DEFAULT '0.00',
  `correct` int NOT NULL DEFAULT '0',
  `incorrect` int NOT NULL DEFAULT '0',
  `accuracy` int NOT NULL DEFAULT '0',
  `status` enum('done','process') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'process',
  `current_section` int DEFAULT NULL,
  `current_item` int DEFAULT NULL,
  `remaining_minute` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `practice_results_user_id_foreign` (`user_id`),
  KEY `practice_results_practice_id_foreign` (`practice_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `practice_result_details`
--

DROP TABLE IF EXISTS `practice_result_details`;
CREATE TABLE IF NOT EXISTS `practice_result_details` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `practice_result_id` bigint UNSIGNED NOT NULL,
  `practice_question_item_id` bigint UNSIGNED NOT NULL,
  `correct` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `practice_result_details_practice_result_id_foreign` (`practice_result_id`),
  KEY `practice_result_details_practice_question_item_id_foreign` (`practice_question_item_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `practice_result_detail_options`
--

DROP TABLE IF EXISTS `practice_result_detail_options`;
CREATE TABLE IF NOT EXISTS `practice_result_detail_options` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `practice_result_detail_id` bigint UNSIGNED NOT NULL,
  `practice_option_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `practice_result_detail_options_practice_result_detail_id_foreign` (`practice_result_detail_id`),
  KEY `practice_result_detail_options_practice_option_id_foreign` (`practice_option_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `practice_result_do_temps`
--

DROP TABLE IF EXISTS `practice_result_do_temps`;
CREATE TABLE IF NOT EXISTS `practice_result_do_temps` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `practice_result_dtemp_id` bigint UNSIGNED NOT NULL,
  `practice_option_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `practice_result_do_temps_practice_result_dtemp_id_foreign` (`practice_result_dtemp_id`),
  KEY `practice_result_do_temps_practice_option_id_foreign` (`practice_option_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `practice_result_dtemps`
--

DROP TABLE IF EXISTS `practice_result_dtemps`;
CREATE TABLE IF NOT EXISTS `practice_result_dtemps` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `practice_result_id` bigint UNSIGNED NOT NULL,
  `practice_question_item_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `practice_result_dtemps_practice_result_id_foreign` (`practice_result_id`),
  KEY `practice_result_dtemps_practice_question_item_id_foreign` (`practice_question_item_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `practice_sections`
--

DROP TABLE IF EXISTS `practice_sections`;
CREATE TABLE IF NOT EXISTS `practice_sections` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `practice_id` bigint UNSIGNED NOT NULL,
  `name` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `duration` int DEFAULT NULL,
  `instruction` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `practice_sections_practice_id_foreign` (`practice_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `practice_topic`
--

DROP TABLE IF EXISTS `practice_topic`;
CREATE TABLE IF NOT EXISTS `practice_topic` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `practice_id` bigint UNSIGNED NOT NULL,
  `topic_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `practice_topic_practice_id_foreign` (`practice_id`),
  KEY `practice_topic_topic_id_foreign` (`topic_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quizzes`
--

DROP TABLE IF EXISTS `quizzes`;
CREATE TABLE IF NOT EXISTS `quizzes` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `institute_id` bigint UNSIGNED DEFAULT NULL,
  `topic_id` bigint UNSIGNED DEFAULT NULL,
  `name` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('mixed','live') COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('published','draft') COLLATE utf8mb4_unicode_ci NOT NULL,
  `duration` int NOT NULL,
  `image` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `instruction` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `consentments` json NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `quizzes_user_id_foreign` (`user_id`),
  KEY `quizzes_institute_id_foreign` (`institute_id`),
  KEY `quizzes_topic_id_foreign` (`topic_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quiz_options`
--

DROP TABLE IF EXISTS `quiz_options`;
CREATE TABLE IF NOT EXISTS `quiz_options` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `quiz_question_id` bigint UNSIGNED NOT NULL,
  `title` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `correct` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `quiz_options_quiz_question_id_foreign` (`quiz_question_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quiz_questions`
--

DROP TABLE IF EXISTS `quiz_questions`;
CREATE TABLE IF NOT EXISTS `quiz_questions` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `quiz_id` bigint UNSIGNED NOT NULL,
  `level` enum('easy','medium','hard') COLLATE utf8mb4_unicode_ci NOT NULL,
  `tag` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `question` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `answer_type` enum('single','multiple') COLLATE utf8mb4_unicode_ci NOT NULL,
  `answer_explanation` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `mark` double(8,2) NOT NULL,
  `negative_mark` double(8,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `quiz_questions_quiz_id_foreign` (`quiz_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quiz_results`
--

DROP TABLE IF EXISTS `quiz_results`;
CREATE TABLE IF NOT EXISTS `quiz_results` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `quiz_id` bigint UNSIGNED NOT NULL,
  `score` double(8,2) NOT NULL DEFAULT '0.00',
  `correct` int NOT NULL DEFAULT '0',
  `incorrect` int NOT NULL DEFAULT '0',
  `accuracy` int NOT NULL DEFAULT '0',
  `status` enum('done','process') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'process',
  `current_item` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `quiz_results_user_id_foreign` (`user_id`),
  KEY `quiz_results_quiz_id_foreign` (`quiz_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quiz_result_details`
--

DROP TABLE IF EXISTS `quiz_result_details`;
CREATE TABLE IF NOT EXISTS `quiz_result_details` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `quiz_result_id` bigint UNSIGNED NOT NULL,
  `quiz_question_id` bigint UNSIGNED NOT NULL,
  `correct` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `quiz_result_details_quiz_result_id_foreign` (`quiz_result_id`),
  KEY `quiz_result_details_quiz_question_id_foreign` (`quiz_question_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quiz_result_detail_options`
--

DROP TABLE IF EXISTS `quiz_result_detail_options`;
CREATE TABLE IF NOT EXISTS `quiz_result_detail_options` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `quiz_result_detail_id` bigint UNSIGNED NOT NULL,
  `quiz_option_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `quiz_result_detail_options_quiz_result_detail_id_foreign` (`quiz_result_detail_id`),
  KEY `quiz_result_detail_options_quiz_option_id_foreign` (`quiz_option_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quiz_result_do_temps`
--

DROP TABLE IF EXISTS `quiz_result_do_temps`;
CREATE TABLE IF NOT EXISTS `quiz_result_do_temps` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `quiz_result_dtemp_id` bigint UNSIGNED NOT NULL,
  `quiz_option_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `quiz_result_do_temps_quiz_result_dtemp_id_foreign` (`quiz_result_dtemp_id`),
  KEY `quiz_result_do_temps_quiz_option_id_foreign` (`quiz_option_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quiz_result_dtemps`
--

DROP TABLE IF EXISTS `quiz_result_dtemps`;
CREATE TABLE IF NOT EXISTS `quiz_result_dtemps` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `quiz_result_id` bigint UNSIGNED NOT NULL,
  `quiz_question_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `quiz_result_dtemps_quiz_result_id_foreign` (`quiz_result_id`),
  KEY `quiz_result_dtemps_quiz_question_id_foreign` (`quiz_question_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
CREATE TABLE IF NOT EXISTS `roles` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(125) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guard_name` varchar(125) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_name_guard_name_unique` (`name`,`guard_name`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
(1, 'SA', 'api', '2022-10-17 18:08:00', '2022-10-17 18:08:00'),
(2, 'IA', 'api', '2022-10-17 18:08:00', '2022-10-17 18:08:00'),
(3, 'OT', 'api', '2022-10-17 18:08:00', '2022-10-17 18:08:00'),
(4, 'STF', 'api', '2022-10-17 18:08:00', '2022-10-17 18:08:00'),
(5, 'ST', 'api', '2022-10-17 18:08:00', '2022-10-17 18:08:00');

-- --------------------------------------------------------

--
-- Table structure for table `role_has_permissions`
--

DROP TABLE IF EXISTS `role_has_permissions`;
CREATE TABLE IF NOT EXISTS `role_has_permissions` (
  `permission_id` bigint UNSIGNED NOT NULL,
  `role_id` bigint UNSIGNED NOT NULL,
  PRIMARY KEY (`permission_id`,`role_id`),
  KEY `role_has_permissions_role_id_foreign` (`role_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `social_accounts`
--

DROP TABLE IF EXISTS `social_accounts`;
CREATE TABLE IF NOT EXISTS `social_accounts` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `provider_id` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `provider_name` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `social_accounts_provider_id_unique` (`provider_id`),
  KEY `social_accounts_user_id_foreign` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `topics`
--

DROP TABLE IF EXISTS `topics`;
CREATE TABLE IF NOT EXISTS `topics` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `topics`
--

INSERT INTO `topics` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'Topic 1', '2022-10-17 18:08:02', '2022-10-17 18:08:02'),
(2, 'Topic 2', '2022-10-17 18:08:02', '2022-10-17 18:08:02');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `institute_id` bigint UNSIGNED DEFAULT NULL,
  `branch_id` bigint UNSIGNED DEFAULT NULL,
  `employee_id` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `phone` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` enum('MALE','FEMALE') COLLATE utf8mb4_unicode_ci NOT NULL,
  `avatar` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  UNIQUE KEY `users_phone_unique` (`phone`),
  KEY `users_institute_id_foreign` (`institute_id`),
  KEY `users_branch_id_foreign` (`branch_id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `institute_id`, `branch_id`, `employee_id`, `name`, `email`, `email_verified_at`, `phone`, `gender`, `avatar`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, NULL, NULL, NULL, 'Super Admin', 'sa@gmail.com', '2022-10-17 18:08:01', NULL, 'MALE', NULL, '$2y$10$4l/FBZVgGKmg/nW/ep4Pvu/LGfxnYPXfrGKpQr8x5EuMyzj1LYxPm', NULL, '2022-10-17 18:08:01', '2022-10-17 18:08:01'),
(2, 1, NULL, 'EMP-0101', 'Institute Admin 1', 'ia1@gmail.com', '2022-10-17 18:08:01', NULL, 'MALE', NULL, '$2y$10$opKqtdDAh/gwyoAtbNziNeJW0deeCWqUVpiE/eny/UZVDguUgPveW', NULL, '2022-10-17 18:08:01', '2022-10-17 18:08:01'),
(3, 2, NULL, 'EMP-0101', 'Institute Admin 2', 'ia2@gmail.com', '2022-10-17 18:08:01', NULL, 'MALE', NULL, '$2y$10$AwDHKCI.6j2LlyDpHyjEgORoH247zWe1tZvrjeWc8Yejx/MgGazhC', NULL, '2022-10-17 18:08:01', '2022-10-17 18:08:01'),
(4, 1, NULL, 'EMP-0201', 'Staff 1', 'stf1@gmail.com', '2022-10-17 18:08:01', NULL, 'MALE', NULL, '$2y$10$Yyt/2M6nlQ.fKKAoMcdqn.5kENr3I8Q8P2f6FVDVE/dEK46zTjmM6', NULL, '2022-10-17 18:08:01', '2022-10-17 18:08:01'),
(5, 1, 1, 'EMP-0202', 'Staff 2', 'stf2@gmail.com', '2022-10-17 18:08:01', NULL, 'MALE', NULL, '$2y$10$/a8Eu5FCxSA9cqPgaozpmugc2W/viGGbiHcftBsPkGtEh1u3Fxoy2', NULL, '2022-10-17 18:08:01', '2022-10-17 18:08:01'),
(6, NULL, NULL, NULL, 'Operator Team', 'ot@gmail.com', '2022-10-17 18:08:01', NULL, 'MALE', NULL, '$2y$10$kREbl7j4JB0E6j2O0Epgr.nNb02m6v9prEKqBdnONau58zquX21W.', NULL, '2022-10-17 18:08:01', '2022-10-17 18:08:01'),
(7, NULL, NULL, NULL, 'Student 1', 'st1@gmail.com', '2022-10-17 18:08:01', '082234897777', 'MALE', NULL, '$2y$10$Lllu6nXJyrS5.sBg9vmk9uTSimO9vrmvYfURZhdhPsp82SazxT8SK', NULL, '2022-10-17 18:08:01', '2022-10-17 18:08:01'),
(8, NULL, NULL, NULL, 'Student 2', 'st2@gmail.com', '2022-10-17 18:08:01', '082234897778', 'MALE', NULL, '$2y$10$/SFJrrADSV0pigUb1PTRE.ADyNw/xinKDp.3WkMsfJngQGET4WwNu', NULL, '2022-10-17 18:08:01', '2022-10-17 18:08:01');

-- --------------------------------------------------------

--
-- Table structure for table `user_preferred`
--

DROP TABLE IF EXISTS `user_preferred`;
CREATE TABLE IF NOT EXISTS `user_preferred` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `exam_category_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_preferred_user_id_foreign` (`user_id`),
  KEY `user_preferred_exam_category_id_foreign` (`exam_category_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
