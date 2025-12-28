import { Box, Flex, Button, Text, Badge, Stack, Group } from "@mantine/core";
import PageHeader from "../../components/general/PageHeader";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { backendUrl } from "../../constants";
import { useContext, useState } from "react";
import { UserContext } from "../../context";
import toast from "react-hot-toast";

const GenerateDrop = () => {
  const { user } = useContext(UserContext);
  const queryClient = useQueryClient();
  const [lastGenerated, setLastGenerated] = useState(null);

  const { data: prizePoolData } = useQuery(
    ["fetchPrizePoolForDrop"],
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
          // Data is available
        }
      },
    }
  );

  const handleGenerateDrop = useMutation(
    async () => {
      return axios.post(
        backendUrl + "/rng-data/generate-drop",
        {},
        {
          headers: {
            authorization: `${user?.accessToken || ""}`,
          },
        }
      );
    },
    {
      onSuccess: (res) => {
        if (res.data.success) {
          toast.success(res.data.message || "Prize drop generated successfully!");
          setLastGenerated({
            prize: res.data.data?.prize,
            location: res.data.data?.rngData,
            timestamp: new Date(),
          });
          // Invalidate queries to refresh data
          queryClient.invalidateQueries("fetchPrizePoolForDrop");
          queryClient.invalidateQueries("fetchRNGData");
          queryClient.invalidateQueries("fetchPrizePoolData");
        } else {
          toast.error(res.data.message || "Failed to generate prize drop");
        }
      },
      onError: (err) => {
        toast.error(
          err.response?.data?.message ||
            "Failed to generate prize drop. Please try again."
        );
      },
    }
  );

  const availablePrizes = prizePoolData?.data?.data?.filter(
    (prize) => prize.IsActive && prize.DailyCounter < prize.MaxPerDay
  ) || [];

  const totalPrizes = prizePoolData?.data?.data?.length || 0;
  const activePrizes = prizePoolData?.data?.data?.filter(
    (p) => p.IsActive
  ).length || 0;

  return (
    <Box bg="white" style={{ borderRadius: "5px" }}>
      <PageHeader
        title={"Generate Prize Drop"}
        subTitle={"Use RNG to generate a random prize drop on the map"}
      />
      <Stack p="md" gap="lg">
        {/* Statistics */}
        <Group gap="md">
          <Box
            p="md"
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              flex: 1,
            }}
          >
            <Text size="sm" c="dimmed" mb={4}>
              Total Prizes in Pool
            </Text>
            <Text size="xl" fw={600}>
              {totalPrizes}
            </Text>
          </Box>
          <Box
            p="md"
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              flex: 1,
            }}
          >
            <Text size="sm" c="dimmed" mb={4}>
              Active Prizes
            </Text>
            <Text size="xl" fw={600} c="green">
              {activePrizes}
            </Text>
          </Box>
          <Box
            p="md"
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              flex: 1,
            }}
          >
            <Text size="sm" c="dimmed" mb={4}>
              Available for Drop
            </Text>
            <Text size="xl" fw={600} c="blue">
              {availablePrizes.length}
            </Text>
          </Box>
        </Group>

        {/* Warning if no prizes available */}
        {availablePrizes.length === 0 && (
          <Box
            p="md"
            style={{
              backgroundColor: "#fff3cd",
              border: "1px solid #ffc107",
              borderRadius: "8px",
            }}
          >
            <Text c="orange" fw={500}>
              ⚠️ No prizes available for drop. All active prizes have reached
              their daily limit or there are no active prizes in the pool.
            </Text>
          </Box>
        )}

        {/* Generate Button */}
        <Flex justify="center" gap="md">
          <Button
            onClick={() => handleGenerateDrop.mutate()}
            loading={handleGenerateDrop.isLoading}
            disabled={availablePrizes.length === 0}
            size="lg"
          >
            Generate Prize Drop
          </Button>
        </Flex>

        {/* Last Generated Info */}
        {lastGenerated && (
          <Box
            p="md"
            style={{
              backgroundColor: "#d4edda",
              border: "1px solid #28a745",
              borderRadius: "8px",
            }}
          >
            <Text fw={600} mb="sm" c="green">
              ✓ Last Prize Drop Generated Successfully
            </Text>
            <Stack gap="xs">
              <Text size="sm">
                <strong>Prize:</strong> {lastGenerated.prize?.PrizeDescription || "N/A"}
              </Text>
              <Text size="sm">
                <strong>Prize ID:</strong> {lastGenerated.prize?.PrizeId || "N/A"}
              </Text>
              <Text size="sm">
                <strong>Value:</strong> ${lastGenerated.prize?.PrizeValue?.toLocaleString() || 0} AUD
              </Text>
              {lastGenerated.location && (
                <>
                  <Text size="sm">
                    <strong>Location:</strong> Lat: {lastGenerated.location.Latitude?.toFixed(6)}, Lng: {lastGenerated.location.Longitude?.toFixed(6)}
                  </Text>
                  <Text size="sm">
                    <strong>RNG Seed:</strong> {lastGenerated.location.RNGSeed || "N/A"}
                  </Text>
                </>
              )}
              <Text size="sm" c="dimmed" mt="xs">
                Generated at: {lastGenerated.timestamp.toLocaleString()}
              </Text>
            </Stack>
          </Box>
        )}

        {/* Info Box */}
        <Box
          p="md"
          style={{
            backgroundColor: "#e7f3ff",
            border: "1px solid #2196F3",
            borderRadius: "8px",
          }}
        >
          <Text size="sm" c="blue">
            <strong>How it works:</strong> The system uses RNG (Random Number Generator) to
            select a prize from the active prize pool based on rarity weights. The prize is
            then placed at a random location on the map. Higher rarity values increase the
            chance of selection. Daily limits are automatically enforced.
          </Text>
        </Box>
      </Stack>
    </Box>
  );
};

export default GenerateDrop;

