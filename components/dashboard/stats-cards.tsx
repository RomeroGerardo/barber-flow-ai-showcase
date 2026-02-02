import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, DollarSign, CalendarCheck, TrendingUp } from "lucide-react"

interface StatsCardsProps {
    totalAppointments: number
    completedAppointments: number
    estimatedRevenue: number
    pendingAppointments: number
}

export function StatsCards({ totalAppointments, completedAppointments, estimatedRevenue, pendingAppointments }: StatsCardsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Ingresos Estimados
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${estimatedRevenue.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">
                        +20.1% desde el mes pasado
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Citas Totales
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalAppointments}</div>
                    <p className="text-xs text-muted-foreground">
                        {pendingAppointments} pendientes de confirmar
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Completadas
                    </CardTitle>
                    <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{completedAppointments}</div>
                    <p className="text-xs text-muted-foreground">
                        Tasa de finalización del {totalAppointments > 0 ? ((completedAppointments / totalAppointments) * 100).toFixed(0) : 0}%
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Crecimiento
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+12%</div>
                    <p className="text-xs text-muted-foreground">
                        Nuevos clientes esta semana
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
