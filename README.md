# Erik's Portfolio Site
[![Netlify Status](https://api.netlify.com/api/v1/badges/ce6a60de-8447-44fd-bb29-43472ec1f850/deploy-status)](https://app.netlify.com/sites/erik-website/deploys)

The latest iteration of my personal website, this time built with **Jamstack**! 

## Tech Stack

- [Next.js](https://nextjs.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [TinaCMS](https://tina.io/)

See the full list of dependencies [here](package.json).

## Installation 

```bash 
  # clone the project
  git clone git@github.com:eriksaulnier/erik-website.git
  
  # go to the project directory
  cd erik-website
  
  # install npm dependencies
  yarn

  # duplicate environment file template
  cp .env.example .env
```

Required environment variables:
```env
NEXT_PUBLIC_TINA_CLIENT_ID=<get from app.tina.io>
TINA_TOKEN=<get from app.tina.io>
```

## Run Locally

```bash 
  # start the development server
  yarn dev
```

## Deployment

```bash
  # build the site to the .next folder
  yarn build

  # start a nodejs server to host the site
  yarn start
```
