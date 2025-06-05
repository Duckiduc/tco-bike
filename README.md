# 🏍️ Calculateur TCO Moto France

Une application web moderne pour calculer le **Coût Total de Possession (TCO)** d'une moto en France. Ce projet open source compile des données de sources publiques pour estimer les coûts réels de possession d'une moto.

## ✨ Fonctionnalités

### 🧮 Calculateur TCO Personnalisé
- **Calcul détaillé** : Dépréciation, assurance, entretien, carburant, pneus, contrôle technique, stationnement
- **Option dépréciation** : Inclure ou exclure la dépréciation selon vos besoins
- **Catégories adaptées** : Petite (≤125cc), moyenne (126-599cc), grosse cylindrée (≥600cc)
- **Paramètres personnalisables** : Prix d'achat, kilométrage, coûts spécifiques

### 📊 Visualisations Interactives
- **Graphiques en secteurs** : Répartition visuelle des coûts
- **Comparaison avec moyennes** : Positionnement par rapport aux données nationales
- **Graphiques adaptatifs** : Mise à jour automatique selon les paramètres

### 📈 Données du Marché
- **Top 20 motos populaires** en France (2024)
- **Coûts par marque** : TCO moyen, fiabilité, disponibilité des pièces
- **Méthodologie détaillée** : Explication transparente des calculs
- **60+ sources référencées** : Liens vers toutes les sources utilisées

### 🎨 Interface Moderne
- **Design Ant Design** : Interface professionnelle et responsive
- **Thème personnalisé** : Couleurs cohérentes et modernes
- **Mobile-friendly** : Optimisé pour tous les écrans

## 🚀 Technologies

## 🚀 Technologies

- **React 18** avec TypeScript pour la robustesse
- **Vite** pour un développement rapide
- **Ant Design** pour les composants UI
- **Recharts** pour les visualisations de données
- **ESLint + TypeScript** pour la qualité du code

## 🛠️ Installation et Développement

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Installation
```bash
# Cloner le repository
git clone [URL_DU_REPO]
cd tco-bike

# Installer les dépendances
npm install

# Lancer en développement
npm run dev
```

### Scripts disponibles
```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run preview      # Prévisualiser le build
npm run lint         # Vérifier le code
```

## 📊 Sources des Données

Ce projet compile des données provenant de **60+ sources publiques** :

- **Données officielles** : CSIAM, Ministère de la Transition Écologique
- **Assurances** : Comparateurs français (LeLynx, Assurance Prévention)
- **Marché moto** : Moto-Net, A2Riders, Caradisiac
- **Entretien** : Enquêtes concessionnaires et garages agréés
- **Dépréciation** : Études Eurotax et Argus Moto

Voir l'onglet "Sources & Références" dans l'application pour la liste complète.

## ⚖️ Méthodologie TCO

### Composants du calcul :
1. **Dépréciation** : 15% par an (optionnel)
2. **Assurance** : Au tiers (455€), intermédiaire (648€), tous risques (907€)
3. **Entretien** : 225€ (petite), 375€ (moyenne), 575€ (grosse cylindrée)
4. **Carburant** : Prix SP95 moyen France (1,65€/L en 2024)
5. **Pneus** : Coût proratisé selon durée de vie et kilométrage
6. **Contrôle technique** : 35€ tous les 2 ans (17,50€/an)
7. **Stationnement** : Variable selon zone géographique

## 🎯 Utilisation

1. **Sélectionnez** votre catégorie de moto
2. **Personnalisez** les paramètres selon votre situation
3. **Choisissez** d'inclure ou non la dépréciation
4. **Calculez** votre TCO annuel
5. **Comparez** avec les moyennes nationales
6. **Explorez** les données du marché français

## ⚠️ Disclaimer

**Données approximatives** : Les informations proviennent de sources publiques variées compilées bénévolement. Les prix et coûts peuvent varier selon les régions, époques et conditions spécifiques. Ce projet vise à donner une estimation générale et ne remplace pas une analyse professionnelle personnalisée.

## 🤝 Contribution

Les contributions sont les bienvenues ! Ce projet est open source et vise à aider la communauté motarde française.

### Comment contribuer :
- 🐛 Signaler des bugs
- 💡 Proposer des améliorations  
- 📊 Mettre à jour les données
- 🌐 Améliorer la documentation
- 🎨 Améliorer l'interface

## 📄 License

Projet open source - voir le fichier LICENSE pour plus de détails.

---

**Développé avec ❤️ pour la communauté motarde française**

## 🔧 Configuration ESLint (Développeurs)

Pour un projet en production, mettre à jour la configuration ESLint :

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
