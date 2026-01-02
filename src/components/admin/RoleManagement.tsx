import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminRole, AdminRole } from "@/hooks/useAdminRole";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Shield, UserPlus, Trash2, Search, Crown } from "lucide-react";
import { format } from "date-fns";

interface AdminUser {
  id: string;
  user_id: string;
  admin_role: AdminRole;
  assigned_city: string | null;
  created_at: string;
  profile?: {
    full_name: string | null;
    email: string | null;
  };
}

const ADMIN_ROLES: { value: AdminRole; label: string; description: string }[] = [
  { value: "super_admin", label: "Super Admin", description: "Full platform access" },
  { value: "platform_admin", label: "Platform Admin", description: "Operations management" },
  { value: "finance_admin", label: "Finance Admin", description: "Payments & invoicing" },
  { value: "verification_admin", label: "Verification Admin", description: "Trust & safety" },
  { value: "city_admin", label: "City Admin", description: "Regional management" },
  { value: "service_marketplace_admin", label: "Service Admin", description: "Vendor onboarding" },
  { value: "community_moderator", label: "Community Mod", description: "Content moderation" },
  { value: "support_admin", label: "Support Admin", description: "User tickets" },
];

const getRoleBadgeColor = (role: AdminRole) => {
  switch (role) {
    case "super_admin":
      return "bg-gradient-to-r from-primary to-secondary text-primary-foreground";
    case "platform_admin":
      return "bg-primary/20 text-primary border-primary/30";
    case "finance_admin":
      return "bg-accent/20 text-accent border-accent/30";
    case "verification_admin":
      return "bg-secondary/20 text-secondary border-secondary/30";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const RoleManagement = () => {
  const { isSuperAdmin, isPlatformAdmin } = useAdminRole();
  const { toast } = useToast();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminRole, setNewAdminRole] = useState<AdminRole>("support_admin");
  const [newAdminCity, setNewAdminCity] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    const { data, error } = await supabase
      .from("admin_roles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching admins:", error);
      return;
    }

    // Fetch profile data for each admin
    const adminIds = data?.map((a) => a.user_id) || [];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .in("id", adminIds);

    const adminsWithProfiles = data?.map((admin) => ({
      ...admin,
      profile: profiles?.find((p) => p.id === admin.user_id),
    })) || [];

    setAdmins(adminsWithProfiles);
    setLoading(false);
  };

  const handleAddAdmin = async () => {
    if (!newAdminEmail.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    // Find user by email
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", newAdminEmail.trim())
      .single();

    if (profileError || !profile) {
      toast({
        title: "User not found",
        description: "No user found with that email address",
        variant: "destructive",
      });
      setSubmitting(false);
      return;
    }

    // Check if already an admin
    const existing = admins.find((a) => a.user_id === profile.id);
    if (existing) {
      toast({
        title: "Already an admin",
        description: "This user already has an admin role",
        variant: "destructive",
      });
      setSubmitting(false);
      return;
    }

    // Add admin role
    const { error } = await supabase.from("admin_roles").insert({
      user_id: profile.id,
      admin_role: newAdminRole,
      assigned_city: newAdminCity || null,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add admin role",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Admin role assigned successfully",
      });
      setIsDialogOpen(false);
      setNewAdminEmail("");
      setNewAdminRole("support_admin");
      setNewAdminCity("");
      fetchAdmins();
    }

    setSubmitting(false);
  };

  const handleRemoveAdmin = async (adminId: string, userId: string) => {
    const { error } = await supabase
      .from("admin_roles")
      .delete()
      .eq("id", adminId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to remove admin role",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Admin role removed successfully",
      });
      fetchAdmins();
    }
  };

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.profile?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.profile?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.admin_role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const canManageRoles = isSuperAdmin || isPlatformAdmin;

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-foreground flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Admin Role Management
        </CardTitle>
        {canManageRoles && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Admin
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle>Add New Admin</DialogTitle>
                <DialogDescription>
                  Assign an admin role to an existing user
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>User Email</Label>
                  <Input
                    placeholder="Enter user email..."
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Admin Role</Label>
                  <Select
                    value={newAdminRole}
                    onValueChange={(v) => setNewAdminRole(v as AdminRole)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ADMIN_ROLES.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          <div className="flex flex-col">
                            <span>{role.label}</span>
                            <span className="text-xs text-muted-foreground">
                              {role.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {newAdminRole === "city_admin" && (
                  <div className="space-y-2">
                    <Label>Assigned City</Label>
                    <Input
                      placeholder="Enter city name..."
                      value={newAdminCity}
                      onChange={(e) => setNewAdminCity(e.target.value)}
                    />
                  </div>
                )}
                <Button
                  className="w-full"
                  onClick={handleAddAdmin}
                  disabled={submitting}
                >
                  {submitting ? "Adding..." : "Add Admin"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search admins..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {ADMIN_ROLES.slice(0, 4).map((role) => {
            const count = admins.filter((a) => a.admin_role === role.value).length;
            return (
              <div
                key={role.value}
                className="p-3 rounded-lg bg-background/50 border border-border/30"
              >
                <p className="text-xs text-muted-foreground">{role.label}</p>
                <p className="text-2xl font-bold text-foreground">{count}</p>
              </div>
            );
          })}
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-pulse text-muted-foreground">Loading...</div>
          </div>
        ) : filteredAdmins.length === 0 ? (
          <div className="text-center py-8">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No admins found</p>
          </div>
        ) : (
          <div className="rounded-lg border border-border/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Added</TableHead>
                  {canManageRoles && <TableHead className="w-[80px]">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAdmins.map((admin) => (
                  <TableRow key={admin.id} className="hover:bg-muted/20">
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground flex items-center gap-2">
                          {admin.profile?.full_name || "Unknown"}
                          {admin.admin_role === "super_admin" && (
                            <Crown className="h-4 w-4 text-primary" />
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {admin.profile?.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(admin.admin_role)}>
                        {admin.admin_role.replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {admin.assigned_city ? (
                        <span className="text-foreground">{admin.assigned_city}</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(admin.created_at), "MMM d, yyyy")}
                    </TableCell>
                    {canManageRoles && (
                      <TableCell>
                        {admin.admin_role !== "super_admin" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleRemoveAdmin(admin.id, admin.user_id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RoleManagement;
