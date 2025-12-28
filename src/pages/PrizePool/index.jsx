import { Box, Flex, Text, Badge } from "@mantine/core";
import PageHeader from "../../components/general/PageHeader";
import DataGrid from "../../components/general/Table";
import { Columns } from "./TableHeader";
import Button from "../../components/general/Button";
import { useQuery } from "react-query";
import axios from "axios";
import { backendUrl } from "../../constants";
import { useState } from "react";
import AddPrizeModal from "./AddPrizeModal";
import { useContext } from "react";
import { UserContext } from "../../context";

const PrizePool = () => {
  const { user } = useContext(UserContext);
  const [data, setData] = useState([]);
  const [totalValue, setTotalValue] = useState(0);

  const { status } = useQuery(
    ["fetchPrizePool"],
    async () => {
      return axios.get(backendUrl + "/main-prize-pool", {
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
          setTotalValue(res.data.totalPrizePoolValue || 0);
        }
      },
    }
  );

  return (
    <Box bg="white" style={{ borderRadius: "5px" }}>
      <PageHeader
        title={"Main Prize Pool"}
        subTitle={"Manage prizes for RNG prize drops"}
      />
      <Flex gap="xl" m="md" justify="space-between" align="center">
        <AddPrizeModal />
        <Box>
          <Text size="sm" c="dimmed" mb={4}>
            Total Prize Pool Value
          </Text>
          <Badge size="lg" color="blue" variant="light">
            ${totalValue.toLocaleString()} AUD
          </Badge>
        </Box>
      </Flex>
      <Box p={"md"}>
        <DataGrid
          data={data}
          download={false}
          columns={Columns()}
          progressPending={status === "loading"}
        />
      </Box>
    </Box>
  );
};

export default PrizePool;

