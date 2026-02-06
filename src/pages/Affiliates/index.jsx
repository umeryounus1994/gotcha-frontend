import { Box, Flex } from "@mantine/core";
import PageHeader from "../../components/general/PageHeader";
import DataGrid from "../../components/general/Table";
import { Columns } from "./TableHeader";
import InputField from "../../components/general/InputField";
import Button from "../../components/general/Button";
import { useState } from "react";
import AddAffiliate from "./AddAffiliate";
import { backendUrl, internalApiKey } from "../../constants";
import axios from "axios";
import { useQuery } from "react-query";
import toast from "react-hot-toast";

function internalHeaders() {
  const h = { "Content-Type": "application/json" };
  if (internalApiKey) h["X-Internal-Api-Key"] = internalApiKey;
  return h;
}

const Affiliates = () => {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [search, setSearch] = useState("");

  const { data: listData, status } = useQuery(
    ["fetchAffiliates", search],
    () => {
      const params = new URLSearchParams({ limit: "50" });
      if (search) params.set("search", search);
      return axios.get(backendUrl + "/internal/affiliates?" + params.toString(), {
        headers: internalHeaders(),
      });
    },
    {
      onSuccess: (res) => {
        if (!res?.data?.success) toast.error(res?.data?.message || "Failed to fetch");
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || "Failed to fetch affiliates");
      },
    }
  );

  const data = listData?.data?.data ?? [];
  const filteredItems = data;

  return (
    <Box bg="white" style={{ borderRadius: "5px", overflow: "hidden" }}>
      <PageHeader
        title={"Register Affiliate"}
        subTitle={"View and manage affiliates. Affiliate URL and Tracking ID must be unique."}
      />
      <Flex gap="xl" m="md" align="center" wrap="wrap">
        <InputField
          placeholder={"Search by name or email..."}
          style={{ flex: 1, minWidth: "200px" }}
          leftIcon={"search"}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button primary={false} label={"Clear"} onClick={() => setSearch("")} />
        <Button
          label={"Register Affiliate"}
          onClick={() => {
            setEditData(null);
            setOpen(true);
          }}
        />
      </Flex>
      <Box px="md" pb="md">
        <DataGrid
          data={filteredItems}
          columns={Columns(setOpen, setEditData)}
          progressPending={status === "loading"}
          download={false}
        />
      </Box>
      <AddAffiliate
        open={open}
        setOpen={setOpen}
        editData={editData}
        setEditData={setEditData}
      />
    </Box>
  );
};

export default Affiliates;
