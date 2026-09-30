import { useState } from "react";
import {
  useDeleteAdminContactMutation,
  useGetAdminContactsQuery,
  useUpdateAdminContactMutation
} from "../../store/websiteApi.js";
import AdminLayout from "../components/AdminLayout.jsx";
import BulkActions from "../components/BulkActions.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";
import DataTable from "../components/DataTable.jsx";
import ListToolbar from "../components/ListToolbar.jsx";
import Loader from "../components/Loader.jsx";
import Pagination from "../components/Pagination.jsx";
import StatusSelect from "../components/StatusSelect.jsx";

const statuses = ["New", "Read", "In Progress", "Resolved", "Spam"];
const customerTypes = ["Owner", "Builder", "Architect", "Contractor", "Business", "Other"];

export default function Contacts() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");
  const [status, setStatus] = useState("");
  const [customerType, setCustomerType] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { data, isLoading } = useGetAdminContactsQuery({ page, limit: 10, search, sort, status, customerType });
  const [updateContact, { isLoading: isUpdating }] = useUpdateAdminContactMutation();
  const [deleteContact, { isLoading: isDeleting }] = useDeleteAdminContactMutation();

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
    await Promise.all(selectedIds.map((id) => deleteContact(id).unwrap()));
    setSelectedIds([]);
    setConfirmOpen(false);
  }

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "customerType", label: "Customer" },
    { key: "subject", label: "Subject" },
    { key: "message", label: "Message" },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <StatusSelect
          disabled={isUpdating}
          onChange={(status) => updateContact({ id: row._id, status })}
          options={statuses}
          value={row.status}
        />
      )
    },
    { key: "createdAt", label: "Created", render: (row) => new Date(row.createdAt).toLocaleString() }
  ];

  return (
    <AdminLayout title="Contact Entries">
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
            options: [{ label: "All statuses", value: "" }, ...statuses.map((value) => ({ label: value, value }))]
          },
          {
            name: "customerType",
            label: "Customer Type",
            value: customerType,
            onChange: (value) => {
              setCustomerType(value);
              setPage(1);
            },
            options: [{ label: "All customers", value: "" }, ...customerTypes.map((value) => ({ label: value, value }))]
          }
        ]}
        onReset={() => {
          setSearch("");
          setSort("latest");
          setStatus("");
          setCustomerType("");
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
      <BulkActions count={selectedIds.length} disabled={isDeleting} onDelete={() => setConfirmOpen(true)} />
      {isLoading ? (
        <Loader label="Loading contact entries..." />
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
        confirmText="Archive"
        message={`Archive ${selectedIds.length} selected contact entries?`}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleBulkDelete}
        open={confirmOpen}
        title="Confirm bulk archive"
      />
    </AdminLayout>
  );
}
