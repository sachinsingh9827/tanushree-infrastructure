import { ImagePlus } from "lucide-react";
import { useRef, useState } from "react";
import {
  useCreateAdminGalleryMutation,
  useGetAdminGalleryQuery,
  useGetAdminProjectsQuery,
  useGetAdminServicesQuery,
  useDeleteAdminGalleryMutation,
  useDeleteAdminProjectMutation,
  useDeleteAdminServiceMutation
} from "../../store/websiteApi.js";
import { useToast } from "../../context/ToastContext.jsx";
import CustomSelect from "../../components/CustomSelect.jsx";
import AdminLayout from "../components/AdminLayout.jsx";
import BulkActions from "../components/BulkActions.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";
import DataTable from "../components/DataTable.jsx";
import ListToolbar from "../components/ListToolbar.jsx";
import Loader from "../components/Loader.jsx";
import Pagination from "../components/Pagination.jsx";

const queries = {
  projects: useGetAdminProjectsQuery,
  services: useGetAdminServicesQuery,
  gallery: useGetAdminGalleryQuery
};

const statusOptions = {
  projects: ["Completed", "Ongoing", "Upcoming"],
  services: ["active", "inactive"],
  gallery: ["published", "draft"]
};

export default function ResourceList({ type }) {
  const fileInputRef = useRef(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");
  const [status, setStatus] = useState("");
  const [galleryForm, setGalleryForm] = useState({ title: "", status: "published" });
  const [galleryImage, setGalleryImage] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { showToast } = useToast();
  const useQuery = queries[type];
  const { data, isLoading } = useQuery({ page, limit: 10, search, sort, status });
  const [createGallery, { isLoading: creatingGallery }] = useCreateAdminGalleryMutation();
  const [deleteProject, { isLoading: deletingProject }] = useDeleteAdminProjectMutation();
  const [deleteService, { isLoading: deletingService }] = useDeleteAdminServiceMutation();
  const [deleteGallery, { isLoading: deletingGallery }] = useDeleteAdminGalleryMutation();
  const title = type[0].toUpperCase() + type.slice(1);
  const isDeleting = deletingProject || deletingService || deletingGallery;
  const deleteMutation = {
    projects: deleteProject,
    services: deleteService,
    gallery: deleteGallery
  }[type];

  function toggleRow(id) {
    setSelectedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function toggleAll(rows) {
    const rowIds = rows.map((row) => row._id || row.id);
    setSelectedIds((current) =>
      rowIds.every((id) => current.includes(id)) ? current.filter((id) => !rowIds.includes(id)) : [...new Set([...current, ...rowIds])]
    );
  }

  async function handleBulkDelete() {
    await Promise.all(selectedIds.map((id) => deleteMutation(id).unwrap()));
    setSelectedIds([]);
    setConfirmOpen(false);
  }

  async function handleCreateGallery(event) {
    event.preventDefault();

    if (!galleryForm.title.trim() || !galleryImage) {
      showToast({ message: "Please add gallery title and image.", type: "warning" });
      return;
    }

    const formData = new FormData();
    formData.append("title", galleryForm.title.trim());
    formData.append("status", galleryForm.status);
    formData.append("image", galleryImage);

    try {
      await createGallery(formData).unwrap();
      setGalleryForm({ title: "", status: "published" });
      setGalleryImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setPage(1);
      showToast({ message: "Gallery image added successfully.", type: "success" });
    } catch (error) {
      showToast({ message: error?.data?.message || "Unable to add gallery image.", type: "error" });
    }
  }

  const columns = [
    { key: "title", label: "Title" },
    { key: "status", label: "Status" },
    { key: "sortOrder", label: "Order" },
    { key: "createdAt", label: "Created", render: (row) => new Date(row.createdAt).toLocaleDateString() }
  ];

  return (
    <AdminLayout title={title}>
      <ListToolbar
        filters={[
          {
            name: "status",
            label: "Status",
            value: status,
            onChange: (value) => {
              setStatus(value);
              setPage(1);
            },
            options: [
              { label: "All statuses", value: "" },
              ...statusOptions[type].map((value) => ({ label: value, value }))
            ]
          }
        ]}
        onReset={() => {
          setSearch("");
          setSort("latest");
          setStatus("");
          setSelectedIds([]);
          setPage(1);
        }}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        onSortChange={(value) => {
          setSort(value);
          setPage(1);
        }}
        search={search}
        sort={sort}
      />
      {type === "gallery" ? (
        <form
          className="mb-4 rounded-custom border border-primary/10 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950"
          onSubmit={handleCreateGallery}
        >
          <div className="mb-3 flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-custom bg-header text-primary dark:bg-primary dark:text-secondary">
              <ImagePlus size={18} />
            </span>
            <div>
              <h3 className="text-sm font-bold text-primary dark:text-white">Add Gallery Image</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Upload an image with title for the public gallery.</p>
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-[minmax(220px,1fr)_minmax(220px,1fr)_180px_auto] lg:items-end">
            <label className="grid gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Title</span>
              <input
                className="rounded-custom border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-primary/40 focus:bg-white"
                onChange={(event) => setGalleryForm((current) => ({ ...current, title: event.target.value }))}
                placeholder="Gallery image title"
                type="text"
                value={galleryForm.title}
              />
            </label>

            <label className="grid gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Image</span>
              <input
                accept="image/*"
                className="rounded-custom border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none file:mr-3 file:rounded file:border-0 file:bg-primary file:px-3 file:py-1 file:text-xs file:font-semibold file:text-white focus:border-primary/40 focus:bg-white"
                onChange={(event) => setGalleryImage(event.target.files?.[0] || null)}
                ref={fileInputRef}
                type="file"
              />
            </label>

            <label className="grid gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Status</span>
              <CustomSelect
                onChange={(value) => setGalleryForm((current) => ({ ...current, status: value }))}
                options={["published", "draft"]}
                value={galleryForm.status}
              />
            </label>

            <button
              className="rounded-custom bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={creatingGallery}
              type="submit"
            >
              {creatingGallery ? "Adding..." : "Add Image"}
            </button>
          </div>
        </form>
      ) : null}
      <BulkActions count={selectedIds.length} disabled={isDeleting} onDelete={() => setConfirmOpen(true)} />
      {isLoading ? (
        <Loader label={`Loading ${type}...`} />
      ) : (
        <DataTable
          columns={columns}
          onToggleAll={toggleAll}
          onToggleRow={toggleRow}
          rows={data?.data || []}
          selectable
          selectedIds={selectedIds}
        />
      )}
      <Pagination meta={data?.meta} onPageChange={setPage} />
      <ConfirmModal
        confirmText="Delete"
        message={`Delete ${selectedIds.length} selected ${type}?`}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleBulkDelete}
        open={confirmOpen}
        title="Confirm bulk delete"
      />
    </AdminLayout>
  );
}
