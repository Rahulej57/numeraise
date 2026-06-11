import { ReactNode } from 'react';
import Link from 'next/link';
import { LayoutDashboard, FileText, Calculator, Settings, Users } from 'lucide-react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-muted/20">
      <aside className="w-64 border-r bg-background flex flex-col">
        <div className="h-16 flex items-center px-6 border-b">
          <span className="font-bold text-lg">Numeraise Admin</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavItem href="/admin" icon={<LayoutDashboard size={18} />} label="Dashboard" />
          <NavItem href="/admin/calculators" icon={<Calculator size={18} />} label="Calculators" />
          <NavItem href="/admin/blog" icon={<FileText size={18} />} label="Blog/CMS" />
          <NavItem href="/admin/users" icon={<Users size={18} />} label="Users" />
          <NavItem href="/admin/settings" icon={<Settings size={18} />} label="Settings" />
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}

function NavItem({ href, icon, label }: { href: string; icon: ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
    >
      {icon}
      {label}
    </Link>
  );
}
