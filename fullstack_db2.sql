-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 30, 2026 at 04:59 PM
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
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(20) DEFAULT 'User',
  `status` varchar(20) DEFAULT 'active',
  `is_deleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `username`, `password`, `role`, `status`, `is_deleted`) VALUES
(18, 'SASA', '', '$2b$10$5KPFgwO0hGTM0keHaZQJGu5arAfTc67/dfBYsiQAIELwtkp33EAbi', NULL, 'deleted', 1),
(19, 'Jp', 'Hatdog', '$2b$10$RrMd0Fce8UZ3thaew0mk8OaAXSa1Ybdf8FjX5LTlV3tWlUM14.Ueu', 'Admin', 'active', 0),
(20, 'User', 'Test', '$2b$10$Sy.gZRGupUdY4PnTTjzvheQtmR.GQFq7a3pVF.0Rfx8F4oS3FQHpu', 'User', 'active', 0),
(21, 'User2', 'User2', '$2b$10$IVY5b2OSQUbcQf7p4Pey1OBquaR1KUg.o4FbnNeoTiE.QsRtE92A6', 'User', 'active', 0),
(22, 'UsertoAdmin', 'User3', '$2b$10$vhTZULY5.T8uluG81jBpzuz3ndjhd8DquGv4z20qQ8IW3h0CAe.22', 'Admin', 'active', 0),
(23, 'Hello', 'Sasa', '$2b$10$9y41eMT973sN97G76E6mue3aAnVhF5iOY1NasRpeocGJGM9PrgkPu', 'User', 'active', 0),
(24, 'Testing 2', 'Man', '$2b$10$T7Bu5z95uH2LI320NaIB7uXfdtdobtTXpC6E8DoVk2pBLSDDqNshi', 'User', 'active', 0);

--
-- Indexes for dumped tables
--

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
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
