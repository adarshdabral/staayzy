import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingNotificationRequest {
  bookingId?: string;
  roomId: string;
  roomTitle: string;
  tenantName: string;
  tenantEmail: string;
  startDate: string;
  monthlyRent: number;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { bookingId, roomId, roomTitle, tenantName, tenantEmail, startDate, monthlyRent }: BookingNotificationRequest = await req.json();

    console.log("Creating booking notification for room:", roomId, "booking:", bookingId);

    // Create notification in database for platform admins
    const { error: notificationError } = await supabase
      .from("admin_notifications")
      .insert({
        type: "booking_request",
        title: "New Booking Request",
        message: `${tenantName} has requested to book "${roomTitle}" starting ${startDate}`,
        data: {
          booking_id: bookingId,
          room_id: roomId,
          room_title: roomTitle,
          tenant_name: tenantName,
          tenant_email: tenantEmail,
          start_date: startDate,
          monthly_rent: monthlyRent,
        },
        target_role: "platform_admin",
      });

    if (notificationError) {
      console.error("Error creating notification:", notificationError);
      // Don't throw - we still want to try sending email
    } else {
      console.log("Database notification created successfully");
    }

    // Send email notification if Resend is configured
    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);

        // Get admin emails (super_admin and platform_admin)
        const { data: adminRoles } = await supabase
          .from("admin_roles")
          .select("user_id")
          .in("admin_role", ["super_admin", "platform_admin"]);

        if (adminRoles && adminRoles.length > 0) {
          const userIds = adminRoles.map((r) => r.user_id);
          
          const { data: profiles } = await supabase
            .from("profiles")
            .select("email")
            .in("id", userIds);

          const adminEmails = profiles?.map((p) => p.email).filter(Boolean) || [];

          if (adminEmails.length > 0) {
            const emailResponse = await resend.emails.send({
              from: "Stazy <onboarding@resend.dev>",
              to: adminEmails,
              subject: `New Booking Request: ${roomTitle}`,
              html: `
                <h1>New Booking Request</h1>
                <p><strong>${tenantName}</strong> (${tenantEmail}) has requested to book:</p>
                <ul>
                  <li><strong>Room:</strong> ${roomTitle}</li>
                  <li><strong>Start Date:</strong> ${startDate}</li>
                  <li><strong>Monthly Rent:</strong> ₹${monthlyRent.toLocaleString()}</li>
                </ul>
                <p>Please log in to the admin panel to review this booking request.</p>
                <p>Best regards,<br>Stazy Platform</p>
              `,
            });

            console.log("Email notification sent:", emailResponse);
          } else {
            console.log("No admin emails found to send notification");
          }
        } else {
          console.log("No admins found in database");
        }
      } catch (emailError) {
        console.error("Error sending email:", emailError);
        // Don't throw - notification was created in database
      }
    } else {
      console.log("RESEND_API_KEY not configured, skipping email notification");
    }

    return new Response(
      JSON.stringify({ success: true, message: "Notification sent successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-booking-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);