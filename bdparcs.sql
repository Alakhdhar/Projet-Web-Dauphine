-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mer. 02 juin 2021 à 16:37
-- Version du serveur :  10.4.17-MariaDB
-- Version de PHP : 8.0.2

--
-- Base de données : `bdparcs`
--

-- --------------------------------------------------------

--
-- Structure de la table `parc`
--

CREATE TABLE `parc` (
  `idparc` int(200) NOT NULL,
  `nom` varchar(30) DEFAULT NULL,
  `type` char(50) DEFAULT NULL,
  `libelle` varchar(50) DEFAULT NULL,
  `image` varchar(100) DEFAULT NULL,
  `pays` varchar(30) DEFAULT NULL,
  `description` varchar(400) DEFAULT NULL,
  `note` float NOT NULL,
  `site` varchar(400) DEFAULT NULL,
  `publie` int(1) NOT NULL,
  `idpublisher` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `parc`
--
# FOR TESTS
INSERT INTO `parc` (`idparc`, `nom`, `type`, `libelle`, `image`, `pays`, `description`, `note`, `site`, `publie`, `idpublisher`) VALUES
(2, 'FUTUROSCOPE', 'Sensations fortes', 'Parc d\'attraction et de spectacle à Poitiers', 'futuroscope.jpg', 'France', 'Vous souhaitez passer un weekend magique, imaginaire et fantastique… ? Le Futuroscope devrait être alors votre prochaine destination car il s’agit d’un parc d’attraction de renom mondial ayant reçu le lauréat 2015 Trip Advisor Travel’s choice.', 2, 'https://www.futuroscope.com/fr/', 1, 3),
(3, 'Asterix', 'Aquatique', 'Parc de loisirs à Paris', 'attraction-parc-asterix-paris.jpg', 'France', 'Avec ses 42 attractions, le Parc Astérix est le 2ème parc d\'attractions implanté en France, situé à 35Kms au nord de Paris. Inspiré de la célèbre bande-dessinée d\'Uderzo et Goscinny, ce parc dédié aux familles attire depuis plus de 30 ans des visiteurs conquis par les différents mondes à découvrir : de la Gaule à l\'Empire Romain, en passant par la Grèce ou chez les Vikings, on voyage à travers le ', 1, 'https://www.parcasterix.fr/', 1, 4);

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

--
-- Déchargement des données de la table `utilisateur`
--
# FOR TESTS
INSERT INTO `utilisateur` (`idutil`, `nom`, `prenom`, `mdp`, `mail`, `statut`) VALUES
(1, 'lak', 'amira', '1574', 'amira@yahoo.fr', 0),
(3, 'El Beze', 'Mikhael', 'popo', 'popo@popo.fr', 1),
(4, 'Pons', 'Delphine', 'asterix', 'dpons@asterix.fr', 1);

-- --------------------------------------------------------

--
-- Structure de la table `vote`
--

CREATE TABLE `vote` (
  `idvote` int(255) NOT NULL,
  `idparc` int(11) NOT NULL,
  `idutil` int(11) NOT NULL,
  `note` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `vote`
--
# FOR TESTS
INSERT INTO `vote` (`idvote`, `idparc`, `idutil`, `note`) VALUES
(30, 2, 1, 2);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `parc`
--
ALTER TABLE `parc`
  ADD PRIMARY KEY (`idparc`);

--
-- Index pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  ADD PRIMARY KEY (`idutil`),
  ADD UNIQUE KEY `mail` (`mail`) USING HASH;

--
-- Index pour la table `vote`
--
ALTER TABLE `vote`
  ADD PRIMARY KEY (`idvote`),
  ADD KEY `idparc` (`idparc`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `parc`
--
ALTER TABLE `parc`
  MODIFY `idparc` int(200) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  MODIFY `idutil` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `vote`
--
ALTER TABLE `vote`
  MODIFY `idvote` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `vote`
--
ALTER TABLE `vote`
  ADD CONSTRAINT `vote_ibfk_1` FOREIGN KEY (`idparc`) REFERENCES `parc` (`idparc`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;
