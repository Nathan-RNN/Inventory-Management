'use client';

import { Typography } from 'antd';
import {
  ClockCircleOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  SmileOutlined,
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const advantages = [
  {
    icon: <ClockCircleOutlined style={{ fontSize: 28 }} />,
    title: 'Gain de temps',
    description: 'Réduisez le temps de traitement de chaque vente grâce à une interface optimisée.',
    color: '#1677ff',
  },
  {
    icon: <SafetyOutlined style={{ fontSize: 28 }} />,
    title: 'Réduction des erreurs',
    description: 'Minimisez les erreurs de calcul et de saisie avec notre système automatisé.',
    color: '#52c41a',
  },
  {
    icon: <ThunderboltOutlined style={{ fontSize: 28 }} />,
    title: 'Calcul automatique',
    description: 'Totaux, rendus de monnaie et statistiques calculés instantanément.',
    color: '#fa8c16',
  },
  {
    icon: <SmileOutlined style={{ fontSize: 28 }} />,
    title: 'Interface simple',
    description: 'Conçue pour être utilisée facilement par tous les vendeurs, sans formation.',
    color: '#722ed1',
  },
];

export function AdvantagesSection() {
  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <Title level={2} style={{ marginBottom: 16 }}>
            Pourquoi choisir GestiBoutik ?
          </Title>
          <Paragraph style={{ color: '#595959', fontSize: 16 }}>
            Des avantages concrets pour améliorer votre quotidien
          </Paragraph>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {advantages.map((advantage, index) => (
            <div
              key={index}
              className="flex gap-4 rounded-2xl bg-surface p-6 transition-all duration-300 hover:shadow-md"
            >
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${advantage.color}15`, color: advantage.color }}
              >
                {advantage.icon}
              </div>
              <div>
                <Title level={4} style={{ marginBottom: 8 }}>
                  {advantage.title}
                </Title>
                <Paragraph style={{ color: '#595959', marginBottom: 0 }}>
                  {advantage.description}
                </Paragraph>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
