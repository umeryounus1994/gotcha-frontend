import { Box, Flex } from "@mantine/core";
import PageHeader from "../../components/general/PageHeader";
import DataGrid from "../../components/general/Table";
import { Columns } from "./TableHeader";
import { useMutation, useQuery } from "react-query";
import axios from "axios";
import { backendUrl } from "../../constants";
import { useState } from "react";
import toast from "react-hot-toast";
import AddFulfillmentPackageModal from "./AddFulfillmentPackageModal";

const FulfillmentPackages = () => {
  const [data, setData] = useState([]);

  const { status } = useQuery(
    ["fetchFulfillmentPackages"],
    async () => {
      return axios.get(backendUrl + "/fulfillment-packages");
    },
    {
      enabled: true,
      onSuccess: (res) => {
        const rows = res.data?.data || [];
        setData(rows);
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || "Failed to load packages");
      },
    }
  );

  // Placeholder for future status toggle if needed
  const onHandleStatus = useMutation(
    async () => Promise.resolve(),
    {
      onSuccess: () => {},
      onError: () => {},
    }
  );

  return (
    <Box bg="white" style={{ borderRadius: "5px" }}>
      <PageHeader
        title={"Fulfilment Packages"}
        subTitle={"Configure Rookie, Hustler, and Boss tiers"}
      />
      <Flex gap="xl" m="md">
        <AddFulfillmentPackageModal />
      </Flex>
      <Box p={"md"}>
        <DataGrid
          data={data}
          download={false}
          columns={Columns(onHandleStatus).filter((a) => a)}
          progressPending={status === "loading"}
        />
      </Box>
    </Box>
  );
};

export default FulfillmentPackages;

