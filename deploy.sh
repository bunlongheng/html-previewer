#!/bin/bash

project_name=${PWD##*/}
npm run build || exit 1
command -v vercel &> /dev/null || npm install -g vercel
vercel whoami &> /dev/null || vercel login
[ -f .vercel/project.json ] || vercel link --project "$project_name" --yes
vercel --prod --yes