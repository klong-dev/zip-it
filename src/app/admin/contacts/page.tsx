"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { contactAPI, ContactResponse } from "@/lib/apiService";
import { Mail, AlertCircle } from "lucide-react";

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  submittedAt: string;
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<ContactResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContacts() {
      try {
        const data = await contactAPI.getAll();
        setContacts(data);
      } catch (error) {
        console.error("Failed to fetch contacts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchContacts();
  }, []);

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Mail className="w-8 h-8 text-[#980b15]" />
        <div>
          <h1 className="text-2xl font-bold text-[#111111]">Yêu cầu liên hệ</h1>
          <p className="text-sm text-[#74787c]">Danh sách các yêu cầu liên hệ của người dùng</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-[#980b15] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : contacts.length === 0 ? (
        <Card className="p-12 text-center">
          <AlertCircle className="w-16 h-16 text-[#74787c] mx-auto mb-4" />
          <h3 className="text-xl font-bold text-[#111111] mb-2">Không có yêu cầu</h3>
          <p className="text-[#74787c]">Hiện tại không có yêu cầu liên hệ từ khách hàng nào.</p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f6f6f7]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#111111]">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#111111]">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#111111]">Phone</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#111111]">Message</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#111111]">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ebebeb]">
                {contacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-[#f6f6f7] transition-colors">
                    <td className="px-6 py-4 font-medium text-[#111111]">{contact.name}</td>
                    <td className="px-6 py-4 text-sm text-[#74787c]">{contact.email}</td>
                    <td className="px-6 py-4 text-sm text-[#74787c]">{contact.phone}</td>
                    <td className="px-6 py-4 text-sm text-[#74787c] max-w-xs truncate">{contact.message}</td>
                    <td className="px-6 py-4 text-sm text-[#74787c]">{new Date(contact.submittedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
