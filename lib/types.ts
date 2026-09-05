/**
 * The database (and its Drizzle schema) now lives entirely in the backend
 * service. The frontend only ever sees plain JSON over HTTP, so these are
 * loose structural types — enough for editor autocomplete and to keep
 * existing component prop signatures working, without duplicating the
 * full schema here. If you want strict typing, generate these from the
 * backend's OpenAPI schema instead.
 */
export type SiteSettings = Record<string, any>;
export type PracticeArea = Record<string, any>;
export type Lawyer = Record<string, any>;
export type BlogCategory = Record<string, any>;
export type Faq = Record<string, any>;
export type Testimonial = Record<string, any>;
export type Media = Record<string, any>;
export type Page = Record<string, any>;
export type Enquiry = Record<string, any>;
