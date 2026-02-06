import { Box, Flex, Text } from "@mantine/core";
import PageHeader from "../../components/general/PageHeader";
import DataGrid from "../../components/general/Table";
import InputField from "../../components/general/InputField";
import Button from "../../components/general/Button";
import { useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { backendUrl, internalApiKey } from "../../constants";
import toast from "react-hot-toast";

function internalHeaders() {
  const h = {};
  if (internalApiKey) h["X-Internal-Api-Key"] = internalApiKey;
  return h;
}

const columns = [
  {
    name: "Full Name",
    selector: (row) => row.fullName,
    width: "200px",
    sortable: true,
  },
  {
    name: "Email",
    selector: (row) => row.email,
    sortable: true,
    width: "250px",
  },
  {
    name: "Sales (AUD)",
    selector: (row) => row.salesAUD,
    center: true,
    width: "140px",
    cell: (row) => (
      <Text fw={500}>${Number(row.salesAUD || 0).toFixed(2)}</Text>
    ),
  },
  {
    name: "Users",
    selector: (row) => row.users,
    center: true,
    width: "100px",
    cell: (row) => <Text>{row.users ?? 0}</Text>,
  },
];

const AffiliateSales = () => {
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const params = new URLSearchParams({ page: "1", limit: "50" });
  if (search) params.set("search", search);
  if (startDate) params.set("startDate", startDate);
  if (endDate) params.set("endDate", endDate);

  const { data: salesData, status } = useQuery(
    ["fetchAffiliateSales", search, startDate, endDate],
    () => {
      return axios.get(backendUrl + "/internal/affiliates/sales?" + params.toString(), {
        headers: internalHeaders(),
      });
    },
    {
      onSuccess: (res) => {
        if (!res?.data?.success) toast.error(res?.data?.message || "Failed to fetch");
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || "Failed to fetch sales");
      },
    }
  );

  const data = salesData?.data?.data ?? [];
  const total = salesData?.data?.total ?? 0;

  const clearFilters = () => {
    setSearch("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <Box bg="white" style={{ borderRadius: "5px" }}>
      <PageHeader
        title={"Tracking Affiliate Sales"}
        subTitle={"Affiliate Sales – This page is internal, not for affiliates to see."}
      />
      <Flex gap="xl" m="md" align="flex-end" wrap="wrap">
        <InputField
          placeholder={"Search by name or email..."}
          style={{ flex: 1, minWidth: "200px" }}
          leftIcon={"search"}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={{
            padding: "8px 12px",
            borderRadius: 4,
            border: "1px solid #ced4da",
          }}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={{
            padding: "8px 12px",
            borderRadius: 4,
            border: "1px solid #ced4da",
          }}
        />
        <Button primary={false} label={"Clear"} onClick={clearFilters} />
        <Button label={"Apply"} onClick={() => {}} />
      </Flex>
      <Box p="md">
        <DataGrid
          data={data}
          columns={columns}
          progressPending={status === "loading"}
          download={false}
        />
        <Text size="sm" c="dimmed" mt="sm">
          {data.length} of {total} record(s)
        </Text>
      </Box>
    </Box>
  );
};

export default AffiliateSales;
