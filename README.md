# le jeux des trois couleurs, resolution et jeu interactif

Sur un tableau carré, les joueurs jouent tour à tour en coloriant une case libre en choisissant une parmi 3 couleurs.
2 cases voisines selon le 4-voisinage ne peuvent être de la même couleur.
celui qui ne peut jouer à perdu.



| côté     |   1er    | 2ieme   |
| -----    | -------- | ------- |
| 1x1      | gagne    |         |
| 2x2      |          | gagne   |
| 3x3      | gagne    |         |
| 4x4      | gagne    |         |
| 5x5      ||

: Qui a la stratégie gagnante


# bench

## tour
trois_couleurs.py:141: [0051ms] taille_plateau=(4, 4).
trois_couleurs.py:427: [0042ms] =building recursif....
trois_couleurs.py:379: [0080ms] node_number=2.
trois_couleurs.py:379: [0043ms] node_number=4.
trois_couleurs.py:379: [0045ms] node_number=8.
trois_couleurs.py:379: [0046ms] node_number=16.
trois_couleurs.py:379: [0052/0052ms] node_number=32.
trois_couleurs.py:379: [0055ms] node_number=64.
trois_couleurs.py:379: [0072/0128ms] node_number=128.
trois_couleurs.py:379: [0103/0103ms] node_number=256.
trois_couleurs.py:379: [0161/0336ms] node_number=512.
trois_couleurs.py:379: [0284/0284ms] node_number=1024.
trois_couleurs.py:379: [0529/0529ms] node_number=2048.
trois_couleurs.py:379: [1013/1013ms] node_number=4096.
trois_couleurs.py:379: [2015/2015ms] node_number=8192.
trois_couleurs.py:379: [3927/3927ms] node_number=16384.
trois_couleurs.py:379: [7980/15911ms] node_number=32768.
trois_couleurs.py:379: [15755ms] node_number=65536.
trois_couleurs.py:379: [31886/55622ms] node_number=131072.
trois_couleurs.py:379: [64689/64689ms] node_number=262144.
trois_couleurs.py:379: [126117ms] node_number=524288.
trois_couleurs.py:379: [257842/512533ms] =1048576.
trois_couleurs.py:429: [120751ms] "building recursif..."=671625.
trois_couleurs.py:430: [0039ms] root=1292788.
trois_couleurs.py:431: [0040ms] len(seen)=1292787.
trois_couleurs.py:433: [10890ms] node_number=False.
