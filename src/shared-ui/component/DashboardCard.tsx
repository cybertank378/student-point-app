//Files: src/shared-ui/component/DashboardCard.tsx
import type { IconType } from "react-icons";

interface Props {
    title: string;
    value: string | number;
    icon: IconType;
    subtitle?: string;
    color?: string;
}

export default function DashboardCard({
                                          title,
                                          value,
                                          icon: Icon,
                                          subtitle,
                                          color = "bg-indigo-500",
                                      }: Props) {
    return (
        <div className="bg-white rounded-xl shadow-sm p-5 flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <h2 className="text-2xl font-bold text-gray-800">
                    {value}
                </h2>
                {subtitle && (
                    <p className="text-xs text-gray-400 mt-1">
                        {subtitle}
                    </p>
                )}
            </div>

            <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center text-white ${color}`}
            >
                <Icon size={22} />
            </div>
        </div>
    );
}
