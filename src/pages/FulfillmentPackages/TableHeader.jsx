import { Badge, Text } from "@mantine/core";
import ActionIcons from "../../components/general/ActionIcons";
import AddFulfillmentPackageModal from "./AddFulfillmentPackageModal";

export const Columns = (onHandleStatus) => [
  {
    name: "Name",
    selector: (row) => row.Name,
    width: "160px",
    sortable: true,
  },
  {
    name: "Image",
    center: true,
    width: "80px",
    cell: (row) =>
      row.Image ? (
        <img
          src={row.Image}
          alt=""
          style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 4 }}
        />
      ) : (
        <Text size="sm" c="dimmed">
          —
        </Text>
      ),
  },
  {
    name: "Weekly Price",
    selector: (row) => row.SubscriptionPriceWeekly,
    sortable: true,
    width: "150px",
    cell: (row) => (
      <Text>
        {typeof row.SubscriptionPriceWeekly === "number"
          ? `$${row.SubscriptionPriceWeekly.toFixed(2)}`
          : row.SubscriptionPriceWeekly || "0"}
      </Text>
    ),
  },
  {
    name: "Secured Cap",
    selector: (row) => row.SecuredPrizesCap,
    sortable: true,
    center: true,
    width: "130px",
    cell: (row) => <Text>{row?.SecuredPrizesCap ?? "∞"}</Text>,
  },
  {
    name: "Processing (days)",
    selector: (row) => row.ProcessingWindowDays,
    sortable: true,
    center: true,
    width: "170px",
    cell: (row) => <Text>{row?.ProcessingWindowDays || "N/A"}</Text>,
  },
  {
    name: "Max shipped / week",
    selector: (row) => row.MaxShippedPerWeek,
    sortable: true,
    center: true,
    width: "190px",
    cell: (row) => <Text>{row?.MaxShippedPerWeek ?? "∞"}</Text>,
  },
  {
    name: "Insurance Max",
    selector: (row) => row.InsuranceAmount,
    sortable: true,
    center: true,
    width: "160px",
    cell: (row) => (
      <Text>
        {typeof row.InsuranceAmount === "number"
          ? `$${row.InsuranceAmount.toFixed(2)}`
          : row.InsuranceAmount || "$0"}
      </Text>
    ),
  },
  {
    name: "Min Paid Weeks (Boss)",
    selector: (row) => row.MinPaidWeeksForBoss,
    sortable: true,
    center: true,
    width: "200px",
    cell: (row) => <Text>{row?.MinPaidWeeksForBoss || 0}</Text>,
  },
  {
    name: "Status",
    selector: (row) => row.IsActive,
    center: true,
    width: "140px",
    cell: (row) => (
      <Badge bg={row.IsActive ? "green" : "red"}>
        {row.IsActive ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  {
    name: "Actions",
    center: true,
    width: "120px",
    cell: (row) => (
      <ActionIcons
        rowData={row}
        edit={<AddFulfillmentPackageModal edit={true} data={row} />}
        del={true}
        type="FulfillmentPackage"
      />
    ),
  },
];

