import { BookingForm } from "@/components/booking-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function GuestBookingPage() {
    return (
        <div className="container max-w-lg mx-auto py-10 px-4">
            <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al inicio
            </Link>

            <div className="mb-6">
                <h1 className="text-2xl font-bold">Reserva Express</h1>
                <p className="text-muted-foreground">
                    Agenda tu turno rápidamente. El pago total es requerido para confirmar.
                </p>
            </div>

            <BookingForm mode="guest" />
        </div>
    )
}
