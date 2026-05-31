'use client';

import { useState, useMemo } from 'react';
import {
  Table,
  Card,
  Input,
  DatePicker,
  Button,
  Statistic,
  Skeleton,
  Empty,
  Select,
  Tag,
  List,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, PlusOutlined, ExportOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { useInternalUsages, useInternalUsageStats } from '@/hooks';
import { InternalUsage, InternalUsageReason } from '@/types';
import {
  formatDate,
  formatDateTime,
  getInternalUsageReasonLabel,
  getInternalUsageReasonColor,
} from '@/utils';
import { CreateInternalUsageModal } from './CreateInternalUsageModal';

const { RangePicker } = DatePicker;

const MOTIF_OPTIONS: { value: InternalUsageReason | 'all'; label: string }[] = [
  { value: 'all', label: 'Tous les motifs' },
  { value: 'usage_maison', label: 'Usage maison' },
  { value: 'cadeau_client', label: 'Cadeau client' },
  { value: 'produit_casse', label: 'Produit cassé' },
  { value: 'perte', label: 'Perte' },
  { value: 'echantillon', label: 'Échantillon' },
  { value: 'autre', label: 'Autre' },
];

export function InternalUsageTable() {
  const { data: usages, isLoading } = useInternalUsages();
  const { data: stats, isLoading: statsLoading } = useInternalUsageStats();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [motifFilter, setMotifFilter] = useState<InternalUsageReason | 'all'>('all');
  const [dateRange, setDateRange] = useState<
    [Dayjs | null, Dayjs | null] | null
  >(null);

  const filteredUsages = useMemo(() => {
    if (!usages) return [];

    return usages.filter((usage) => {
      const matchesSearch =
        search === '' ||
        usage.productName.toLowerCase().includes(search.toLowerCase()) ||
        usage.responsable.toLowerCase().includes(search.toLowerCase()) ||
        usage.id.includes(search);

      const matchesMotif = motifFilter === 'all' || usage.motif === motifFilter;

      let matchesDate = true;
      if (dateRange?.[0] && dateRange[1]) {
        const usageDate = dayjs(usage.createdAt);
        matchesDate =
          usageDate.isAfter(dateRange[0].startOf('day')) &&
          usageDate.isBefore(dateRange[1].endOf('day'));
      }

      return matchesSearch && matchesMotif && matchesDate;
    });
  }, [usages, search, motifFilter, dateRange]);

  const columns: ColumnsType<InternalUsage> = [
    {
      title: 'Produit',
      dataIndex: 'productName',
      key: 'productName',
      render: (name: string) => <span className="font-medium">{name}</span>,
    },
    {
      title: 'Quantité',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 90,
      align: 'center',
    },
    {
      title: 'Motif',
      dataIndex: 'motif',
      key: 'motif',
      render: (motif: InternalUsageReason) => (
        <Tag color={getInternalUsageReasonColor(motif)}>
          {getInternalUsageReasonLabel(motif)}
        </Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      defaultSortOrder: 'descend',
      render: (date: string) => (
        <div>
          <div>{formatDate(date)}</div>
          <div className="text-xs text-muted">{dayjs(date).format('HH:mm')}</div>
        </div>
      ),
      responsive: ['md'],
    },
    {
      title: 'Responsable',
      dataIndex: 'responsable',
      key: 'responsable',
      responsive: ['sm'],
    },
    {
      title: 'Note',
      dataIndex: 'note',
      key: 'note',
      render: (note?: string) => note || '—',
      responsive: ['lg'],
      ellipsis: true,
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
      <div className="mb-4 flex justify-end">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => setCreateModalOpen(true)}
        >
          Nouvelle sortie
        </Button>
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <Card>
          <Statistic
            title="Quantité totale sortie"
            value={stats?.totalQuantitySortie ?? 0}
            loading={statsLoading}
            prefix={<ExportOutlined />}
            styles={{ content: { color: '#1677ff', fontWeight: 600 } }}
          />
        </Card>
        <Card>
          <Statistic
            title="Pertes du mois"
            value={stats?.pertesDuMois ?? 0}
            suffix="unité(s)"
            loading={statsLoading}
            styles={{ content: { color: '#ff4d4f', fontWeight: 600 } }}
          />
        </Card>
        <Card title="Produits les plus utilisés" loading={statsLoading}>
          {stats?.topProducts.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Aucune donnée" />
          ) : (
            <List
              size="small"
              dataSource={stats?.topProducts ?? []}
              renderItem={(item, index) => (
                <List.Item className="!px-0">
                  <span>
                    {index + 1}. {item.productName}
                  </span>
                  <Tag>{item.totalQuantity} unité(s)</Tag>
                </List.Item>
              )}
            />
          )}
        </Card>
      </div>

      <Card>
        <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center">
          <Input
            placeholder="Rechercher produit, responsable..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full lg:w-64"
            allowClear
          />
          <Select
            value={motifFilter}
            onChange={setMotifFilter}
            options={MOTIF_OPTIONS}
            className="w-full sm:w-48"
          />
          <RangePicker
            value={dateRange}
            onChange={(dates) => setDateRange(dates)}
            placeholder={['Date début', 'Date fin']}
            format="DD/MM/YYYY"
            className="w-full sm:w-auto"
          />
          {(search || motifFilter !== 'all' || dateRange) && (
            <Button
              type="link"
              onClick={() => {
                setSearch('');
                setMotifFilter('all');
                setDateRange(null);
              }}
            >
              Réinitialiser
            </Button>
          )}
        </div>

        {filteredUsages.length === 0 ? (
          <Empty description="Aucune sortie interne trouvée" />
        ) : (
          <Table
            dataSource={filteredUsages}
            columns={columns}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `${total} sortie(s)`,
            }}
            scroll={{ x: 600 }}
            expandable={{
              expandedRowRender: (record) => (
                <div className="text-sm text-muted">
                  <div>ID : {record.id}</div>
                  <div>Enregistré le : {formatDateTime(record.createdAt)}</div>
                  {record.note && <div>Note : {record.note}</div>}
                </div>
              ),
              rowExpandable: (record) => !!record.note,
            }}
          />
        )}
      </Card>

      <CreateInternalUsageModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </>
  );
}
