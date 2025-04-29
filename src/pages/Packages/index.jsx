import { Box, Flex } from "@mantine/core";
import PageHeader from "../../components/general/PageHeader";
import DataGrid from "../../components/general/Table";
import { Columns } from "./TableHeader";
import InputField from "../../components/general/InputField";
import Button from "../../components/general/Button";
import { useMutation, useQuery } from "react-query";
import axios from "axios";
import { backendUrl } from "../../constants";
import { useState } from "react";
import toast from "react-hot-toast";
import AddPackageModal from "./AddPackageModal";

const Users = () => {
  const [data, setData] = useState([]);
  const [advanced, setAdvanced] = useState(false);

  const { status } = useQuery(
    ["fetchPackages"],
    async () => {

      // Make API call
      return axios.get(backendUrl + "/packages");
    },
    {
      // Only run the query if there is no start and end date or if at least one is provided
      enabled: true,
      onSuccess: (res) => {
        const data = res.data.data;
        setData(data);
      },
    }
  );

  const onHandleStatus = useMutation(
    async (values) => {
      return axios.patch(backendUrl + `/users/change-status/${values.id}`, {
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
        title={"Packages"}
        subTitle={"View all of your packages"}
      />
          <Flex gap="xl" m="md">
     
        <AddPackageModal />
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

export default Users;
