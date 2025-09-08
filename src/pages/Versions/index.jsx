import { Box, Flex } from "@mantine/core";
import React, { useState } from "react";
import { useMutation, useQuery } from "react-query";
import axios from "axios";
import { backendUrl } from "../../constants";
import toast from "react-hot-toast";
import DataGrid from "../../components/general/Table";
import PageHeader from "../../components/general/PageHeader";
import { Columns } from "./TableHeader";
import AddVersionModal from "./AddVersionModal";

const Versions = () => {
  const [data, setData] = useState([]);
  const [advanced, setAdvanced] = useState(false);

  const { status } = useQuery(
    ["fetchVersions"],
    async () => {
      return axios.get(backendUrl + "/versions");
    },
    {
      enabled: true,
      onSuccess: (res) => {
        const data = res.data.data;
        setData(data);
      },
    }
  );

  const onHandleStatus = useMutation(
    async (values) => {
      return axios.patch(backendUrl + `/versions/change-status/${values.id}`, {
        status: values.status,
      });
    },
    {
      onSuccess: (response) => {
        toast.success(response.data.message);
      },
      onError: (err) => {
        toast.error(err.response.data.message);
      },
    }
  );

  return (
    <Box bg="white" style={{ borderRadius: "5px" }}>
      <PageHeader
        title={"Versions"}
        subTitle={"View all of your app versions"}
      />
      <Flex gap="xl" m="md">
        <AddVersionModal />
      </Flex>
      <Box p={"md"}>
        <DataGrid
          data={data}
          download={false}
          columns={Columns(onHandleStatus, advanced).filter((a) => a)}
          progressPending={status === "loading"}
        />
      </Box>
    </Box>
  );
};

export default Versions;