---
title : "Muchas Glacias - Testeur de site web écologique et accessible"
---

## Bêta 3 - B3TA

Ce testeur de site, Muchas Glacias, est dans une première version qualifiée généreusement de  Bêta.
Les formules et les modes de calcul évolueront en fonction de notre veille et de nos propres développements.
Le but est de vous rendre compte en un clic et gratuitement de l'état global de votre site selon les critères détaillés plus bas.

## Eco Index 

EcoIndex est un outil communautaire, gratuit et transparent qui permet d’évaluer sa performance environnementale absolue à l’aide d’un score sur 100

Plus la note est élevée et meilleure est la performance environnementale.

*Plus de détails ici :* <a href="http://www.ecoindex.fr/quest-ce-que-ecoindex/" target="_blank" title="Explication d'EcoIndex" rel="external nofollow noreferrer">http://www.ecoindex.fr/quest-ce-que-ecoindex/</a>

## Performance 

Le score de Performance est un score pondéré, pouvant aller jusque 100, des différents indicateurs de performance mesurés par Google.
Plus la note est élevée et meilleure est l'expérience utilisateur du site testé
.
Nous utilisons la version Mobile qui est plus exigeante en terme de notation.

Attention, cette note peut fluctuer en fonction des éléments suivants :
-   A/B test ou présence de publicité 
-   Etat de votre connexion internet
-   Tester sur des devices différents comme un ordinateur fixe ultra-puissant puis un ordinateur portable moins performant
-   Sites qui injectent directement du javascript dans le navigateur
-   Présence d'un antivirus

*Détails sur la pondération :* <a href="https://googlechrome.github.io/lighthouse/scorecalc/" target="_blank" title="Explication de la pondération du score de performance" rel="external nofollow noreferrer">https://googlechrome.github.io/lighthouse/scorecalc/</a>

*Détails de l'audit Performance :* <a href="https://web.dev/lighthouse-performance/" target="_blank" rel="external nofollow noreferrer" title="Audit de performance">https://web.dev/lighthouse-performance/</a>

## Accessibilité

Le score d'accessibilité est une note comprise entre 0 et 100 qui vérifie si tous les utilisateurs peuvent accéder à vos contenus et naviguer correctement sur votre site.

La note est la somme pondérée de 41 tests automatisés identifiés dans le Web Content Accessibility Guidelines 2.0 et calculés par Google.

Cette note n'est pas exhaustive mais donne une première évaluation de l'accessibilité d'un site.

*Détails de l'audit d'Accessibilité :* <a href="https://web.dev/lighthouse-accessibility/" target="_blank" rel="external nofollow noreferrer" title="Audit d'accessibilité">https://web.dev/lighthouse-accessibility/</a>

## Best Practices

Le score de best practices est une évaluation entre 0 et 100 de la santé de vos pages Web selon Google.
Ca donne un indicateur sur la qualité du code du site donc de la façon dont il a été programmé.

Sont évalués les critères suivants :
 - Bonnes  Pratiques en général
 - Bonnes  Pratiques pour rendre la page rapide
 - Bonnes  Pratiques pour rendre la page sécure
 - Bonnes  Pratiques pour créer une bonne expérience utilisateur
 - Eviter les technologies dépréciées

*Détails de l'audit de Best Practices :* <a href="https://web.dev/lighthouse-best-practices/" target="_blank" rel="external nofollow noreferrer" title="Audit de best practices">https://web.dev/lighthouse-best-practices/</a>

## SEO - Référencement

Le score SEO, compris entre 0 et 100,  indique à quel point votre site Web est optimisé pour le moteur de recherche Google , et à quel point vos pages sont faciles à référencer.

Votre site Web est-il responsive et donc "mobile friendly"? La taille de la police est-elle normale ? Une distinction est-elle faite entre H1 et H2 ?

*Détails de l'audit de SEO :* <a href="https://web.dev/lighthouse-seo/" target="_blank" rel="external nofollow noreferrer" title="Audit du SEO">https://web.dev/lighthouse-seo/</a>

## Pepper Index

Notre indicateur de travail qui vient pondérer les autres indicateurs et noter votre site comme un réfrigérateur de A à E.

Nous avons repris le principe de notation de l'ecoscore qui informe sur l’impact environnemental des produits alimentaires.

Pepper Index a pour but d'informer sur la performance et l'impact environnemental des sites internet.

![](img/pepperindex.webp)

## La formule actuelle est : 
```
(40*(Score Ecoindex) + 
20*(Score Performance Mobile Lighthouse) + 
20*(Score Accessibilité Lighthouse) + 
10*(Score Best Practices Lighthouse) + 
10*(Score SEO Lighthouse)) / 100
```

**Chaque score définit un grade :**
 - **A** : 100 à 85
 - **B** : 85 à 70
 - **C** : 70 à 50
 - **D** : 50 à 30
 - **E** : 30 à 0

## Carbon Index
Internet consomme beaucoup d'électricité. 416,2 TWh par an pour être précis.
Pour vous donner une idée, c'est plus que l'ensemble du Royaume-Uni.

Des centres de données aux réseaux de transmission en passant par les appareils que nous tenons entre nos mains, tout cela consomme de l'électricité et produit à son tour des émissions de carbone.

*Plus de détails ici :* <a href="https://www.websitecarbon.com/" target="_blank" title="Lien de websitecarbon" rel="external nofollow noreferrer">https://www.websitecarbon.com/</a>

|||||
## Pourquoi tester ?

Quelque soit le domaine, tester permet de valider la qualité d'un produit. Dans le cadre d'un développement informatique, il est considéré comme acquis depuis longtemps que les tests unitaires et les tests d'intégrations permettent de :
- s'assurer de l'adéquation du livrable avec le besoin
- gagner du temps en détectant très tôt une éventuelle régression.

Les tests ne sont donc plus réalisés uniquement à la fin du développement, juste avant la livraison du produit, mais tout au long du cycle de vie de l'application :
- Des tests unitaires pendant les développements et à chaque commit
- Des tests d'intégrations (automatisés ou non) à chaque livraison
- Des tests manuels à chaque livraison
- Lorsque c'est possible des déploiements en AB testing ou au moins en blue/green

Chez labanqui.se nous considérons la limitation de l'emprunte écologique et la bonne accessibilité comme des fonctionnalités principales de nos développements. Il est donc logique que nous souhaitions les tester à chaque étape du développement, exactement comme les tests d'intégration.

En plus de tests fonctionnels et de tests de non régression, nous testons donc systématiquement :
- Les performances écologiques du développement
- L'accessibilité
- La performance globale (la performance écologique étant très fortement liée aux performances classiques)
- Les "bonnes pratiques"