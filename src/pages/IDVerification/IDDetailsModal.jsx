import { Modal, Image, SimpleGrid, Stack, Text, Group } from "@mantine/core";
import Button from "../../components/general/Button";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { backendUrl } from "../../constants";
import toast from "react-hot-toast";

const IDDetailsModal = ({ opened, onClose, recordId }) => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(
    ["fetchIdVerificationDetails", recordId],
    async () => {
      if (!recordId) return null;
      return axios.get(backendUrl + `/id-verification/${recordId}`);
    },
    {
      enabled: opened && !!recordId,
      select: (res) => res.data?.data || null,
    }
  );

  const decisionMutation = useMutation(
    async ({ decision }) => {
      return axios.post(
        backendUrl + `/id-verification/${recordId}/decision`,
        {
          decision,
        }
      );
    },
    {
      onSuccess: (res) => {
        toast.success(res.data?.message || "Decision saved");
        queryClient.invalidateQueries("fetchIdVerifications");
        onClose();
      },
      onError: (err) => {
        toast.error(
          err?.response?.data?.message || "Failed to save decision"
        );
      },
    }
  );

  const record = data;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="ID Verification Details"
      size="xl"
      centered
    >
      {isLoading && <Text>Loading...</Text>}
      {!isLoading && record && (
        <Stack gap="md">
          <Text fw={500}>
            {record?.UserId?.FullName} ({record?.UserId?.Email})
          </Text>
          <Text size="sm" c="dimmed">
            Address: {record?.UserId?.Address || "N/A"}
          </Text>
          <SimpleGrid cols={2} spacing="md">
            {record.IdFrontUrl && (
              <div>
                <Text size="sm" fw={500} mb={4}>
                  ID Front
                </Text>
                <Image src={record.IdFrontUrl} alt="ID Front" radius="md" />
              </div>
            )}
            {record.IdBackUrl && (
              <div>
                <Text size="sm" fw={500} mb={4}>
                  ID Back
                </Text>
                <Image src={record.IdBackUrl} alt="ID Back" radius="md" />
              </div>
            )}
            {record.SelfieUrl && (
              <div>
                <Text size="sm" fw={500} mb={4}>
                  Selfie with ID
                </Text>
                <Image src={record.SelfieUrl} alt="Selfie" radius="md" />
              </div>
            )}
            {record.AddressDocUrl && (
              <div>
                <Text size="sm" fw={500} mb={4}>
                  Address Document
                </Text>
                <Image
                  src={record.AddressDocUrl}
                  alt="Address Document"
                  radius="md"
                />
              </div>
            )}
          </SimpleGrid>
          <Group justify="flex-end" mt="md" gap="md">
            <Button
              label="Not Approved"
              primary={false}
              onClick={() => decisionMutation.mutate({ decision: "not_approved" })}
              loading={decisionMutation.isLoading}
            />
            <Button
              label="Approve"
              onClick={() => decisionMutation.mutate({ decision: "approved" })}
              loading={decisionMutation.isLoading}
            />
          </Group>
        </Stack>
      )}
    </Modal>
  );
};

export default IDDetailsModal;

