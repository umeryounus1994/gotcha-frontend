import { Box, Tabs, Text } from "@mantine/core";
import PageHeader from "../../components/general/PageHeader";
import PrizePoolData from "./PrizePoolData";
import RNGData from "./RNGData";

const RegulatorDashboard = () => {
  return (
    <Box bg="white" style={{ borderRadius: "5px" }}>
      <PageHeader
        title={"Regulator Dashboard"}
        subTitle={"View compliance data (Read-Only)"}
      />
      <Box p="md">
        <Tabs defaultValue="prize-pool">
          <Tabs.List>
            <Tabs.Tab value="prize-pool">Prize Pool Data</Tabs.Tab>
            <Tabs.Tab value="rng-data">RNG Data</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="prize-pool" pt="md">
            <PrizePoolData />
          </Tabs.Panel>

          <Tabs.Panel value="rng-data" pt="md">
            <RNGData />
          </Tabs.Panel>
        </Tabs>
      </Box>
    </Box>
  );
};

export default RegulatorDashboard;

