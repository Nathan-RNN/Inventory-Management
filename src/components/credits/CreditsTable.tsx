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
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  SearchOutlined,
  EyeOutlined,
  PlusOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { useCredits, useCreditStats } from '@/hooks';
import { ClientCredit, CreditStatus } from '@/types';
import { formatPrice, formatDate } from '@/utils';
import { CreditStatusBadge } from './CreditStatusBadge';
import { CreditDetailDrawer } from './CreditDetailDrawer';
import { CreditPaymentModal } from './CreditPaymentModal';
import { CreateCreditModal } from './CreateCreditModal';

const { RangePicker } = DatePicker;

const STATUS_OPTIONS: { value: CreditStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Tous les statuts' },
  { value: 'PENDING_PAYMENT', label: 'En attente' },
  { value: 'PARTIALLY_PAID', label: 'Partiellement payé' },
  { value: 'PAID', label: 'Soldé' },
  { value: 'CANCELLED', label: 'Annulé' },
];

export function CreditsTable() {
  const { data: credits, isLoading } = useCredits();
  const { data: creditStats, isLoading: statsLoading } = useCreditStats();

  const [selectedCredit, setSelectedCredit] = useState<ClientCredit | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [paymentCredit, setPaymentCredit] = useState<ClientCredit | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<CreditStatus | 'all'>('all');
  const [dateRange, setDateRange] = useState<
    [Dayjs | null, Dayjs | null] | null
  >(null);

  const filteredCredits = useMemo(() => {
    if (!credits) return [];

    return credits.filter((credit) => {
      const matchesSearch =
        search === '' ||
        credit.client.nom.toLowerCase().includes(search.toLowerCase()) ||
        credit.client.telephone.includes(search) ||
        credit.id.includes(search);

      const matchesStatus =
        statusFilter === 'all' || credit.statut === statusFilter;

      let matchesDate = true;
      if (dateRange?.[0] && dateRange[1]) {
        const creditDate = dayjs(credit.createdAt);
        matchesDate =
          creditDate.isAfter(dateRange[0].startOf('day')) &&
          creditDate.isBefore(dateRange[1].endOf('day'));
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [credits, search, statusFilter, dateRange]);

  const handleView = (credit: ClientCredit) => {
    setSelectedCredit(credit);
    setDrawerOpen(true);
  };

  const handlePayment = (credit: ClientCredit) => {
    setPaymentCredit(credit);
    setPaymentModalOpen(true);
  };

  const columns: ColumnsType<ClientCredit> = [
    {
      title: 'Client',
      key: 'client',
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.client.nom}</div>
          <div className="text-xs text-muted">{record.client.telephone}</div>
        </div>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      defaultSortOrder: 'descend',
      render: (date: string) => formatDate(date),
      responsive: ['md'],
    },
    {
      title: 'Total',
      dataIndex: 'montantTotal',
      key: 'montantTotal',
      render: (total: number) => formatPrice(total),
    },
    {
      title: 'Payé',
      dataIndex: 'montantPaye',
      key: 'montantPaye',
      render: (paid: number) => (
        <span className="text-green-600">{formatPrice(paid)}</span>
      ),
      responsive: ['sm'],
    },
    {
      title: 'Reste',
      dataIndex: 'resteAPayer',
      key: 'resteAPayer',
      render: (reste: number) => (
        <span className="font-semibold text-primary">{formatPrice(reste)}</span>
      ),
    },
    {
      title: 'Statut',
      dataIndex: 'statut',
      key: 'statut',
      render: (statut: ClientCredit['statut']) => (
        <CreditStatusBadge status={statut} />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <div className="flex gap-1">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          />
          {(record.statut === 'PENDING_PAYMENT' ||
            record.statut === 'PARTIALLY_PAID') && (
            <Button
              type="text"
              icon={<DollarOutlined />}
              className="text-primary"
              onClick={() => handlePayment(record)}
            />
          )}
        </div>
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
      <div className="mb-4 flex justify-end">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => setCreateModalOpen(true)}
        >
          Nouveau crédit
        </Button>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <Statistic
            title="Total impayé"
            value={creditStats?.totalImpaye ?? 0}
            formatter={(val) => formatPrice(Number(val))}
            loading={statsLoading}
            styles={{ content: { color: '#fa8c16', fontWeight: 600 } }}
          />
        </Card>
        <Card>
          <Statistic
            title="Partiellement payé"
            value={creditStats?.totalPartiel ?? 0}
            formatter={(val) => formatPrice(Number(val))}
            loading={statsLoading}
            styles={{ content: { color: '#1677ff', fontWeight: 600 } }}
          />
        </Card>
        <Card>
          <Statistic
            title="Total soldé"
            value={creditStats?.totalSolde ?? 0}
            formatter={(val) => formatPrice(Number(val))}
            loading={statsLoading}
            styles={{ content: { color: '#52c41a', fontWeight: 600 } }}
          />
        </Card>
        <Card>
          <Statistic
            title="Crédits actifs"
            value={creditStats?.nombreActifs ?? 0}
            loading={statsLoading}
          />
        </Card>
      </div>

      <Card>
        <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center">
          <Input
            placeholder="Rechercher client, téléphone, ID..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full lg:w-64"
            allowClear
          />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            options={STATUS_OPTIONS}
            className="w-full sm:w-48"
          />
          <RangePicker
            value={dateRange}
            onChange={(dates) => setDateRange(dates)}
            placeholder={['Date début', 'Date fin']}
            format="DD/MM/YYYY"
            className="w-full sm:w-auto"
          />
          {(search || statusFilter !== 'all' || dateRange) && (
            <Button
              type="link"
              onClick={() => {
                setSearch('');
                setStatusFilter('all');
                setDateRange(null);
              }}
            >
              Réinitialiser
            </Button>
          )}
        </div>

        {filteredCredits.length === 0 ? (
          <Empty description="Aucun crédit trouvé" />
        ) : (
          <Table
            dataSource={filteredCredits}
            columns={columns}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `${total} crédit(s)`,
            }}
            scroll={{ x: 700 }}
          />
        )}
      </Card>

      <CreditDetailDrawer
        credit={selectedCredit}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedCredit(null);
        }}
        onPayment={(credit) => {
          setDrawerOpen(false);
          handlePayment(credit);
        }}
      />

      <CreditPaymentModal
        credit={paymentCredit}
        open={paymentModalOpen}
        onClose={() => {
          setPaymentModalOpen(false);
          setPaymentCredit(null);
        }}
      />

      <CreateCreditModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </>
  );
}
