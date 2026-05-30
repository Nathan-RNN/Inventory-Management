"use client";

import { useState, useMemo } from "react";
import {
  Table,
  Card,
  Input,
  DatePicker,
  Tag,
  Button,
  Statistic,
  Skeleton,
  Empty,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  SearchOutlined,
  EyeOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { useSales } from "@/hooks";
import { Sale } from "@/types";
import {
  formatPrice,
  formatDate,
  getStatusColor,
  getStatusLabel,
} from "@/utils";
import { SaleDetailDrawer } from "./SaleDetailDrawer";

const { RangePicker } = DatePicker;

export function HistoryTable() {
  const { data: sales, isLoading } = useSales();

  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<
    [Dayjs | null, Dayjs | null] | null
  >(null);

  const filteredSales = useMemo(() => {
    if (!sales) return [];

    return sales.filter((sale) => {
      // Search filter
      const matchesSearch =
        search === "" ||
        sale.items.some((item) =>
          item.productName.toLowerCase().includes(search.toLowerCase()),
        ) ||
        sale.id.includes(search);

      // Date filter
      let matchesDate = true;
      if (dateRange && dateRange[0] && dateRange[1]) {
        const saleDate = dayjs(sale.date);
        matchesDate =
          saleDate.isAfter(dateRange[0].startOf("day")) &&
          saleDate.isBefore(dateRange[1].endOf("day"));
      }

      return matchesSearch && matchesDate;
    });
  }, [sales, search, dateRange]);

  // Calculate today's total
  const today = new Date().toISOString().split("T")[0];
  const todayTotal = useMemo(() => {
    if (!sales) return 0;
    return sales
      .filter((s) => s.date.startsWith(today) && s.status === "completed")
      .reduce((sum, s) => sum + s.total, 0);
  }, [sales, today]);

  // Calculate filtered total
  const filteredTotal = useMemo(() => {
    return filteredSales
      .filter((s) => s.status === "completed")
      .reduce((sum, s) => sum + s.total, 0);
  }, [filteredSales]);

  const handleViewSale = (sale: Sale) => {
    setSelectedSale(sale);
    setDrawerOpen(true);
  };

  const columns: ColumnsType<Sale> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      render: (id: string) => `#${id}`,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      defaultSortOrder: "ascend",
      render: (date: string) => (
        <div>
          <div className="font-medium">{formatDate(date)}</div>
          <div className="text-xs text-muted">
            {dayjs(date).format("HH:mm")}
          </div>
        </div>
      ),
    },
    {
      title: "Articles",
      dataIndex: "items",
      key: "items",
      render: (items: Sale["items"]) => (
        <div>
          <div>{items.length} produit(s)</div>
          <div className="text-xs text-muted">
            {items.reduce((sum, item) => sum + item.quantity, 0)} unité(s)
          </div>
        </div>
      ),
      responsive: ["md"],
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      sorter: (a, b) => a.total - b.total,
      render: (total: number) => (
        <span className="font-semibold text-primary">{formatPrice(total)}</span>
      ),
    },
    {
      title: "Statut",
      dataIndex: "status",
      key: "status",
      render: (status: Sale["status"]) => (
        <Tag color={getStatusColor(status)}>{getStatusLabel(status)}</Tag>
      ),
      responsive: ["sm"],
    },
    {
      title: "Actions",
      key: "actions",
      width: 80,
      render: (_: unknown, record: Sale) => (
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={() => handleViewSale(record)}
        >
          <span className="hidden sm:inline">Détails</span>
        </Button>
      ),
    },
  ];

  if (isLoading) {
    return (
      <Card>
        <Skeleton active paragraph={{ rows: 8 }} />
      </Card>
    );
  }

  return (
    <>
      {/* Stats Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <Statistic
            title="Total du jour"
            value={todayTotal}
            formatter={(val) => formatPrice(Number(val))}
            styles={{
              content: { color: "#1677ff", fontWeight: 600 },
            }}
            prefix={<CalendarOutlined />}
          />
        </Card>
        <Card>
          <Statistic
            title="Total affiché"
            value={filteredTotal}
            formatter={(val) => formatPrice(Number(val))}
            styles={{ content: { color: "#52c41a", fontWeight: 600 } }}
          />
        </Card>
        <Card className="sm:col-span-2 lg:col-span-1">
          <Statistic
            title="Nombre de ventes"
            value={filteredSales.length}
            suffix={`/ ${sales?.length || 0}`}
          />
        </Card>
      </div>

      {/* Table */}
      <Card>
        {/* Filters */}
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Input
            placeholder="Rechercher par produit ou ID..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64"
            allowClear
          />
          <RangePicker
            value={dateRange}
            onChange={(dates) => setDateRange(dates)}
            placeholder={["Date début", "Date fin"]}
            className="w-full sm:w-auto"
            format="DD/MM/YYYY"
          />
          {(search || dateRange) && (
            <Button
              type="link"
              onClick={() => {
                setSearch("");
                setDateRange(null);
              }}
            >
              Réinitialiser
            </Button>
          )}
        </div>

        {/* Table */}
        {filteredSales.length === 0 ? (
          <Empty description="Aucune vente trouvée" />
        ) : (
          <Table
            dataSource={filteredSales}
            columns={columns}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `${total} vente(s)`,
            }}
            scroll={{ x: 600 }}
          />
        )}
      </Card>

      {/* Detail Drawer */}
      <SaleDetailDrawer
        sale={selectedSale}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedSale(null);
        }}
      />
    </>
  );
}
