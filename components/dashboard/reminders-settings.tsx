"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Bell,
    Loader2,
    Clock,
    MessageSquare,
    Save,
    Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ReminderSetting {
    id: number;
    type: string;
    is_enabled: boolean;
    message_template: string;
    hours_before: number;
    send_day: string | null;
    send_time: string | null;
}

const reminderLabels: Record<string, { title: string; description: string }> = {
    appointment_confirmation: {
        title: "Confirmación de Cita",
        description: "Se envía para que el cliente confirme su asistencia"
    },
    appointment_reminder: {
        title: "Recordatorio de Cita",
        description: "Se envía el día anterior a la cita"
    },
    follow_up: {
        title: "Seguimiento Post-Cita",
        description: "Se envía después de la cita para feedback"
    },
    promotion: {
        title: "Promoción",
        description: "Mensajes promocionales periódicos"
    },
};

const placeholderHelp = `
Variables disponibles:
• {client_name} - Nombre del cliente
• {date} - Fecha de la cita
• {time} - Hora de la cita
• {service} - Nombre del servicio
`.trim();

export function RemindersSettings() {
    const [reminders, setReminders] = useState<ReminderSetting[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);
    const [editingReminder, setEditingReminder] = useState<ReminderSetting | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        fetchReminders();
    }, []);

    const fetchReminders = async () => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from("reminder_settings")
            .select("*")
            .order("type");

        if (!error && data) {
            setReminders(data);
        }
        setLoading(false);
    };

    const toggleEnabled = async (reminder: ReminderSetting) => {
        setSaving(reminder.type);
        const supabase = createClient();

        await supabase
            .from("reminder_settings")
            .update({ is_enabled: !reminder.is_enabled })
            .eq("id", reminder.id);

        setReminders(prev =>
            prev.map(r => r.id === reminder.id ? { ...r, is_enabled: !r.is_enabled } : r)
        );
        setSaving(null);
    };

    const handleSave = async () => {
        if (!editingReminder) return;
        setSaving(editingReminder.type);

        const supabase = createClient();
        await supabase
            .from("reminder_settings")
            .update({
                message_template: editingReminder.message_template,
                hours_before: editingReminder.hours_before,
                send_day: editingReminder.send_day,
                send_time: editingReminder.send_time,
            })
            .eq("id", editingReminder.id);

        setReminders(prev =>
            prev.map(r => r.id === editingReminder.id ? editingReminder : r)
        );
        setSaving(null);
        setDialogOpen(false);
    };

    const openEdit = (reminder: ReminderSetting) => {
        setEditingReminder({ ...reminder });
        setDialogOpen(true);
    };

    if (loading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Recordatorios Automáticos
                </CardTitle>
                <CardDescription>
                    Configura los mensajes automáticos que se envían a los clientes
                </CardDescription>
            </CardHeader>
            <CardContent>
                {reminders.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No hay recordatorios configurados</p>
                        <p className="text-sm">Ejecuta la migración SQL primero</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reminders.map((reminder) => {
                            const label = reminderLabels[reminder.type] || {
                                title: reminder.type,
                                description: ""
                            };

                            return (
                                <div
                                    key={reminder.id}
                                    className="flex items-start justify-between p-4 rounded-lg border bg-card"
                                >
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{label.title}</span>
                                            {reminder.type !== "promotion" && reminder.hours_before > 0 && (
                                                <Badge variant="outline" className="text-xs">
                                                    <Clock className="h-3 w-3 mr-1" />
                                                    {reminder.hours_before}h {reminder.type === "follow_up" ? "después" : "antes"}
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {label.description}
                                        </p>
                                        <p className="text-xs text-muted-foreground line-clamp-1 mt-2">
                                            <MessageSquare className="h-3 w-3 inline mr-1" />
                                            {reminder.message_template.substring(0, 60)}...
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 ml-4">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => openEdit(reminder)}
                                        >
                                            Editar
                                        </Button>
                                        <Switch
                                            checked={reminder.is_enabled}
                                            onCheckedChange={() => toggleEnabled(reminder)}
                                            disabled={saving === reminder.type}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Edit Dialog */}
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Editar Recordatorio</DialogTitle>
                        </DialogHeader>
                        {editingReminder && (
                            <div className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label>Mensaje</Label>
                                    <Textarea
                                        value={editingReminder.message_template}
                                        onChange={(e) => setEditingReminder({
                                            ...editingReminder,
                                            message_template: e.target.value
                                        })}
                                        rows={4}
                                    />
                                    <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                                        <Info className="h-4 w-4 mt-0.5 shrink-0" />
                                        <pre className="whitespace-pre-wrap">{placeholderHelp}</pre>
                                    </div>
                                </div>

                                {editingReminder.type !== "promotion" && (
                                    <div className="space-y-2">
                                        <Label>
                                            {editingReminder.type === "follow_up"
                                                ? "Horas después de la cita"
                                                : "Horas antes de la cita"}
                                        </Label>
                                        <Select
                                            value={editingReminder.hours_before.toString()}
                                            onValueChange={(v) => setEditingReminder({
                                                ...editingReminder,
                                                hours_before: parseInt(v)
                                            })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">1 hora</SelectItem>
                                                <SelectItem value="2">2 horas</SelectItem>
                                                <SelectItem value="4">4 horas</SelectItem>
                                                <SelectItem value="12">12 horas</SelectItem>
                                                <SelectItem value="24">24 horas (1 día)</SelectItem>
                                                <SelectItem value="48">48 horas (2 días)</SelectItem>
                                                <SelectItem value="72">72 horas (3 días)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>
                        )}
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setDialogOpen(false)}>
                                Cancelar
                            </Button>
                            <Button onClick={handleSave} disabled={!!saving}>
                                {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                <Save className="h-4 w-4 mr-2" />
                                Guardar
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                        <Info className="h-4 w-4 inline mr-1" />
                        <strong>Nota:</strong> Los recordatorios automáticos requieren integración con Twilio
                        o un servicio similar para envío real de WhatsApp. Por ahora, puedes usar los
                        mensajes predefinidos desde la lista de clientes.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
