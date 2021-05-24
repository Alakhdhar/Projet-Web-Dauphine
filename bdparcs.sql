-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le :  mer. 22 jan. 2020 à 15:32
-- Version du serveur :  10.3.16-MariaDB
-- Version de PHP :  7.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

 Create database bdparcs;
 use bdparcs;
--
-- Base de données :  `bdparcs`
--

-- --------------------------------------------------------

--
-- Structure de la table `admin`
--

CREATE TABLE `admin` (
  `idadmin` varchar(20) NOT NULL,
  `nom` text DEFAULT NULL,
  `prenom` text DEFAULT NULL,
  `mdp` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `admin`
--

INSERT INTO `admin` (`idadmin`, `nom`, `prenom`, `mdp`) VALUES
('mikhael4', 'ELBEZE', 'MIKHAEL', 'mikhaland4'),
('amira1', 'LAKHDHAR', 'AMIRA', 'amira123');

-- --------------------------------------------------------

--
-- Structure de la table `parc`
--

CREATE TABLE `parc` (
  `idparc` int(200) NOT NULL,
  `nom` varchar(30) DEFAULT NULL,
  `type` char(1) DEFAULT NULL,
  `libelle` varchar(50) DEFAULT NULL,
  `image` varchar(30) DEFAULT NULL,
  `pays` varchar(30) DEFAULT NULL,
  `description` varchar(400) DEFAULT NULL,
  `note` float NOT NULL,
  `site` varchar(400) DEFAULT NULL,
  `publie` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `parc`
--

INSERT INTO `parc` (`idparc`, `nom`, `type`, `libelle`, `image`, `pays`, `description`, `note`) VALUES
(1, 'WAVE ISLAND', 'A', 'Parc d\'attraction 100% glisse en Provence', 'images/waveisland.jpg', 'France', 'Le grand saut ludique existe désormais, avec Wave Island Provence, ex : Splashworld, pour tous ceux qui veulent se mouiller ou profiter des plaisirs de l’eau en famille et en plein air. Un parc aquatique éco-responsable existe à côté d’Avignon, à Monteux.', 0),
(2, 'FUTUROSCOPE', 'S', 'Parc d\'attraction et de spectacle à Poitiers', 'images/futuroscope.jpg', 'France', 'Vous souhaitez passer un weekend magique, imaginaire et fantastique… ? Le Futuroscope devrait être alors votre prochaine destination car il s’agit d’un parc d’attraction de renom mondial ayant reçu le lauréat 2015 Trip Advisor Travel’s choice.', 0),
(3, 'WALIBI SUD OUEST', 'S', 'Attractions et spectacles près d\'Agen', 'images/walibi-so.jpg', 'France', 'Les parcs Walibi sont bien connus de tous les amateurs de bons moments. Le premier parc Walibi est né en Belgique.', 0),
(4, 'PORT AVENTURA', 'A', 'Six mondes fascinants', 'images/portAventura.jpg', 'Espage', 'Port Aventura, grâce à sa superficie de 119 hectares, est le plus grand parc d’attractions d’Espagne. Ce complexe de loisirs qui a ouvert en 1995 est situé à moins d’une heure de Barcelone, et si vous habitez le sud de la France vous pourrez tout à fait y passer la journée et rentrer chez vous le soir.', 0),
(5, 'FUTUROSCOPE', NULL, 'Parc d\'attractions et de spectacles à Poitiers', 'images/futuroscope.jpg', 'France', 'Vous souhaitez passer un weekend magique, imaginaire et fantastique… ? Le Futuroscope devrait être alors votre prochaine destination car il s’agit d’un parc d’attraction de renom mondial ayant reçu le lauréat 2015 Trip Advisor Travel’s choice.', 0),
(6, 'EUROPAPARK', 'S', 'Parc de loisirs en Allemagne', 'images/europapark.jpg', 'Allemagne', 'Europa-Park est l’un des plus grands parcs au monde. Il est constitué de diverses attractions qui ont attirées près de 5,7 millions de visiteurs en 2018. Son extension s’accroît d’autant plus avec la conception de nouveaux projets inédits chaque année.', 0);

-- --------------------------------------------------------

--
-- Structure de la table `utilisateur`
--

CREATE TABLE `utilisateur` (
  `idutil` int(255) NOT NULL,
  `nom` text DEFAULT NULL,
  `prenom` text DEFAULT NULL,
  `mdp` varchar(50) DEFAULT NULL,
  `mail` text DEFAULT NULL,
  `statut` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `vote`
--

CREATE TABLE `vote` (
  `idvote` int(255) NOT NULL,
  `idparc` int(11) NOT NULL,
  `idutil` int(11) NOT NULL,
  `note` int(5) NOT NULL,
  `commentaire` varchar(400) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`idadmin`);

--
-- Index pour la table `parc`
--
ALTER TABLE `parc`
  ADD PRIMARY KEY (`idparc`);

--
-- Index pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  ADD PRIMARY KEY (`idutil`);

--
-- Index pour la table `vote`
--
ALTER TABLE `vote`
  ADD PRIMARY KEY (`idvote`),
  ADD KEY `idparc` (`idparc`),
  ADD KEY `idutil` (`idutil`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `parc`
--
ALTER TABLE `parc`
  MODIFY `idparc` int(200) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `vote`
--
ALTER TABLE `vote`
  ADD CONSTRAINT `vote_ibfk_1` FOREIGN KEY (`idparc`) REFERENCES `parc` (`idparc`),
  ADD CONSTRAINT `vote_ibfk_2` FOREIGN KEY (`idutil`) REFERENCES `utilisateur` (`idutil`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
