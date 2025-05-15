FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install

ARG NEXT_PUBLIC_API_URL
ARG NEXTAUTH_URL
ARG NEXTAUTH_SECRET

RUN touch .env.production

RUN echo "NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL\n" >> .env.production
RUN echo "NEXTAUTH_URL=$NEXTAUTH_URL\n" >> .env.production
RUN echo "NEXTAUTH_SECRET=$NEXTAUTH_SECRET\n" >> .env.production

COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app

RUN npm install -g next

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["npm", "start"]