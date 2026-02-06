import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Users, DollarSign, CalendarCheck, Target, TrendingUp, Receipt } from "lucide-react"

interface StatsCardsProps {
    totalAppointments: number
    completedAppointments: number
    estimatedRevenue: number
    pendingAppointments: number
    dailyGoal?: number
    averageTicket?: number
}

export function StatsCards({
    totalAppointments,
    completedAppointments,
    estimatedRevenue,
    pendingAppointments,
    dailyGoal = 300,
    averageTicket = 0
}: StatsCardsProps) {
    const progressPercent = Math.min((estimatedRevenue / dailyGoal) * 100, 100);
    const isGoalReached = estimatedRevenue >= dailyGoal;

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Ingresos vs Objetivo - DESTACADO */}
            <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Ingresos Hoy
                    </CardTitle>
                    <Target className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                    <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-2xl font-bold">${estimatedRevenue.toFixed(0)}</span>
                        <span className="text-sm text-muted-foreground">/ ${dailyGoal}</span>
                    </div>
                    <Progress
                        value={progressPercent}
                        className="h-2 mb-2"
                    />
                    <p className={`text-xs font-medium ${isGoalReached ? 'text-green-500' : 'text-muted-foreground'}`}>
                        {isGoalReached
                            ? '🎉 ¡Meta alcanzada!'
                            : `Faltan $${(dailyGoal - estimatedRevenue).toFixed(0)} para la meta`
                        }
                    </p>
                </CardContent>
            </Card>

            {/* Ticket Promedio */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Ticket Promedio
                    </CardTitle>
                    <Receipt className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${averageTicket.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">
                        Por cliente atendido
                    </p>
                </CardContent>
            </Card>

            {/* Citas del día */}
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
                        {pendingAppointments > 0
                            ? <span className="text-yellow-500">{pendingAppointments} pendientes</span>
                            : 'Todas confirmadas'
                        }
                    </p>
                </CardContent>
            </Card>

            {/* Completadas */}
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
                        Tasa del {totalAppointments > 0 ? ((completedAppointments / totalAppointments) * 100).toFixed(0) : 0}%
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}

