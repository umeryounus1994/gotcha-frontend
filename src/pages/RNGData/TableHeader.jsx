import { Badge, Text } from "@mantine/core";

export const Columns = () => [
  {
    name: "Drop Date",
    selector: (row) => row.DropDate || row.Date || "N/A",
    sortable: true,
    width: "120px",
    cell: (row) => {
      const date = row.DropDate || row.Date;
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
    name: "Drop Time",
    selector: (row) => row.DropTime || "N/A",
    sortable: true,
    width: "100px",
    cell: (row) => {
      if (row.DropTime) return <Text>{row.DropTime}</Text>;
      if (row.DropDate || row.Date) {
        const date = new Date(row.DropDate || row.Date);
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
    selector: (row) => row.PrizeDescription || "N/A",
    sortable: true,
    width: "200px",
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
    name: "Lat",
    selector: (row) => row.Latitude || "N/A",
    sortable: true,
    center: true,
    width: "120px",
    cell: (row) => (
      <Text>{row.Latitude ? row.Latitude.toFixed(6) : "N/A"}</Text>
    ),
  },
  {
    name: "Long",
    selector: (row) => row.Longitude || "N/A",
    sortable: true,
    center: true,
    width: "120px",
    cell: (row) => (
      <Text>{row.Longitude ? row.Longitude.toFixed(6) : "N/A"}</Text>
    ),
  },
  {
    name: "RNG Seed",
    selector: (row) => row.RNGSeed || "N/A",
    sortable: true,
    width: "250px",
    cell: (row) => (
      <Text
        style={{
          fontFamily: "monospace",
          fontSize: "12px",
          wordBreak: "break-all",
        }}
      >
        {row.RNGSeed || "N/A"}
      </Text>
    ),
  },
];

