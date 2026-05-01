import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { Cloud, Search, User, LogOut, LayoutDashboard } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { signOut } from "@/app/auth/actions";

export const metadata: Metadata = {
  title: "CloudBlog | Premium Tech Insights",
  description: "A modern, high-performance blog platform built with Next.js and Supabase.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <nav className="nav-container">
          <Link href="/" className="nav-logo">
            <Cloud size={24} color="#3b82f6" />
            <span className="gradient-text">CloudBlog</span>
          </Link>
          <div className="nav-links">
            <Link href="/" className="nav-link">Articles</Link>
            <Link href="/about" className="nav-link">About</Link>
            {user && <Link href="/admin" className="nav-link" style={{ color: 'var(--accent)' }}>Admin</Link>}
          </div>
          <div className="flex items-center gap-4">
            <button className="icon-btn">
              <Search size={20} />
            </button>
            {user ? (
              <div className="flex items-center gap-4">
                <form action={signOut}>
                  <button type="submit" className="icon-btn" title="Sign Out">
                    <LogOut size={20} />
                  </button>
                </form>
                <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), #8b5cf6)', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
                  {user.email?.[0].toUpperCase()}
                </div>
              </div>
            ) : (
              <Link href="/login" className="btn-primary">
                <User size={16} />
                Sign In
              </Link>
            )}
          </div>
        </nav>
        <main className="container">
          {children}
        </main>
        <footer className="container" style={{ marginTop: '5rem', borderTop: '1px solid var(--card-border)', padding: '2rem 0', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          &copy; {new Date().getFullYear()} CloudBlog. Built with Next.js & Supabase.
        </footer>
      </body>
    </html>
  );
}
