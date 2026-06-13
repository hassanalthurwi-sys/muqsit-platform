// Sprint 14 — System admin route group.
//
// Distinct from the office app `(app)` group: gets its own sidebar
// dedicated to platform-level operations. Visual identity stays the
// same (Saudi banking style) so admins feel at home, but the top-left
// label changes to "النظام · مُقسِّط".

import { AdminSidebar } from "@/components/admin/sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
