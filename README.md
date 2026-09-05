# A. Oluogidan & Co — Law Firm Website & Admin CMS

A production-oriented full-stack law firm website with a custom admin dashboard, built with Next.js, TypeScript, Tailwind CSS, and PostgreSQL. Built and verified end-to-end: a real Postgres database, real migrations, a real seed, a clean production build, and a tested login → dashboard → publish flow.

---

## 1. What's fully built and working

**Public website** — all pages read live from the database, nothing is hardcoded:
Home, About, Practice Areas (list + detail), Team (list + detail), Insights/Blog (list + detail, search/category filter, pagination), FAQ (accordion), Contact (working form → database → email notification), Consultation Request (same), Privacy Policy / Terms / Disclaimer, 404 and error pages, `sitemap.xml`, `robots.txt`.

**Admin dashboard** (`/admin`) — full CRUD, wired to real API routes and the database, not local state:
- Secure login (bcrypt-hashed passwords, JWT sessions), protected by middleware **and** a second server-side check on every admin page
- Dashboard home with live counts and recent activity
- **Lawyers** — create, edit, delete, publish/unpublish, photo upload, practice-area assignment
- **Practice Areas** — create, edit, delete, publish/unpublish, services list, related lawyers, image
- **Insights/Blog** — rich text editor (headings, bold/italic, lists, links, blockquotes, images, tables), categories, tags, draft/publish workflow
- **FAQs** — create, edit, delete, publish/unpublish, optional link to a practice area
- **Testimonials** — create, edit, delete, publish/feature toggles, anonymous display option
- **Enquiries** — view all contact + consultation submissions, change status, delete
- **Media Library** — view and delete uploaded images
- **Settings** — firm info, contact details, social links, homepage hero/stats, SEO defaults, footer
- **Pages** — edit About page content (mission, vision, core values, "why choose us") and the three legal pages (Disclaimer, Privacy, Terms)
- **Admin Users** — Super Admin only: add/edit/deactivate/delete other admins, role assignment
- **Audit Log** — every mutating admin action is recorded and shown on the dashboard

All of the above was tested against a live PostgreSQL database in the build environment: migrations applied, seed data loaded, `next build` completed cleanly, and the login → dashboard → contact-form-to-database flow was verified with real HTTP requests.

## 2. Known simplifications (read before going to production)

These were deliberate scope decisions, not oversights — each is a reasonable next step rather than a blocker:

- **File storage** is local disk (`/public/uploads`) by default. This works fine for a single-server deployment but won't survive a serverless/ephemeral-filesystem host (e.g. Vercel) across deploys. `lib/storage.ts` defines a `StorageDriver` interface — implement it against S3/R2/Cloudinary using the `S3_*` env vars already scaffolded in `.env.example` for a multi-instance or serverless deployment.
- **Email notifications** for new enquiries use `nodemailer` and will happily no-op (with a console log) until you configure real `SMTP_*` env vars.
- **Rate limiting** is in-memory, which is correct for a single Node process. Behind multiple instances or a serverless platform, swap `lib/rate-limit.ts` for a shared store (Upstash/Redis).
- **FAQ/Practice-Area/Service reordering** is append-only from the admin UI (new items go to the end). The `displayOrder` column exists and is respected on the public site, but there's no drag-and-drop reorder control yet — the fastest path is a small drag-and-drop list that PATCHes an array of `{id, displayOrder}`.
- **Analytics** is a single settings field for a GA4 ID; no vendor SDK is bundled. Wire it into `app/layout.tsx` when you're ready.

## 3. Architecture

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 14 (App Router), TypeScript | Server Components read straight from the DB for public pages; API routes handle admin mutations |
| Database | PostgreSQL | Real relational integrity for the lawyer↔practice-area, post↔category/tags relationships the spec called for |
| ORM | **Drizzle ORM** (not Prisma) | Prisma's `generate` step downloads a native query-engine binary from `binaries.prisma.sh` at install/build time. In network-restricted build environments (this one included) that domain is blocked and Prisma cannot function at all. Drizzle is pure TypeScript/JS with a plain TCP driver (`postgres`) and has no such dependency — it's a safer default if you don't control the build environment's network policy. If your environment does allow that domain, migrating back to Prisma is straightforward; the schema is not complex. |
| Auth | Auth.js (NextAuth) v4, Credentials provider, bcrypt, JWT sessions | No third-party identity provider needed for an internal admin tool; JWT avoids needing a sessions table |
| Styling | Tailwind CSS + CSS custom properties | Brand colors/fonts are defined once in `app/globals.css` (`:root` block) so a rebrand doesn't require touching components |
| Rich text | Tiptap | Headings, lists, links, images, tables — matches the spec's editor requirements without a heavyweight WYSIWYG dependency |

### Database schema

19 normalized tables (see `lib/db/schema.ts`): `users`, `lawyers`, `practice_areas`, `practice_area_services`, `lawyer_practice_areas` (join), `blog_posts`, `blog_categories`, `blog_tags`, `blog_post_tags` (join), `faqs`, `testimonials`, `enquiries`, `media`, `site_settings` (singleton), `about_content` (singleton), `core_values`, `why_choose_us_items`, `pages`, `audit_logs`.

### Security

- Passwords hashed with bcrypt (cost factor 12), never stored or logged in plaintext
- Every `/admin/*` and `/api/admin/*` route is checked in `middleware.ts` (edge) **and** again in the route handler / page via `lib/rbac.ts` (defense in depth — a middleware misconfiguration alone can't expose admin data)
- Role checks (`SUPER_ADMIN` vs `EDITOR`) enforced at the same two layers, not just hidden in the UI
- Zod validation on every write path, both client- and server-side
- Public form endpoints (`/api/contact`, `/api/consultation`) are rate-limited and honeypot-protected
- Security headers set in `next.config.js` (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`)
- No secrets in client code; everything sensitive lives in `.env` (see below) and is read server-side only
- **Next.js is pinned to 14.2.34**, which fixes the security advisory Vercel published on 2025-12-11 for the 14.x line. Run `npm outdated` periodically and keep this current in production.

---

## 4. Setup

### Prerequisites
- Node.js 20+
- A PostgreSQL 14+ database (local, Docker, or a hosted provider like Neon/Supabase/RDS)

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env
# then edit .env — at minimum set DATABASE_URL and NEXTAUTH_SECRET
# generate a strong secret with: openssl rand -base64 32

# 3. Apply the database schema
npm run db:generate   # generates SQL migration files from lib/db/schema.ts (only needed after schema changes)
npm run db:migrate    # applies migrations to the database at DATABASE_URL

# 4. Load realistic placeholder content (optional but recommended for a first look)
npm run db:seed

# 5. Run the app
npm run dev
# visit http://localhost:3000 for the public site
# visit http://localhost:3000/admin/login for the admin dashboard
```

### First admin login

The seed script creates two accounts:

| Email | Password | Role |
|---|---|---|
| `admin@aoluogidan.example` | `ChangeMe123!` | Super Admin |
| `editor@aoluogidan.example` | `ChangeMe123!` | Editor |

**Change both passwords immediately** — go to Admin → Admin Users → Edit, or in a fresh production database, skip the seed's demo accounts entirely and create your first real Super Admin directly in the database:

```bash
node -e "console.log(require('bcryptjs').hashSync('YOUR-STRONG-PASSWORD', 12))"
# then insert a row into the users table with that hash, role = 'SUPER_ADMIN'
```

### Environment variables

See `.env.example` for the full list. The ones you must set before going live:

- `DATABASE_URL` — your production Postgres connection string
- `NEXTAUTH_SECRET` — a long random string (`openssl rand -base64 32`)
- `NEXTAUTH_URL` — your production domain, e.g. `https://www.yourfirm.com`
- `SMTP_*` and `FIRM_NOTIFICATION_EMAIL` — so enquiry notifications actually send
- `STORAGE_DRIVER` and `S3_*` — if you're deploying somewhere with an ephemeral filesystem (see §2 above)

---

## 5. Replacing placeholder content

**Everything seeded by `npm run db:seed` is fictional** — the firm name, lawyer names, bios, awards, case outcomes, and testimonials are all placeholders generated for demonstration and must not be presented as real. Before launch:

1. Delete or edit every seeded Lawyer, Practice Area, Blog Post, FAQ, and Testimonial from the admin dashboard
2. Update Settings with the firm's real contact details, social links, and SEO metadata
3. Have the firm's own counsel review and approve the Disclaimer, Privacy Policy, and Terms pages (Admin → Pages) before publishing — the seeded text is explicitly marked as placeholder and is not legal advice
4. Replace the Super Admin/Editor seed accounts with real credentials

---

## 6. Deployment

A straightforward path: **Vercel** (or any Node host) + **Neon/Supabase/RDS** for Postgres + **S3-compatible storage** for uploads.

1. Provision a Postgres database and set `DATABASE_URL`
2. Run `npm run db:migrate` against production (from CI or locally, pointed at the prod `DATABASE_URL`)
3. Set all required env vars in your hosting provider's dashboard (never commit `.env`)
4. If deploying to a serverless/ephemeral-filesystem platform, implement the S3 `StorageDriver` (see §2) before launch — local-disk uploads will not persist across deployments there
5. Deploy; run `npm run db:seed` only if you want the demo content, otherwise create your real first Super Admin as described above
6. Point DNS at the deployment, update `NEXTAUTH_URL` to match

---

## 7. Extending this further

Every admin section follows the same pattern: a Zod schema in `lib/validations/`, a REST-ish API route pair (`route.ts` + `[id]/route.ts`) using `requireUser()`/`requireSuperAdmin()` from `lib/rbac.ts`, and a form component under `components/admin/`. The **Lawyers** CRUD (`app/admin/(protected)/lawyers/`, `app/api/admin/lawyers/`, `components/admin/lawyer-form.tsx`) is the most fully-featured reference implementation (image upload, many-to-many relation, publish toggle) — copy that pattern for any new content type.

Notable structural choice: the protected admin UI lives under `app/admin/(protected)/` — a Next.js route group — while `app/admin/login/` sits outside it. This is required, not stylistic: the protected layout does its own server-side auth redirect, and if the login page shared that layout it would redirect to itself in a loop.
