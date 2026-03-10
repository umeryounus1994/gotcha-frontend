import { Box, Flex, Select, Text } from "@mantine/core";
import PageHeader from "../../components/general/PageHeader";
import DataGrid from "../../components/general/Table";
import InputField from "../../components/general/InputField";
import Button from "../../components/general/Button";
import { useMutation, useQuery } from "react-query";
import axios from "axios";
import { backendUrl } from "../../constants";
import { useState } from "react";
import toast from "react-hot-toast";
import IDDetailsModal from "./IDDetailsModal";

const IDVerification = () => {
  const [data, setData] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const { status } = useQuery(
    ["fetchIdVerifications", statusFilter],
    async () => {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      return axios.get(backendUrl + "/id-verification", { params });
    },
    {
      enabled: true,
      onSuccess: (res) => {
        const rows = res.data?.data || [];
        setData(rows);
      },
      onError: (err) => {
        toast.error(
          err?.response?.data?.message || "Failed to load ID verifications"
        );
      },
    }
  );

  const filteredData = data.filter((row) => {
    if (!search) return true;
    const term = search.toLowerCase();
    const name = row?.UserId?.FullName?.toLowerCase() || "";
    const email = row?.UserId?.Email?.toLowerCase() || "";
    const address = row?.UserId?.Address?.toLowerCase() || "";
    return (
      name.includes(term) || email.includes(term) || address.includes(term)
    );
  });

  const openDetails = (row) => {
    setSelectedId(row._id);
    setDetailsOpen(true);
  };

  const columns = [
    {
      name: "Name",
      selector: (row) => row?.UserId?.FullName || "N/A",
      sortable: true,
      width: "220px",
    },
    {
      name: "Address",
      selector: (row) => row?.UserId?.Address || "N/A",
      sortable: true,
      width: "320px",
      cell: (row) => <span>{row?.UserId?.Address || "N/A"}</span>,
    },
    {
      name: "Status",
      selector: (row) => row.Status || "N/A",
      center: true,
      width: "160px",
    },
    {
      name: "Submitted",
      selector: (row) =>
        row.SubmittedAt ? new Date(row.SubmittedAt).toLocaleString() : "N/A",
      width: "200px",
    },
    {
      name: "Decision Date",
      selector: (row) =>
        row.ReviewedAt ? new Date(row.ReviewedAt).toLocaleString() : "N/A",
      width: "200px",
    },
    {
      name: "Decision",
      center: true,
      width: "160px",
      cell: (row) => (
        <Button
          label="Check ID"
          size="sm"
          onClick={() => openDetails(row)}
        />
      ),
    },
  ];

  return (
    <Box bg="white" style={{ borderRadius: "5px" }}>
      <PageHeader
        title={"ID Upload Admin Panel"}
        subTitle={"Review and approve player ID & address documents"}
      />
      <Flex gap="md" m="md" align="flex-end">
        <InputField
          label="Search"
          placeholder="Search by name, email, or address"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          label="Status"
          placeholder="All"
          data={[
            { label: "Submitted", value: "submitted" },
            { label: "Under review", value: "under_review" },
            { label: "Approved", value: "approved" },
            { label: "Not approved", value: "not_approved" },
          ]}
          value={statusFilter}
          onChange={setStatusFilter}
          clearable
        />
        <Button
          label="Clear"
          variant="outline"
          primary={false}
          onClick={() => {
            setSearch("");
            setStatusFilter("");
          }}
        />
      </Flex>
      <Box p={"md"}>
        <DataGrid
          data={filteredData}
          download={false}
          columns={columns}
          progressPending={status === "loading"}
        />
      </Box>
      <IDDetailsModal
        opened={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        recordId={selectedId}
      />
    </Box>
  );
};

export default IDVerification;

