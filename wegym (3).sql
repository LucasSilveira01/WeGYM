-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 26-Out-2023 às 03:58
-- Versão do servidor: 8.0.31
-- versão do PHP: 8.1.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `wegym`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `datas`
--

CREATE TABLE `datas` (
  `data` date NOT NULL,
  `user` int NOT NULL,
  `duration` float NOT NULL,
  `calories` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `datas`
--

INSERT INTO `datas` (`data`, `user`, `duration`, `calories`) VALUES
('2023-09-02', 1, 0, 0),
('2023-10-24', 1, 60, 120),
('2023-10-25', 2, 60, 120);

-- --------------------------------------------------------

--
-- Estrutura da tabela `goals`
--

CREATE TABLE `goals` (
  `ID` int NOT NULL,
  `person` int DEFAULT NULL,
  `goalDate` date DEFAULT NULL,
  `weightGoal` decimal(5,2) DEFAULT NULL,
  `fatPercentageGoal` decimal(5,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `goals`
--

INSERT INTO `goals` (`ID`, `person`, `goalDate`, `weightGoal`, `fatPercentageGoal`) VALUES
(1, 1, '2024-09-10', '75.50', '13.00');

-- --------------------------------------------------------

--
-- Estrutura da tabela `measure`
--

CREATE TABLE `measure` (
  `ID` int NOT NULL,
  `person` int DEFAULT NULL,
  `measureDate` date DEFAULT NULL,
  `weight` decimal(5,2) DEFAULT NULL,
  `neck` decimal(5,2) DEFAULT NULL,
  `abdomen` decimal(5,2) DEFAULT NULL,
  `hips` decimal(5,2) DEFAULT NULL,
  `leftArm` decimal(5,2) DEFAULT NULL,
  `rightArm` decimal(5,2) DEFAULT NULL,
  `leftForearm` decimal(5,2) DEFAULT NULL,
  `rightForearm` decimal(5,2) DEFAULT NULL,
  `leftThigh` decimal(5,2) DEFAULT NULL,
  `rightThigh` decimal(5,2) DEFAULT NULL,
  `IMC` decimal(5,2) DEFAULT NULL,
  `percentage` decimal(5,2) DEFAULT NULL,
  `leftCalf` decimal(5,2) DEFAULT NULL,
  `rightCalf` decimal(5,2) DEFAULT NULL,
  `chest` decimal(5,2) DEFAULT NULL,
  `file` text COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `measure`
--

INSERT INTO `measure` (`ID`, `person`, `measureDate`, `weight`, `neck`, `abdomen`, `hips`, `leftArm`, `rightArm`, `leftForearm`, `rightForearm`, `leftThigh`, `rightThigh`, `IMC`, `percentage`, `leftCalf`, `rightCalf`, `chest`, `file`) VALUES
(1, 1, '2023-09-09', '92.00', '38.00', '88.50', '0.00', '34.00', '34.50', '0.00', '0.00', '0.00', '0.00', '28.74', '18.90', '0.00', '0.00', '0.00', ''),
(2, 2, '2023-10-21', '110.00', '20.00', '80.00', '10.00', '10.00', '10.00', '10.00', '10.00', '10.00', '10.00', '35.90', '26.02', '10.00', '10.00', '0.00', 'uploads\\Lucas Silveira\\2023-10-21-Lucas Silveira.jpg'),
(3, 2, '2023-10-22', '100.00', '10.00', '10.00', '10.00', '10.00', '10.00', '10.00', '10.00', '10.00', '10.00', '32.70', '-450.00', '10.00', '10.00', '0.00', 'uploads\\Lucas Silveira\\2023-10-21-Lucas Silveira.jpg');

-- --------------------------------------------------------

--
-- Estrutura da tabela `metrics`
--

CREATE TABLE `metrics` (
  `id` int NOT NULL,
  `imc` float NOT NULL,
  `igc` float NOT NULL,
  `user` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `person`
--

CREATE TABLE `person` (
  `id` int NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `pass` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `sex` char(1) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `birthDate` date DEFAULT NULL,
  `height` decimal(5,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `person`
--

INSERT INTO `person` (`id`, `username`, `pass`, `name`, `sex`, `birthDate`, `height`) VALUES
(1, 'lfsayrn', 'Luan123', 'Luan Felipe', 'M', '2001-07-31', '179.00'),
(2, 'Silveira', 'Sil123', 'Lucas Silveira', 'M', '2001-01-13', '177.00'),
(3, 'dev', '123', 'Women', 'F', '1996-09-09', '161.00');

-- --------------------------------------------------------

--
-- Estrutura da tabela `treinos`
--

CREATE TABLE `treinos` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `backgroundImage` varchar(255) NOT NULL,
  `video` text NOT NULL,
  `user` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Extraindo dados da tabela `treinos`
--

INSERT INTO `treinos` (`id`, `title`, `content`, `category`, `backgroundImage`, `video`, `user`) VALUES
(1, 'Supino Inclinado', '5 x 10', 'Peito', '../src/images/Supino_inclinado.png', '../src/assets/videos/supino_inclinado.mp4', 2),
(2, 'Supino Reto', '5 x 10', 'Peito', '../src/images/Supino_Reto.png', 'this.file', 2),
(3, 'Voador', '5 x 10', 'Peito', '../src/images/Voador.png', 'this.file', 2),
(4, 'Flexão', '5 x 10', 'Perna', '../src/images/Flexao.png', 'this.file', 2),
(5, 'PullOver', '5 x 10', 'Costas', '../src/images/Pullover.jpeg', 'this.file', 2);

-- --------------------------------------------------------

--
-- Estrutura da tabela `user`
--

CREATE TABLE `user` (
  `id` int NOT NULL,
  `user` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `pass` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `role` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `nome` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `sobrenome` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `sexo` char(1) COLLATE utf8mb4_general_ci NOT NULL,
  `idade` int NOT NULL,
  `altura` text COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `user`
--

INSERT INTO `user` (`id`, `user`, `pass`, `role`, `nome`, `sobrenome`, `sexo`, `idade`, `altura`) VALUES
(1, 'silveira0182@gmail.com', '$2b$10$iLazppiRRzVgvD535KCtNOvVIwc98BqQy4M5BPz4dT3u80LqvHDze', 'user', 'Lucas', 'Silveira', 'M', 22, ''),
(2, 'silveira0183@gmail.com', '$2b$10$uAYFu08NXLSxueKucUXenecGxFU9GISYxQMzcXuS80R1l77/3ckCW', 'user', 'Lucas', 'Silveira', 'M', 22, '175');

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `datas`
--
ALTER TABLE `datas`
  ADD PRIMARY KEY (`data`,`user`);

--
-- Índices para tabela `goals`
--
ALTER TABLE `goals`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `person` (`person`);

--
-- Índices para tabela `measure`
--
ALTER TABLE `measure`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `fk_measure` (`person`);

--
-- Índices para tabela `metrics`
--
ALTER TABLE `metrics`
  ADD PRIMARY KEY (`id`);

--
-- Índices para tabela `person`
--
ALTER TABLE `person`
  ADD PRIMARY KEY (`id`);

--
-- Índices para tabela `treinos`
--
ALTER TABLE `treinos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_treinos` (`title`,`content`,`category`,`user`);

--
-- Índices para tabela `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user` (`user`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `measure`
--
ALTER TABLE `measure`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `metrics`
--
ALTER TABLE `metrics`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `treinos`
--
ALTER TABLE `treinos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de tabela `user`
--
ALTER TABLE `user`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `goals`
--
ALTER TABLE `goals`
  ADD CONSTRAINT `goals_ibfk_1` FOREIGN KEY (`person`) REFERENCES `person` (`id`);

--
-- Limitadores para a tabela `measure`
--
ALTER TABLE `measure`
  ADD CONSTRAINT `fk_measure` FOREIGN KEY (`person`) REFERENCES `person` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
