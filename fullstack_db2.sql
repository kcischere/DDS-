-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 31, 2026 at 03:22 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `fullstack_db2`
--

-- --------------------------------------------------------

--
-- Table structure for table `documents`
--

CREATE TABLE `documents` (
  `id` int(11) NOT NULL,
  `original_name` varchar(255) NOT NULL,
  `stored_name` varchar(255) NOT NULL,
  `mime_type` varchar(100) NOT NULL,
  `size` int(11) NOT NULL,
  `folder_id` int(11) DEFAULT NULL,
  `uploaded_by` int(11) NOT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `label` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `documents`
--

INSERT INTO `documents` (`id`, `original_name`, `stored_name`, `mime_type`, `size`, `folder_id`, `uploaded_by`, `uploaded_at`, `label`) VALUES
(2, 'Pacia_Krysean_Kal-El_ContemporaryWorld.pdf', '1780158261290-486255815.pdf', 'application/pdf', 388697, 2, 22, '2026-05-30 16:24:21', 'Academics'),
(3, 'Full-Stack-Implementation-Phase.pdf', '1780160448331-124068134.pdf', 'application/pdf', 376243, 2, 22, '2026-05-30 17:00:48', 'Miscellaneous'),
(4, 'Activity 5.pdf', '1780232575945-998632851.pdf', 'application/pdf', 203425, 2, 22, '2026-05-31 13:02:55', 'Academics');

-- --------------------------------------------------------

--
-- Table structure for table `folders`
--

CREATE TABLE `folders` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `folders`
--

INSERT INTO `folders` (`id`, `name`, `parent_id`, `created_by`, `created_at`) VALUES
(1, 'Test', NULL, 22, '2026-05-30 16:17:51'),
(2, 'Projects', NULL, 22, '2026-05-30 16:24:12');

-- --------------------------------------------------------

--
-- Table structure for table `labels`
--

CREATE TABLE `labels` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `is_default` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `labels`
--

INSERT INTO `labels` (`id`, `name`, `is_default`) VALUES
(1, 'Report', 1),
(2, 'Salary Report', 1),
(3, 'Admin Only', 1),
(4, 'Miscellaneous', 1),
(5, 'Updates', 1),
(6, 'Academics', 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(20) DEFAULT 'User',
  `status` varchar(20) DEFAULT 'active',
  `email` varchar(150) DEFAULT NULL,
  `contact_number` varchar(20) DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `username`, `password`, `role`, `status`, `email`, `contact_number`, `is_deleted`) VALUES
(18, 'SASA', '', '$2b$10$5KPFgwO0hGTM0keHaZQJGu5arAfTc67/dfBYsiQAIELwtkp33EAbi', NULL, 'deleted', NULL, NULL, 1),
(19, 'Jp', 'Hatdog', '$2b$10$RrMd0Fce8UZ3thaew0mk8OaAXSa1Ybdf8FjX5LTlV3tWlUM14.Ueu', 'Admin', 'active', NULL, NULL, 0),
(20, 'User', 'Test', '$2b$10$Sy.gZRGupUdY4PnTTjzvheQtmR.GQFq7a3pVF.0Rfx8F4oS3FQHpu', 'User', 'active', 'test@gmail.com', '11111111112', 0),
(21, 'User2', 'User2', '$2b$10$IVY5b2OSQUbcQf7p4Pey1OBquaR1KUg.o4FbnNeoTiE.QsRtE92A6', 'User', 'active', 'user2@email.address.com', '2222222221', 0),
(22, 'UsertoAdmin', 'User3', '$2b$10$Nn3Q.zG7ZxmbfRwzZSw4luszDZX9H9L4i7M5OInKJ0IqmZdiUrwx6', 'Admin', 'active', NULL, NULL, 0),
(23, 'Hello', 'Sasa', '$2b$10$9y41eMT973sN97G76E6mue3aAnVhF5iOY1NasRpeocGJGM9PrgkPu', 'User', 'active', 'test@gmail.com', '11111111111', 0),
(24, 'Testing 2', 'Man', '$2b$10$T7Bu5z95uH2LI320NaIB7uXfdtdobtTXpC6E8DoVk2pBLSDDqNshi', 'User', 'active', NULL, NULL, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `folder_id` (`folder_id`),
  ADD KEY `uploaded_by` (`uploaded_by`);

--
-- Indexes for table `folders`
--
ALTER TABLE `folders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `labels`
--
ALTER TABLE `labels`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `documents`
--
ALTER TABLE `documents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `folders`
--
ALTER TABLE `folders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `labels`
--
ALTER TABLE `labels`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `documents`
--
ALTER TABLE `documents`
  ADD CONSTRAINT `documents_ibfk_1` FOREIGN KEY (`folder_id`) REFERENCES `folders` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `documents_ibfk_2` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `folders`
--
ALTER TABLE `folders`
  ADD CONSTRAINT `folders_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
