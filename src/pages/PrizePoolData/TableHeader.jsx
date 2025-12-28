import { Badge, Text, ActionIcon } from "@mantine/core";
import ActionIcons from "../../components/general/ActionIcons";
import EditPrizePoolDataModal from "./EditPrizePoolDataModal";
import MarkRewardedModal from "./MarkRewardedModal";

export const Columns = (queryClient, user) => [
  {
    name: "Date",
    selector: (row) => row.Date || row.CreationTimestamp || "N/A",
    sortable: true,
    width: "120px",
    cell: (row) => {
      const date = row.Date || row.CreationTimestamp;
      return (
        <Text>
          {date
            ? new Date(date).toLocaleDateString("en-AU", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            : "N/A"}
        </Text>
      );
    },
  },
  {
    name: "Time",
    selector: (row) => row.Time || "N/A",
    sortable: true,
    width: "100px",
    cell: (row) => {
      if (row.Time) return <Text>{row.Time}</Text>;
      if (row.Date || row.CreationTimestamp) {
        const date = new Date(row.Date || row.CreationTimestamp);
        const time = date.toLocaleTimeString("en-AU", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        return <Text>{time}</Text>;
      }
      return <Text>N/A</Text>;
    },
  },
  {
    name: "Prize ID",
    selector: (row) => row.PrizeId || "N/A",
    sortable: true,
    width: "120px",
  },
  {
    name: "Prize?",
    selector: (row) => row.PrizeDescription || row.Product || "N/A",
    sortable: true,
    width: "180px",
  },
  {
    name: "AUD",
    selector: (row) => row.Value || row.PrizeValue || 0,
    sortable: true,
    center: true,
    width: "120px",
    cell: (row) => (
      <Text fw={500}>${(row?.Value || row?.PrizeValue || 0).toLocaleString()}</Text>
    ),
  },
  {
    name: "From",
    selector: (row) => row.From || "N/A",
    sortable: true,
    width: "150px",
  },
  {
    name: "To",
    selector: (row) => row.To || "N/A",
    sortable: true,
    width: "150px",
  },
  {
    name: "Event Type",
    selector: (row) => row.EventType || "N/A",
    sortable: true,
    width: "180px",
    cell: (row) => {
      const eventType = row.EventType || "N/A";
      const colorMap = {
        Created: "blue",
        Claimed: "green",
        "24 Hour Timer Ended": "orange",
        Stolen: "red",
        Rewarded: "purple",
      };
      return (
        <Badge color={colorMap[eventType] || "gray"} variant="light">
          {eventType}
        </Badge>
      );
    },
  },
  {
    name: "Status",
    selector: (row) => row.Status || (row.IsActive ? "Active" : "Inactive"),
    center: true,
    width: "100px",
    cell: (row) => {
      const status = row.Status || (row.IsActive ? "Active" : "Inactive");
      return (
        <Badge bg={status === "Active" ? "green" : status === "Rewarded" ? "purple" : "red"}>
          {status}
        </Badge>
      );
    },
  },
  {
    name: "Notes",
    selector: (row) => row.Notes || "N/A",
    sortable: true,
    width: "200px",
  },
  {
    name: "User ID Verified?",
    selector: (row) => row.UserIdVerified,
    center: true,
    width: "150px",
    cell: (row) => (
      <Badge color={row.UserIdVerified ? "green" : "gray"}>
        {row.UserIdVerified ? "User Verified" : "User NOT Verified"}
      </Badge>
    ),
  },
  {
    name: "Promotional Period",
    selector: (row) => row.PromotionalPeriod || "N/A",
    sortable: true,
    width: "200px",
  },
  {
    name: "Actions",
    center: true,
    width: "150px",
    cell: (row) => (
      <ActionIcons
        rowData={row}
        edit={<EditPrizePoolDataModal data={row} />}
        type="PrizePoolData"
        view={
          row.EventType === "Claimed" ? (
            <MarkRewardedModal data={row} />
          ) : null
        }
      />
    ),
  },
];

