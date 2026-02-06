import { Badge, Text, ActionIcon, Tooltip, Flex } from "@mantine/core";
import { Pencil, Trash2 } from "lucide-react";
import DeleteModal from "../../components/general/DeleteModal";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { backendUrl, internalApiKey } from "../../constants";
import toast from "react-hot-toast";

function internalHeaders() {
  const h = { "Content-Type": "application/json" };
  if (internalApiKey) h["X-Internal-Api-Key"] = internalApiKey;
  return h;
}

const EditAffiliateCell = ({ row, setOpen, setEditData }) => (
  <Tooltip label="Edit">
    <ActionIcon
      bg="white"
      onClick={() => {
        setEditData(row);
        setOpen(true);
      }}
    >
      <Pencil stroke="gray" size={16} />
    </ActionIcon>
  </Tooltip>
);

const DeleteAffiliateCell = ({ row }) => {
  const queryClient = useQueryClient();
  const [openDelete, setOpenDelete] = useState(false);

  const handleDelete = useMutation(
    async () => {
      return axios.post(
        backendUrl + "/internal/affiliates/delete",
        { Id: row._id },
        { headers: internalHeaders() }
      );
    },
    {
      onSuccess: (res) => {
        if (res?.data?.success) {
          toast.success(res.data.message);
          setOpenDelete(false);
          queryClient.invalidateQueries("fetchAffiliates");
        } else {
          toast.error(res?.data?.message || "Delete failed");
        }
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || "Delete failed");
        setOpenDelete(false);
      },
    }
  );

  return (
    <>
      <Tooltip label="Delete">
        <ActionIcon bg="white" onClick={() => setOpenDelete(true)}>
          <Trash2 stroke="gray" size={16} />
        </ActionIcon>
      </Tooltip>
      <DeleteModal
        label="Delete Affiliate"
        message="Are you sure you want to delete this affiliate? This action cannot be undone."
        opened={openDelete}
        onDelete={() => handleDelete.mutate()}
        setOpened={setOpenDelete}
        loading={handleDelete.isLoading}
      />
    </>
  );
};

export const Columns = (setOpen, setEditData) => [
  {
    name: "Full Name",
    selector: (row) => row.FullName,
    width: "180px",
    sortable: true,
  },
  {
    name: "Email",
    selector: (row) => row.Email,
    sortable: true,
    width: "220px",
  },
  {
    name: "Affiliate URL",
    selector: (row) => row.AffiliateURL,
    width: "200px",
    cell: (row) => (
      <Text lineClamp={2} title={row.AffiliateURL}>
        {row.AffiliateURL || "N/A"}
      </Text>
    ),
  },
  {
    name: "Registration Date",
    selector: (row) => row.RegistrationDate || row.CreationTimestamp,
    width: "140px",
    cell: (row) => (
      <Text>
        {row.RegistrationDate || row.CreationTimestamp
          ? new Date(row.RegistrationDate || row.CreationTimestamp).toLocaleDateString()
          : "N/A"}
      </Text>
    ),
  },
  {
    name: "Status",
    selector: (row) => row.Status,
    center: true,
    width: "100px",
    cell: (row) => (
      <Badge color={row.Status === "ACTIVE" ? "green" : "red"} variant="light">
        {row.Status || "N/A"}
      </Badge>
    ),
  },
  {
    name: "Tracking ID",
    selector: (row) => row.TrackingID,
    center: true,
    width: "120px",
  },
  {
    name: "Actions",
    center: true,
    width: "100px",
    cell: (row) => (
      <Flex gap="xs">
        <EditAffiliateCell row={row} setOpen={setOpen} setEditData={setEditData} />
        <DeleteAffiliateCell row={row} />
      </Flex>
    ),
  },
];
