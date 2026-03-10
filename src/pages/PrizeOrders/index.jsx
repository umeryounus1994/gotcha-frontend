import { Box, Flex } from "@mantine/core";
import PageHeader from "../../components/general/PageHeader";
import DataGrid from "../../components/general/Table";
import InputField from "../../components/general/InputField";
import Button from "../../components/general/Button";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { backendUrl } from "../../constants";
import { useState } from "react";
import toast from "react-hot-toast";

const PrizeOrders = () => {
  const queryClient = useQueryClient();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const { status } = useQuery(
    ["fetchPrizeOrders", search],
    async () => {
      const params = {};
      if (search) params.search = search;
      return axios.get(backendUrl + "/prize-orders", { params });
    },
    {
      enabled: true,
      onSuccess: (res) => {
        const rows = res.data?.data || [];
        setData(rows);
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || "Failed to load prize orders");
      },
    }
  );

  const sendToShopifyMutation = useMutation(
    async (row) => {
      return axios.post(
        backendUrl + `/prize-orders/${row._id}/send-to-shopify`,
        {}
      );
    },
    {
      onSuccess: (res) => {
        toast.success(res.data?.message || "Order sent to Shopify");
        queryClient.invalidateQueries("fetchPrizeOrders");
      },
      onError: (err) => {
        toast.error(
          err?.response?.data?.message || "Failed to send order to Shopify"
        );
      },
    }
  );

  const columns = [
    {
      name: "Name",
      selector: (row) => row?.User?.FullName || "N/A",
      sortable: true,
      width: "220px",
    },
    {
      name: "Address",
      selector: (row) => row?.User?.Address || "N/A",
      sortable: true,
      width: "320px",
      cell: (row) => <span>{row?.User?.Address || "N/A"}</span>,
    },
    {
      name: "Status",
      selector: (row) => row.Status || "N/A",
      center: true,
      width: "140px",
    },
    {
      name: "Fulfilment",
      center: true,
      width: "220px",
      cell: (row) => (
        <Button
          label={
            row.ShopifyOrderId ? "Resend to Shopify" : "Send Order to Shopify"
          }
          size="sm"
          loading={sendToShopifyMutation.isLoading}
          onClick={() => sendToShopifyMutation.mutate(row)}
        />
      ),
    },
  ];

  return (
    <Box bg="white" style={{ borderRadius: "5px" }}>
      <PageHeader
        title={"Fulfilment Window"}
        subTitle={"Send prize orders to Shopify and monitor fulfilment"}
      />
      <Flex gap="md" m="md" align="flex-end">
        <InputField
          label="Search"
          placeholder="Search by name, email, or address"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          label="Clear"
          variant="outline"
          primary={false}
          onClick={() => setSearch("")}
        />
      </Flex>
      <Box p={"md"}>
        <DataGrid
          data={data}
          download={false}
          columns={columns}
          progressPending={status === "loading"}
        />
      </Box>
    </Box>
  );
};

export default PrizeOrders;

