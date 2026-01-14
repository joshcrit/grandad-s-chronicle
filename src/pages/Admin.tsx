import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LogOut, 
  Clock, 
  CheckCircle, 
  XCircle, 
  FileText, 
  Image as ImageIcon,
  ChevronDown,
  Download,
  Settings,
  Eye,
  Check,
  X,
  Trash2,
  Edit2,
  Loader2
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, getPhotoUrl, deletePhoto } from "@/lib/supabase";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

type SubmissionStatus = "pending" | "approved" | "rejected";

const Admin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | "all">("all");
  const [isEditingBody, setIsEditingBody] = useState(false);
  const [editedBody, setEditedBody] = useState("");

  // Check auth
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/admin/login");
        return;
      }

      // Check admin role
      const { data: roleData, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .single();

      if (error || !roleData) {
        await supabase.auth.signOut();
        navigate("/admin/login");
      }
    };

    checkAuth();
  }, [navigate]);

  // Fetch submissions
  const { data: submissions, isLoading } = useQuery({
    queryKey: ["admin-submissions", statusFilter],
    queryFn: async () => {
      let query = supabase
        .from("submissions")
        .select(`
          *,
          photos (*)
        `)
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: SubmissionStatus }) => {
      const { error } = await supabase
        .from("submissions")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-submissions"] });
      toast.success("Status updated");
    },
    onError: () => {
      toast.error("Failed to update status");
    },
  });

  // Update body mutation
  const updateBodyMutation = useMutation({
    mutationFn: async ({ id, body }: { id: string; body: string }) => {
      const { error } = await supabase
        .from("submissions")
        .update({ body })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-submissions"] });
      setIsEditingBody(false);
      toast.success("Memory updated");
    },
    onError: () => {
      toast.error("Failed to update memory");
    },
  });

  // Delete submission mutation
  const deleteSubmissionMutation = useMutation({
    mutationFn: async (submission: any) => {
      // Delete photos from storage first
      for (const photo of submission.photos || []) {
        await deletePhoto(photo.storage_path);
      }
      
      // Delete submission (photos will cascade delete)
      const { error } = await supabase
        .from("submissions")
        .delete()
        .eq("id", submission.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-submissions"] });
      setSelectedSubmission(null);
      toast.success("Submission deleted");
    },
    onError: () => {
      toast.error("Failed to delete submission");
    },
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const getStatusBadge = (status: SubmissionStatus) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      approved: "bg-green-100 text-green-800 border-green-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
    };
    const icons = {
      pending: Clock,
      approved: CheckCircle,
      rejected: XCircle,
    };
    const Icon = icons[status];
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        <Icon className="w-3.5 h-3.5" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const counts = {
    all: submissions?.length || 0,
    pending: submissions?.filter((s: any) => s.status === "pending").length || 0,
    approved: submissions?.filter((s: any) => s.status === "approved").length || 0,
    rejected: submissions?.filter((s: any) => s.status === "rejected").length || 0,
  };

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="font-serif text-xl text-foreground">
              Memorial Admin
            </h1>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => window.open("/", "_blank")}
                className="btn-memorial-outline text-sm py-2"
              >
                <Eye className="w-4 h-4" />
                View Site
              </button>
              <button 
                onClick={handleLogout}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                title="Log out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { key: "all", label: "All", count: counts.all },
            { key: "pending", label: "Pending", count: counts.pending },
            { key: "approved", label: "Approved", count: counts.approved },
            { key: "rejected", label: "Rejected", count: counts.rejected },
          ].map((stat) => (
            <button
              key={stat.key}
              onClick={() => setStatusFilter(stat.key as any)}
              className={`memorial-card p-4 text-left transition-all ${
                statusFilter === stat.key 
                  ? "ring-2 ring-accent" 
                  : "hover:shadow-md"
              }`}
            >
              <p className="text-2xl font-semibold text-foreground">{stat.count}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </button>
          ))}
        </div>

        {/* Export Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-serif text-xl text-foreground">Submissions</h2>
          <DropdownMenu>
            <DropdownMenuTrigger className="btn-memorial text-sm py-2">
              <Download className="w-4 h-4" />
              Export
              <ChevronDown className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => toast.info("PDF export coming soon!")}>
                <FileText className="w-4 h-4 mr-2" />
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.info("ZIP export coming soon!")}>
                <ImageIcon className="w-4 h-4 mr-2" />
                Download ZIP
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Submissions List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="memorial-card p-6">
                <Skeleton className="h-6 w-1/3 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : submissions && submissions.length > 0 ? (
          <div className="space-y-4">
            {submissions.map((submission: any) => (
              <div
                key={submission.id}
                className="memorial-card p-6 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => {
                  setSelectedSubmission(submission);
                  setEditedBody(submission.body);
                  setIsEditingBody(false);
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-serif text-lg text-foreground truncate">
                        {submission.title}
                      </h3>
                      {getStatusBadge(submission.status)}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {submission.body}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {submission.contributor_name && (
                        <span>By: {submission.contributor_name}</span>
                      )}
                      <span>
                        {new Date(submission.created_at).toLocaleDateString()}
                      </span>
                      {submission.photos?.length > 0 && (
                        <span className="flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" />
                          {submission.photos.length} photo{submission.photos.length !== 1 && "s"}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {submission.status !== "approved" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatusMutation.mutate({ id: submission.id, status: "approved" });
                        }}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                        title="Approve"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    )}
                    {submission.status !== "rejected" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatusMutation.mutate({ id: submission.id, status: "rejected" });
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Reject"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="memorial-card p-12 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-serif text-xl text-foreground mb-2">
              No Submissions Yet
            </h3>
            <p className="text-muted-foreground">
              Submissions will appear here as they come in.
            </p>
          </div>
        )}
      </main>

      {/* Detail Modal */}
      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedSubmission && (
            <>
              <DialogHeader>
                <DialogTitle className="font-serif text-2xl pr-8">
                  {selectedSubmission.title}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Status & Meta */}
                <div className="flex flex-wrap items-center gap-4">
                  {getStatusBadge(selectedSubmission.status)}
                  <span className="text-sm text-muted-foreground">
                    {new Date(selectedSubmission.created_at).toLocaleString()}
                  </span>
                </div>

                {/* Contributor */}
                {(selectedSubmission.contributor_name || selectedSubmission.contributor_relationship) && (
                  <div className="bg-muted rounded-md p-4">
                    <p className="text-sm">
                      <span className="font-medium">
                        {selectedSubmission.contributor_name || "Anonymous"}
                      </span>
                      {selectedSubmission.contributor_relationship && (
                        <span className="text-muted-foreground">
                          {" · "}{selectedSubmission.contributor_relationship}
                        </span>
                      )}
                    </p>
                    {selectedSubmission.contributor_email && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedSubmission.contributor_email}
                      </p>
                    )}
                  </div>
                )}

                {/* Body */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-foreground">Memory</h4>
                    <button
                      onClick={() => {
                        setIsEditingBody(!isEditingBody);
                        setEditedBody(selectedSubmission.body);
                      }}
                      className="text-sm text-accent hover:underline flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      {isEditingBody ? "Cancel" : "Edit"}
                    </button>
                  </div>
                  {isEditingBody ? (
                    <div className="space-y-3">
                      <textarea
                        value={editedBody}
                        onChange={(e) => setEditedBody(e.target.value)}
                        className="textarea-memorial min-h-[150px]"
                      />
                      <button
                        onClick={() => updateBodyMutation.mutate({
                          id: selectedSubmission.id,
                          body: editedBody,
                        })}
                        disabled={updateBodyMutation.isPending}
                        className="btn-memorial text-sm"
                      >
                        {updateBodyMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Save Changes"
                        )}
                      </button>
                    </div>
                  ) : (
                    <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed">
                      {selectedSubmission.body}
                    </p>
                  )}
                </div>

                {/* Photos */}
                {selectedSubmission.photos?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-foreground mb-3">
                      Photos ({selectedSubmission.photos.length})
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {selectedSubmission.photos
                        .sort((a: any, b: any) => a.order_index - b.order_index)
                        .map((photo: any) => (
                          <div key={photo.id} className="photo-frame">
                            <img
                              src={getPhotoUrl(photo.storage_path)}
                              alt={photo.caption || "Photo"}
                              className="w-full aspect-square object-cover"
                            />
                            {photo.caption && (
                              <p className="p-2 text-xs text-muted-foreground">
                                {photo.caption}
                              </p>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
                  <button
                    onClick={() => {
                      updateStatusMutation.mutate({
                        id: selectedSubmission.id,
                        status: "approved",
                      });
                      setSelectedSubmission({ ...selectedSubmission, status: "approved" });
                    }}
                    disabled={selectedSubmission.status === "approved"}
                    className="btn-memorial text-sm disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      updateStatusMutation.mutate({
                        id: selectedSubmission.id,
                        status: "rejected",
                      });
                      setSelectedSubmission({ ...selectedSubmission, status: "rejected" });
                    }}
                    disabled={selectedSubmission.status === "rejected"}
                    className="btn-memorial-outline text-sm disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                    Reject
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to permanently delete this submission?")) {
                        deleteSubmissionMutation.mutate(selectedSubmission);
                      }
                    }}
                    className="ml-auto text-sm text-destructive hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
