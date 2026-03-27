import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { CheckCircle, Circle, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function AttendeeCard({ registration: initialRegistration }) {
  const [isLoading, setIsLoading] = useState(false);
  const [registration, setRegistration] = useState(initialRegistration); // ✅ local state — UI turant update hoga

  const handleManualCheckIn = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/registrations/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrCode: registration.qrCode }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Failed to check in");

      if (result.success) {
        // ✅ UI turant update karo — page refresh nahi chahiye
        setRegistration((prev) => ({
          ...prev,
          checkedIn: true,
          checkedInAt: new Date(),
        }));
        toast.success("Attendee checked in successfully");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to check in attendee");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="py-0">
      <CardContent className="p-4 flex items-start gap-4">
        <div
          className={`mt-1 p-2 rounded-full ${
            registration.checkedIn ? "bg-green-100" : "bg-gray-100"
          }`}
        >
          {registration.checkedIn ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <Circle className="w-5 h-5 text-gray-400" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold mb-1">{registration.attendeeName}</h3>
          <p className="text-sm text-muted-foreground mb-2">
            {registration.attendeeEmail}
          </p>
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span>
              {registration.checkedIn ? "⏰ Checked in" : "📅 Registered"}{" "}
              {registration.checkedIn && registration.checkedInAt
                ? format(new Date(registration.checkedInAt), "PPp")
                : format(new Date(registration.registeredAt), "PPp")}
            </span>
            <span className="font-mono">QR: {registration.qrCode}</span>
          </div>
        </div>

        {!registration.checkedIn && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleManualCheckIn}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Check In
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
