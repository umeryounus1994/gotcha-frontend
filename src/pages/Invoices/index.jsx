import { Box, Flex } from "@mantine/core";
import PageHeader from "../../components/general/PageHeader";
import DataGrid from "../../components/general/Table";
import SelectMenu from "../../components/general/SelectMenu";
import { useQuery } from "react-query";
import axios from "axios";
import { backendUrl } from "../../constants";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const Invoices = () => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    if (!selectedUserId) setInvoices([]);
  }, [selectedUserId]);

  const { data: usersList = [], status: usersStatus } = useQuery(
    ["fetchAllUsers"],
    async () => {
      const res = await axios.get(backendUrl + "/users/list-all-users");
      return res.data?.data || [];
    },
    { enabled: true }
  );

  const userOptions = (usersList || []).map((u) => ({
    value: u._id || u.Id,
    label: `${u.FullName || u.Email || "—"} (${u.Email || "—"})`,
  }));

  const { status: invoicesStatus } = useQuery(
    ["fetchInvoices", selectedUserId],
    async () => {
      const res = await axios.get(backendUrl + "/users/invoices", {
        params: { userId: selectedUserId },
      });
      return res.data;
    },
    {
      enabled: !!selectedUserId,
      onSuccess: (res) => {
        setInvoices(res?.data || []);
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || "Failed to load invoices");
        setInvoices([]);
      },
    }
  );

  const columns = [
    {
      name: "#",
      selector: (_, i) => i + 1,
      width: "60px",
      center: true,
    },
    {
      name: "Amount",
      selector: (row) => {
        const amt = row.amount ?? row.amount_money?.amount ?? row.total;
        if (amt != null) return typeof amt === "number" ? `$${(amt / 100).toFixed(2)}` : String(amt);
        return "—";
      },
      width: "120px",
    },
    {
      name: "Receipt",
      width: "200px",
      cell: (row) => {
        const url = row.receipt_url ?? row.receiptUrl ?? row.url;
        if (url)
          return (
            <a href={url} target="_blank" rel="noopener noreferrer">
              View receipt
            </a>
          );
        return "—";
      },
    },
    {
      name: "Date",
      selector: (row) => {
        const d = row.created_at ?? row.createdAt ?? row.date ?? row.paid_at;
        if (d) return new Date(d).toLocaleString();
        return "—";
      },
      width: "180px",
    },
    {
      name: "Id",
      selector: (row) => row.id ?? row.payment_id ?? row.transaction_id ?? "—",
      width: "200px",
    },
  ];

  return (
    <Box bg="white" style={{ borderRadius: "5px" }}>
      <PageHeader
        title={"Invoices"}
        subTitle={"View payment invoices for a user"}
      />
      <Flex gap="md" m="md" align="flex-end" wrap="wrap">
        <SelectMenu
          label="Select user"
          placeholder="Choose a user"
          data={userOptions}
          value={selectedUserId}
          onChange={setSelectedUserId}
          clearable
          searchable
          width={320}
        />
      </Flex>
      <Box p="md">
        {selectedUserId && (
          <DataGrid
            data={invoices}
            columns={columns}
            download={false}
            progressPending={invoicesStatus === "loading"}
          />
        )}
        {!selectedUserId && (
          <Box c="dimmed" py="xl" ta="center">
            Select a user to view their invoices.
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Invoices;
