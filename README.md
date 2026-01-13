This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Security

This portfolio includes a password-protected section with enterprise-grade security:

- **Bcrypt password hashing** (salt rounds: 10)
- **Rate limiting** (5 attempts / 15 minutes per IP)
- **Access logging** with IP sanitization
- **JWT authentication** with HttpOnly cookies
- **Timing attack protection**
- **Security HTTP headers**

### Setup Authentication

1. Generate password hash:

```bash
node scripts/generate-password-hash.js YOUR_PASSWORD
```

2. Add to `.env.local`:

```bash
PORTFOLIO_PASSWORD_HASH=$2b$10$...generated_hash...
PORTFOLIO_AUTH_SECRET=...long_random_secret...
```

To generate a random secret (macOS / Linux):

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

3. Start development server:

```bash
npm run dev
```

### View Access Logs

```bash
# View recent login attempts
node scripts/view-logs.js

# View last 50 entries
node scripts/view-logs.js --limit=50

# View only failed attempts
node scripts/view-logs.js --failed
```

### Full Documentation

See complete security documentation in [/docs/SECURITY.md](./docs/SECURITY.md) including:

- Changing passwords
- Rate limiting configuration
- Production deployment
- Troubleshooting
- Scalability options
