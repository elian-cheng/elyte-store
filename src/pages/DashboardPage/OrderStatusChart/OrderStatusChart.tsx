import React, { FC, useCallback } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import accessibility from 'highcharts/modules/accessibility';
import { IOrder } from 'interfaces/OrderInterface';

accessibility(Highcharts);

interface IOrderStatusChartProps {
  orders: IOrder[];
}

const OrderStatusChart: FC<IOrderStatusChartProps> = ({ orders }) => {
  const calculateStatusCounts = useCallback(() => {
    const statusCounts = orders.reduce(
      (counts, order) => {
        if (order.orderStatus === 'Paid') {
          counts.paid++;
        } else if (order.orderStatus === 'Processing') {
          counts.processing++;
        } else if (order.orderStatus === 'Shipped') {
          counts.shipped++;
        } else if (order.orderStatus === 'Delivered') {
          counts.delivered++;
        }
        return counts;
      },
      { paid: 0, processing: 0, shipped: 0, delivered: 0 }
    );

    return [
      { name: 'Paid', y: statusCounts.paid },
      { name: 'Processing', y: statusCounts.processing },
      { name: 'Shipped', y: statusCounts.shipped },
      { name: 'Delivered', y: statusCounts.delivered },
    ];
  }, [orders]);

  const chartOptions = {
    chart: {
      type: 'pie',
    },
    title: {
      text: 'Order Status Distribution',
      align: 'center',
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}% ({point.y})</b>',
    },
    accessibility: {
      point: {
        valueSuffix: '%',
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        colors: Highcharts.getOptions().colors,
        borderRadius: 5,
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b><br>{point.percentage:.1f} % ({point.y})',
          distance: -50,
          filter: {
            property: 'percentage',
            operator: '>',
            value: 4,
          },
        },
      },
    },
    series: [
      {
        name: 'Status',
        data: calculateStatusCounts(),
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
};

export default OrderStatusChart;
