import { Box, Flex } from "@mantine/core";
import PageHeader from "../../components/general/PageHeader";
import DataGrid from "../../components/general/Table";
import { Columns } from "./TableHeader";
import InputField from "../../components/general/InputField";
import Button from "../../components/general/Button";
import { useQuery } from "react-query";
import axios from "axios";
import { backendUrl } from "../../constants";
import { useState, useContext } from "react";
import toast from "react-hot-toast";
import RegisterRegulator from "../Regulator/Register";
import { UserContext } from "../../context";

const Regulators = () => {
  const { user } = useContext(UserContext);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const { status } = useQuery(
    ["fetchRegulators"],
    async () => {
      return axios.get(backendUrl + "/regulator", {
        headers: {
          authorization: `${user?.accessToken || ""}`,
        },
      });
    },
    {
      enabled: true,
      onSuccess: (res) => {
        if (res.data.success) {
          setData(res.data.data || []);
        } else {
          toast.error(res.data.message || "Failed to fetch regulators");
        }
      },
      onError: (err) => {
        // If endpoint doesn't exist, show empty list
        if (err.response?.status === 404) {
          toast.error("Regulators list endpoint not found");
          setData([]);
        } else {
          toast.error(err.response?.data?.message || "Failed to fetch regulators");
        }
      },
    }
  );

  const filteredItems = data.filter((item) => {
    return (
      (item?.FullName?.toLowerCase().includes(search.toLowerCase()) ||
        item?.Email?.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <Box bg="white" style={{ borderRadius: "5px" }}>
      <PageHeader
        title={"Regulators"}
        subTitle={"View and manage all registered regulators"}
      />
      <Flex gap="xl" m="md" align="center" wrap="wrap">
        <InputField
          placeholder={"Search by name or email..."}
          style={{ flex: 1, minWidth: "200px" }}
          leftIcon={"search"}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          primary={false}
          label={"Clear"}
          onClick={() => setSearch("")}
        />
        <RegisterRegulator />
      </Flex>
      <Box p={"md"}>
        <DataGrid
          data={filteredItems}
          download={false}
          columns={Columns()}
          progressPending={status === "loading"}
        />
      </Box>
    </Box>
  );
};

export default Regulators;

