# Insighta CLI

A globally installable CLI tool for the Insighta Labs+ Profile Intelligence System. This CLI provides command-line access to profile management with GitHub OAuth authentication, role-based access control, filtering, sorting, pagination, natural language search, and CSV export capabilities.

## Installation

```bash
# Clone the repository
git clone <repo-url>
cd insighta-cli

# Install dependencies
pnpm install

# Build the CLI
pnpm build

# Link globally
pnpm link
```

## Authentication

The CLI uses GitHub OAuth with PKCE (Proof Key for Code Exchange) for secure authentication.

### Commands

```bash
# Login to your account
insighta login

# Check current user
insighta whoami

# Logout
insighta logout
```

Credentials are stored at `~/.insighta/credentials.json`.

## Profile Management

### Create a Profile

```bash
insighta profiles create --name "John Doe"
```

### List Profiles

```bash
# Basic list
insighta profiles list

# With filtering
insighta profiles list --gender female --country_id NG

# With age filters
insighta profiles list --min_age 18 --max_age 35

# With sorting
insighta profiles list --sort_by age --order desc

# With pagination
insighta profiles list --page 2 --limit 20
```

**Options:**
- `--gender` - Filter by gender (`male` or `female`)
- `--country_id` - Filter by ISO 3166-1 alpha-2 country code (e.g., `NG`, `GH`)
- `--age_group` - Filter by age group (`child`, `teenager`, `adult`, `senior`)
- `--min_age` - Minimum age (inclusive)
- `--max_age` - Maximum age (inclusive)
- `--min_gender_probability` - Minimum gender confidence score (0-1)
- `--min_country_probability` - Minimum country confidence score (0-1)
- `--sort_by` - Sort field (`age`, `created_at`, `gender_probability`)
- `--order` - Sort direction (`asc` or `desc`)
- `--page` - Page number (default: 1)
- `--limit` - Results per page (1-50, default: 10)

### Get Profile by ID

```bash
insighta profiles get <profile-id>
```

### Search Profiles

```bash
insighta profiles search "John"
```

### Export Profiles

```bash
# Export to CSV
insighta profiles export --format csv

# With filters
insighta profiles export --format csv --country_id NG --gender male
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm build` | Build the CLI with tsdown |
| `pnpm dev` | Development mode with hot reload |
| `pnpm typecheck` | TypeScript type checking |
| `pnpm lint` | ESLint code analysis |

## Dependencies

| Package | Purpose |
|---------|---------|
| [commander](https://www.npmjs.com/package/commander) | CLI framework |
| [@clack/prompts](https://www.npmjs.com/package/@clack/prompts) | UI prompts and spinners |
| [axios](https://www.npmjs.com/package/axios) | HTTP client with token refresh |
| [express](https://www.npmjs.com/package/express) | Local server for OAuth callback |
| [pkce-challenge](https://www.npmjs.com/package/pkce-challenge) | PKCE challenge generation |
| [open](https://www.npmjs.com/package/open) | Open browser for OAuth flow |
| [cli-table3](https://www.npmjs.com/package/cli-table3) | Terminal table rendering |
| [zod](https://www.npmjs.com/package/zod) | Schema validation |
| [lodash](https://www.npmjs.com/package/lodash) | Utility functions |
| [uuid](https://www.npmjs.com/package/uuid) | Unique ID generation |
| [cookie](https://www.npmjs.com/package/cookie) | Cookie parsing |
| [content-disposition](https://www.npmjs.com/package/content-disposition) | Content-Disposition header parsing |
| [dotenv](https://www.npmjs.com/package/dotenv) | Environment variable loading |

## API Versioning

The CLI sends `X-API-Version: 1` header with all requests.

## Token Management

- Access tokens are automatically added to the `Authorization` header
- On 401 responses, the CLI attempts to refresh the token using the refresh token
- If refresh fails, it prompts for re-authentication

## Backend

The CLI connects to a shared backend that also serves the web portal. Configure the backend URL via environment variables:

- `NODE_ENV=development` - Uses localhost (port 6060 by default)
- `NODE_ENV=production` - Uses production backend URL

## Role-Based Access

The system supports two roles:
- **admin** - Full access
- **analyst** - Limited access

## License

ISC