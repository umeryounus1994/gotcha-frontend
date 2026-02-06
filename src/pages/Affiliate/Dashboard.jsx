import { Box, Tabs, Text, Title, Anchor } from "@mantine/core";
import PageHeader from "../../components/general/PageHeader";
import { useContext, useState } from "react";
import { AffiliateContext } from "../../context/AffiliateContext";
import { useQuery } from "react-query";
import axios from "axios";
import { backendUrl } from "../../constants";
import { Loader } from "@mantine/core";

const AffiliateDashboard = () => {
  const { affiliate } = useContext(AffiliateContext);
  const [period, setPeriod] = useState("7d");

  const { data: dashboardData, status } = useQuery(
    ["affiliateDashboard", period],
    () => {
      return axios.get(backendUrl + "/affiliates/dashboard", {
        params: { period },
        headers: {
          Authorization: `Bearer ${affiliate?.token}`,
        },
      });
    },
    {
      enabled: !!affiliate?.token,
      onSuccess: (res) => {},
      onError: (err) => {},
    }
  );

  const data = dashboardData?.data?.data;
  const totalSales = data?.totalSalesVolumeAUD ?? 0;
  const dailyBreakdown = data?.dailyBreakdown ?? [];
  const payoutsUrl = data?.affiliate?.PayoutsDriveUrl || affiliate?.PayoutsDriveUrl || "#";

  if (status === "loading") {
    return (
      <Box p="xl" ta="center">
        <Loader />
      </Box>
    );
  }

  return (
    <Box bg="white" style={{ borderRadius: "5px" }}>
      <PageHeader
        title={"Affiliate Sales Dashboard"}
        subTitle={"User: " + (affiliate?.FullName || affiliate?.Email)}
      />
      <Box p="md">
        <Tabs value={period} onChange={(v) => setPeriod(v || "7d")} defaultValue="7d">
          <Tabs.List>
            <Tabs.Tab value="today">Today</Tabs.Tab>
            <Tabs.Tab value="7d">7 Days</Tabs.Tab>
            <Tabs.Tab value="14d">14 Days</Tabs.Tab>
            <Tabs.Tab value="30d">30 Days</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value={period} pt="md">
            <Box mb="md">
              <Text size="sm" c="dimmed" mb={4}>
                Combined Earnings
              </Text>
              <Title order={3}>
                Total Sales Volume (AUD): ${Number(totalSales).toFixed(2)}
              </Title>
            </Box>
            {dailyBreakdown.length > 0 ? (
              <Box
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: 8,
                  height: 200,
                  padding: 16,
                  background: "#fafafa",
                  borderRadius: 8,
                }}
              >
                {dailyBreakdown.map((d, i) => {
                  const maxVal = Math.max(
                    ...dailyBreakdown.map((x) => x.salesAUD || 0),
                    1
                  );
                  const heightPct = ((d.salesAUD || 0) / maxVal) * 100;
                  return (
                    <Box
                      key={d.date || i}
                      style={{
                        flex: 1,
                        minWidth: 24,
                        height: `${heightPct}%`,
                        minHeight: 4,
                        background: "#1b8eb7",
                        borderRadius: "4px 4px 0 0",
                      }}
                      title={`${d.date}: $${(d.salesAUD || 0).toFixed(2)}`}
                    />
                  );
                })}
              </Box>
            ) : (
              <Text c="dimmed" size="sm">
                No data for this period
              </Text>
            )}

            <Box mt="xl">
              <Text fw={500} mb="xs">
                Payouts / Creatives
              </Text>
              <Text size="sm" c="dimmed" mb="xs">
                Use this section to manage payouts and submit creative assets for
                approval.
              </Text>
              <Anchor
                href={payoutsUrl}
                target="_blank"
                rel="noopener"
                size="sm"
              >
                {payoutsUrl && payoutsUrl !== "#"
                  ? "Google Drive Link (Payouts/Creatives)"
                  : "Payouts/Creatives (link not set)"}
              </Anchor>
            </Box>
          </Tabs.Panel>
        </Tabs>
      </Box>
    </Box>
  );
};

export default AffiliateDashboard;
