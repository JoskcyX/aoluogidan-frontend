import Link from "next/link";
import { adminFetchJson } from "@/lib/api";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Scale, Newspaper, Inbox, Quote, FilePlus, UserPlus, MessageSquarePlus } from "lucide-react";

export default async function AdminDashboardPage() {
  const {
    lawyerCount,
    practiceAreaCount,
    publishedCount,
    draftCount,
    unreadCount,
    testimonialCount,
    recentEnquiries = [],
    recentActivity = [],
  } = await adminFetchJson("/api/admin/dashboard");

  const stats = [
    { label: "Total Lawyers", value: lawyerCount, icon: Users, href: "/admin/lawyers" },
    { label: "Practice Areas", value: practiceAreaCount, icon: Scale, href: "/admin/practice-areas" },
    { label: "Published Articles", value: publishedCount, icon: Newspaper, href: "/admin/blog" },
    { label: "Draft Articles", value: draftCount, icon: Newspaper, href: "/admin/blog" },
    { label: "Unread Enquiries", value: unreadCount, icon: Inbox, href: "/admin/enquiries" },
    { label: "Published Testimonials", value: testimonialCount, icon: Quote, href: "/admin/testimonials" },
  ];

  return (
    <Container className="max-w-none px-0">
      <h1 className="font-display text-2xl text-ink">Dashboard</h1>
      <p className="mt-1 text-sm text-slate">A quick overview of your website.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="flex items-center gap-4 border border-line bg-white p-5 hover:border-brass">
            <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-brass/10">
              <stat.icon className="text-brass-deep" size={20} />
            </div>
            <div>
              <p className="font-display text-2xl text-ink">{stat.value}</p>
              <p className="text-xs text-slate">{stat.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/lawyers/new"><Button size="sm"><UserPlus size={16} className="mr-1" /> Add Lawyer</Button></Link>
          <Link href="/admin/practice-areas/new"><Button size="sm" variant="secondary"><FilePlus size={16} className="mr-1" /> Add Practice Area</Button></Link>
          <Link href="/admin/blog/new"><Button size="sm" variant="secondary"><MessageSquarePlus size={16} className="mr-1" /> Write Article</Button></Link>
          <Link href="/admin/enquiries"><Button size="sm" variant="ghost">View Enquiries</Button></Link>
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="border border-line bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg text-ink">Recent Enquiries</h2>
            <Link href="/admin/enquiries" className="text-xs font-medium text-brass-deep hover:underline">View all</Link>
          </div>
          {recentEnquiries.length === 0 ? (
            <p className="text-sm text-slate">No enquiries yet.</p>
          ) : (
            <ul className="divide-y divide-line">
              {recentEnquiries.map((e: any) => (
                <li key={e.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-ink">{e.fullName}</p>
                    <p className="text-xs text-slate">{e.type === "CONSULTATION" ? "Consultation Request" : "Contact Enquiry"}</p>
                  </div>
                  <Badge variant={e.status === "NEW" ? "warning" : "neutral"}>{e.status}</Badge>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border border-line bg-white p-6">
          <h2 className="mb-4 font-display text-lg text-ink">Recent Activity</h2>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-slate">No activity recorded yet.</p>
          ) : (
            <ul className="space-y-3">
              {recentActivity.map((a: any) => (
                <li key={a.id} className="text-sm text-slate">
                  <span className="font-medium text-ink">{a.userName}</span> {a.description}
                  <span className="block text-xs text-slate/70">{new Date(a.createdAt).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Container>
  );
}
