import { Calendar, Mail, Phone, Search, User, Download } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "../../utils/axiosConfig";
import { exportToCSV } from "../../utils/csvExport";

const backendUrl = import.meta.env?.VITE_API_URL;

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${backendUrl}/api/admin/all-users`, { withCredentials: true });
        if (res.data?.success) {
          setUsers(Array.isArray(res.data.users) ? res.data.users : []);
        } else {
          toast.error(res.data?.message || "Failed to load users");
        }
      } catch (err) {
        console.error("Fetch users error:", err);
        toast.error("Unable to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      [u.name, u.email]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(q))
    );
  }, [users, query]);

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString("en-IN") : "-");

  const exportUsersCSV = () => {
    const rows = filtered.map((u) => ({
      Name: [u.firstName, u.lastName].filter(Boolean).join(" ") || u.name || "",
      Email: u.email || "",
      Phone: u.phone || "",
      Role: "User",
      Joined: formatDate(u.date || u.createdAt),
    }));
    exportToCSV({ data: rows, filename: "users" });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-legpro-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-legpro-primary flex items-center gap-2">
            <User className="h-6 w-6" />
            Users Management
          </CardTitle>
          <p className="text-gray-600">Total: {users.length} users</p>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-6 flex flex-col md:flex-row gap-3 md:items-center">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="md:ml-auto">
              <Button variant="outline" onClick={exportUsersCSV} className="flex items-center gap-2">
                <Download className="h-4 w-4" /> Download CSV
              </Button>
            </div>
          </div>

          {/* List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((user) => (
              <Card key={user._id} className="border border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-legpro-primary text-white rounded-full flex items-center justify-center font-semibold">
                      {user.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 truncate">{user.firstName + " " + user.lastName}</h3>
                        <Badge variant="outline">User</Badge>
                      </div>
                      <a href={`mailto:${user.email}`} className="mt-1 hover:underline text-sm text-gray-600 flex items-center gap-2 truncate">
                        <Mail className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </a>
                      <a href={`tel:${user.phone}`} className="mt-1 hover:underline text-sm text-gray-600 flex items-center gap-2 truncate">
                        <Phone className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{user.phone}</span>
                      </a>
                      <div className="mt-1 text-xs text-gray-500 flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        Joined {formatDate(user.date || user.createdAt)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-500">Try a different search</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersManagement;
