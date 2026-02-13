//Files: src/sections/dashboard/atomic/FollowUpCard.tsx
import React, {useEffect, useState} from 'react';
import dynamic from "next/dynamic";
import type {ApexOptions} from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
});


export default function FollowUpCard() {

    const rataRataTindakLanjut = 77;

    const [animatedValue, setAnimatedValue] = useState(0);

    // 🔥 Animasi smooth naik
    useEffect(() => {
        let start = 0;
        const end = rataRataTindakLanjut;
        const duration = 800; // ms
        const increment = end / (duration / 16);

        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                start = end;
                clearInterval(timer);
            }
            setAnimatedValue(Math.round(start));
        }, 16);

        return () => clearInterval(timer);
    }, []);

    const series = [animatedValue, 100 - animatedValue];

    const donutOptions: ApexOptions = {
        chart: {
            type: "donut",
            toolbar: {show: false},
            sparkline: {enabled: true},
            animations: {
                enabled: true,
                speed: 800,

                animateGradually: {
                    enabled: true,
                    delay: 150,
                },

                dynamicAnimation: {
                    enabled: true,
                    speed: 600,
                },
            },
        },

        colors: ["#22c55e", "#880539"], // hijau + abu

        stroke: {
            width: 0,
        },

        dataLabels: {
            enabled: false,
        },

        legend: {
            show: false,
        },

        tooltip: {
            enabled: false,
        },

        plotOptions: {
            pie: {
                donut: {
                    size: "75%",
                    labels: {
                        show: true,

                        name: {
                            show: false,
                        },

                        value: {
                            show: true,
                            fontSize: "20px",
                            fontWeight: 700,
                            color: "#16a34a",
                            formatter: () => {
                                return `${rataRataTindakLanjut}%\nTindak Lanjut`;
                            },
                        },

                        total: {
                            show: true,
                            showAlways: true,
                            fontSize: "20px",
                            label: "xxxxx",
                            fontWeight: 700,
                            color: "#880539",
                            formatter: () => {
                                return `${rataRataTindakLanjut}%\nTindak Lanjut`;
                            },
                        },
                    },
                },
            },
        },
    };


    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center">

          <h3 className="font-semibold text-gray-700 mb-6">
              Rata-rata Jumlah Tindak Lanjut
          </h3>

          <Chart
              options={donutOptions}
              series={series}
              type="donut"
              height={260}
          />

          <p className="text-sm text-gray-500 mt-4">
              Dari total pelanggaran yang tercatat
          </p>

      </div>
  );
}