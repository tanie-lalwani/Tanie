import type { Metadata } from "next";
import AdminPortal from "@/views/AdminPortal";

export const metadata: Metadata = {
  title: "Admin Portal & Studio Management | Tanie Lalwani",
  description: "Executive administration dashboard for Tanie Lalwani Studio.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return <AdminPortal />;
}
